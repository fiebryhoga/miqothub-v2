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
}