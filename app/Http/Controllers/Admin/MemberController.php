<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{

    public function index()
    {
        $members = User::where('role', 'member')->with(['transactions.courses'])->latest()->get()->map(function ($member) {
            if ($member->transactions->isNotEmpty() && $member->transactions->first()->bukti_pembayaran) {
                $member->transactions->first()->bukti_url = asset('storage/' . $member->transactions->first()->bukti_pembayaran);
            }
            return $member;
        });

        // KITA KIRIM JUGA SEMUA DATA KELAS KE FRONTEND
        $allCourses = \App\Models\Course::select('id', 'nama', 'harga', 'batch')->get();

        return Inertia::render('Admin/Members/Index', [
            'members' => $members,
            'allCourses' => $allCourses // Tambahan baru
        ]);
    }

    // Fungsi Tambah Member Manual oleh Admin
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'pekerjaan' => 'nullable|string|max:255',
            'umur' => 'nullable|integer|min:1',
            'alamat' => 'nullable|string',
            'status' => 'nullable|in:menikah,belum',
            'status_akun' => 'required|in:pending,aktif,suspen',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'member',
            'pekerjaan' => $request->pekerjaan,
            'umur' => $request->umur,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'status_akun' => $request->status_akun,
        ]);

        return back()->with('success', 'Member baru berhasil ditambahkan secara manual.');
    }

    public function verify(Request $request, User $member)
    {
        // Validasi array kelas hasil editan admin
        $request->validate([
            'course_ids' => 'required|array|min:1',
            'course_ids.*' => 'exists:courses,id',
        ]);

        $member->update(['status_akun' => 'aktif']);

        $transaction = Transaction::where('user_id', $member->id)->where('status', 'pending')->first();

        if ($transaction) {
            $transaction->update(['status' => 'verified']);
            
            // Hitung harga ulang berdasarkan kelas yang dicentang admin
            $courses = \App\Models\Course::whereIn('id', $request->course_ids)->get();
            
            $pivotData = [];
            foreach ($courses as $course) {
                $pivotData[$course->id] = ['harga_saat_beli' => $course->harga];
            }
            
            // Sync akan menghapus kelas lama dan memasukkan kelas baru yang dicentang
            $transaction->courses()->sync($pivotData);
            
            // Update total transaksi di database
            $transaction->update(['total_harga' => $courses->sum('harga')]);
        }

        return back()->with('success', 'Akun diaktifkan dan kelas berhasil disesuaikan!');
    }

    

    // Fungsi Tolak / Suspend
    public function reject(User $member)
    {
        $member->update(['status_akun' => 'suspen']);

        Transaction::where('user_id', $member->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        return back()->with('success', 'Pendaftaran ditolak/ditangguhkan.');
    }

    public function update(Request $request, User $member)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $member->id,
            'pekerjaan' => 'nullable|string|max:255',
            'umur' => 'nullable|integer|min:1',
            'alamat' => 'nullable|string',
            'status' => 'nullable|in:menikah,belum',
            'status_akun' => 'required|in:pending,aktif,suspen',
            'password' => 'nullable|string|min:8', // Validasi Password Opsional
            'foto_profile' => 'nullable|image|max:2048', // Validasi Foto Opsional
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'pekerjaan' => $request->pekerjaan,
            'umur' => $request->umur,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'status_akun' => $request->status_akun,
        ];

        // Jika password diisi, enkripsi dan simpan. Jika kosong, biarkan password lama.
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        // Jika ada upload foto profil baru
        if ($request->hasFile('foto_profile')) {
            // Hapus foto lama jika ada
            if ($member->foto_profile) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($member->foto_profile);
            }
            $data['foto_profile'] = $request->file('foto_profile')->store('profile_photos', 'public');
        }

        $member->update($data);

        return back()->with('success', 'Profil lengkap member berhasil diperbarui.');
    }

    public function destroy(User $member)
    {
        $member->delete();
        return back()->with('success', 'Data member dihapus permanen.');
    }

    public function enrollCourse(Request $request, User $member)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $course = \App\Models\Course::find($request->course_id);

        // Buat transaksi manual (otomatis statusnya 'verified')
        $transaction = \App\Models\Transaction::create([
            'user_id' => $member->id,
            'kode_transaksi' => 'MANUAL-' . date('Ymd') . '-' . strtoupper(uniqid()),
            'total_harga' => 0, // Karena admin yang memasukkan, bayar offline/gratis
            'status' => 'verified',
            'bukti_pembayaran' => 'Diinput Manual Oleh Admin',
        ]);

        // Masukkan kelas ke transaksi ini
        $transaction->courses()->attach($course->id, [
            'harga_saat_beli' => $course->harga
        ]);

        return back()->with('success', "Berhasil! Member telah diberikan akses ke kelas {$course->nama}.");
    }

    // ==========================================
    // CABUT AKSES MEMBER DARI KELAS
    // ==========================================
    public function unenrollCourse(User $member, $courseId)
    {
        // Cari semua transaksi user ini yang mengandung course_id tersebut
        $transactions = $member->transactions()->whereHas('courses', function($q) use ($courseId) {
            $q->where('courses.id', $courseId);
        })->get();

        foreach ($transactions as $trx) {
            // Cabut relasinya
            $trx->courses()->detach($courseId);
            
            // Jika transaksinya jadi kosong (tidak ada kelas lain di struk tsb), hapus transaksinya sekalian
            if ($trx->courses()->count() === 0) {
                $trx->delete();
            }
        }

        return back()->with('success', 'Akses member dari kelas tersebut berhasil dicabut.');
    }
}