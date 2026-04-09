<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminManagementController; // Pastikan ini di-import
use App\Http\Controllers\Admin\CourseController; // Tambahkan import ini di atas
use App\Http\Controllers\Admin\MemberController; // Tambahkan ini di atas
use App\Http\Controllers\Admin\CurriculumController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Bisa diakses siapa saja)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Harus Login - Berlaku untuk Member & Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->role === 'admin') {
            // Tampilkan halaman Dashboard Admin yang sudah kita buat sebelumnya
            return Inertia::render('Dashboard'); 
        }

        // UNTUK MEMBER: Ambil kelas yang transaksinya sudah 'verified'
        $myCourses = $user->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        // Tampilkan halaman khusus Member
        return Inertia::render('Member/Dashboard', [
            'myCourses' => $myCourses
        ]);
    })->name('dashboard');

    Route::get('/my-courses', function () {
        $user = auth()->user();
        
        // Ambil data kelas milik user (bisa disesuaikan dengan relasi database Anda)
        $myCourses = $user->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        return Inertia::render('Member/Courses/Index', [
            'myCourses' => $myCourses
        ]);
    })->name('member.courses.index');

    // Pengaturan Profil
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

});

/*
|--------------------------------------------------------------------------
| Admin Only Routes (Harus Login & Role: Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    Route::get('/management', [AdminManagementController::class, 'index'])->name('management.index');
    Route::post('/management', [AdminManagementController::class, 'store'])->name('management.store');
    Route::put('/management/{admin}', [AdminManagementController::class, 'update'])->name('management.update');
    Route::delete('/management/{admin}', [AdminManagementController::class, 'destroy'])->name('management.destroy');
    
    // Manajemen Kelas / Course (TAMBAHKAN INI)
    Route::resource('courses', CourseController::class);

    // MANAJEMEN KURIKULUM (BAB & MATERI)
    Route::get('/courses/{course}/curriculum', [CurriculumController::class, 'show'])->name('courses.curriculum');
    
    // Rute untuk Bab
    Route::post('/courses/{course}/chapters', [CurriculumController::class, 'storeChapter'])->name('chapters.store');
    Route::delete('/chapters/{chapter}', [CurriculumController::class, 'destroyChapter'])->name('chapters.destroy');
    
    // Rute untuk Materi
    Route::post('/chapters/{chapter}/materials', [CurriculumController::class, 'storeMaterial'])->name('materials.store');
    Route::delete('/materials/{material}', [CurriculumController::class, 'destroyMaterial'])->name('materials.destroy');

    Route::get('/members', [MemberController::class, 'index'])->name('members.index');
    Route::put('/members/{member}/verify', [MemberController::class, 'verify'])->name('members.verify');
    Route::put('/members/{member}/reject', [MemberController::class, 'reject'])->name('members.reject');
    Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update'); // TAMBAHKAN INI
    Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');
    
    // Nanti route Modul Kursus dan Data Member diletakkan di sini...
    
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Bawaan Laravel Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';