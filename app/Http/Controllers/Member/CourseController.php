<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Menampilkan daftar 'Kelas Saya' (Sudah diletakkan di Dashboard sebelumnya, 
     * tapi ini kalau mau dipisah halamannya)
     */
    public function index()
    {
        $myCourses = Auth::user()->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        return Inertia::render('Member/Courses/Index', [
            'myCourses' => $myCourses
        ]);
    }

    /**
     * Menampilkan Ruang Belajar untuk 1 Kelas spesifik
     */
    public function show($id)
    {
        $user = Auth::user();
        
        // 1. KEAMANAN: Pastikan user benar-benar memiliki kelas ini (sudah verified)
        $hasCourse = $user->courses()->where('courses.id', $id)->exists();

        if (!$hasCourse) {
            // Jika iseng nembak URL ID kelas lain, lemparkan error 403 Forbidden
            abort(403, 'Akses Ditolak. Anda belum membeli atau menyelesaikan pembayaran untuk kelas ini.');
        }

        // 2. Ambil data course beserta kurikulum (chapters & materials)
        $course = Course::with(['chapters' => function($query) {
            $query->orderBy('created_at', 'asc'); // Urutkan bab dari yang pertama dibuat
        }, 'chapters.materials' => function($query) {
            $query->orderBy('created_at', 'asc'); // Urutkan materi
        }])->findOrFail($id);

        return Inertia::render('Member/Courses/Show', [
            'course' => $course
        ]);
    }

    // Menampilkan daftar kelas yang BELUM dibeli oleh member
    public function catalog()
    {
        $user = auth()->user();
        
        // Cari ID kelas yang sudah dimiliki atau sedang diproses (pending)
        $ownedCourseIds = \App\Models\Transaction::where('user_id', $user->id)
            ->whereIn('status', ['verified', 'pending'])
            ->with('courses')
            ->get()
            ->pluck('courses.*.id')
            ->flatten()
            ->unique()
            ->toArray();

        // Tampilkan kelas yang statusnya 'onsale' dan belum dimiliki member
        $availableCourses = \App\Models\Course::where('status', 'onsale')
            ->whereNotIn('id', $ownedCourseIds)
            ->get()
            ->map(function ($course) {
                $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
                return $course;
            });

        return \Inertia\Inertia::render('Member/Courses/Catalog', [
            'courses' => $availableCourses
        ]);
    }

    // Memproses pengajuan pembelian kelas baru
    public function purchase(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $course = \App\Models\Course::find($request->course_id);
        $buktiPath = $request->file('bukti_pembayaran')->store('bukti_transfer', 'public');

        $transaction = \App\Models\Transaction::create([
            'user_id' => auth()->id(),
            'kode_transaksi' => 'INV-' . date('Ymd') . '-' . strtoupper(uniqid()),
            'total_harga' => $course->harga,
            'bukti_pembayaran' => $buktiPath,
            'status' => 'pending', // Masuk antrean Admin
        ]);

        $transaction->courses()->attach($course->id, ['harga_saat_beli' => $course->harga]);

        return redirect()->route('dashboard')->with('success', 'Pengajuan kelas berhasil dikirim! Mohon tunggu Admin memverifikasi bukti transfer Anda.');
    }
}