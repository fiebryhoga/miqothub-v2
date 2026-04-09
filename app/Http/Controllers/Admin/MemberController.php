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
            'alamat' => 'nullable|string',
            'status' => 'nullable|in:menikah,belum',
            'status_akun' => 'required|in:pending,aktif,suspen',
        ]);

        $member->update([
            'name' => $request->name,
            'email' => $request->email,
            'pekerjaan' => $request->pekerjaan,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'status_akun' => $request->status_akun,
        ]);

        return back()->with('success', 'Data identitas member berhasil diperbarui.');
    }

    public function destroy(User $member)
    {
        $member->delete();
        return back()->with('success', 'Data member dihapus permanen.');
    }
}