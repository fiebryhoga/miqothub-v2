<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminManagementController; 
use App\Http\Controllers\Admin\CourseController; 
use App\Http\Controllers\Admin\MemberController; 
use App\Http\Controllers\Admin\CurriculumController;
use App\Http\Controllers\Member\CourseController as MemberCourseController;
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
            return Inertia::render('Dashboard'); 
        }

        $myCourses = $user->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        return Inertia::render('Member/Dashboard', [
            'myCourses' => $myCourses
        ]);
    })->name('dashboard');

    // -- MEMBER COURSES --
    Route::get('/my-courses', [MemberCourseController::class, 'index'])->name('member.courses.index');
    Route::get('/my-courses/{id}', [MemberCourseController::class, 'show'])->name('member.courses.show');

    // Route::get('/my-courses', [MemberCourseController::class, 'index'])->name('member.courses.index');
    // Route::get('/my-courses/{id}', [MemberCourseController::class, 'show'])->name('member.courses.show');

    Route::get('/katalog', [MemberCourseController::class, 'catalog'])->name('member.catalog');
    Route::post('/katalog/purchase', [MemberCourseController::class, 'purchase'])->name('member.purchase');

    // 👇 INI POSISI YANG BENAR UNTUK ROUTE KUIS MEMBER 👇
    // ==========================================
    // DI DALAM GRUP ROUTE MEMBER (middleware: auth)
    // ==========================================
    Route::prefix('member/materials/{material}/exercise')->name('member.exercise.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Member\ExerciseController::class, 'show'])->name('show');
        Route::post('/verify', [\App\Http\Controllers\Member\ExerciseController::class, 'verifyPassword'])->name('verify');
        Route::post('/submit', [\App\Http\Controllers\Member\ExerciseController::class, 'submit'])->name('submit');
    });
    // 👆 SAMPAI SINI 👆

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
    
    // Manajemen Kelas / Course
    Route::resource('courses', CourseController::class);

    // MANAJEMEN KURIKULUM (BAB & MATERI)
    Route::get('/courses/{course}/curriculum', [CurriculumController::class, 'show'])->name('courses.curriculum');
    
    // Rute untuk Bab
    Route::post('/courses/{course}/chapters', [CurriculumController::class, 'storeChapter'])->name('chapters.store');
    Route::delete('/chapters/{chapter}', [CurriculumController::class, 'destroyChapter'])->name('chapters.destroy');
    Route::put('/chapters/{chapter}', [CurriculumController::class, 'updateChapter'])->name('chapters.update');
    Route::put('/chapters/{chapter}/reorder', [CurriculumController::class, 'reorderChapter'])->name('chapters.reorder');
    
    
    // Rute untuk Update dan Delete (Tetap disatukan karena ID-nya sama-sama ID Material)
    Route::put('/materials/{material}', [CurriculumController::class, 'updateMaterial'])->name('materials.update');
    Route::delete('/materials/{material}', [CurriculumController::class, 'destroyMaterial'])->name('materials.destroy');
    
    // Rute untuk Materi
    Route::post('/chapters/{chapter}/materials', [CurriculumController::class, 'storeMaterial'])->name('materials.store');
    Route::post('/chapters/{chapter}/meetings', [CurriculumController::class, 'storeMeeting'])->name('meetings.store');
    Route::post('/chapters/{chapter}/exercises', [CurriculumController::class, 'storeExercise'])->name('exercises.store');
    
    // Rute untuk Update dan Delete (Tetap disatukan karena ID-nya sama-sama ID Material)
    Route::put('/materials/{material}', [CurriculumController::class, 'updateMaterial'])->name('materials.update');
    Route::delete('/materials/{material}', [CurriculumController::class, 'destroyMaterial'])->name('materials.destroy');
    Route::put('/materials/{material}/reorder', [CurriculumController::class, 'reorderMaterial'])->name('materials.reorder');


    Route::get('/members', [MemberController::class, 'index'])->name('members.index');
    Route::post('/members', [MemberController::class, 'store'])->name('members.store');
    Route::post('/members/{member}/enroll', [MemberController::class, 'enrollCourse'])->name('members.enroll');
    Route::delete('/members/{member}/unenroll/{course}', [MemberController::class, 'unenrollCourse'])->name('members.unenroll');
    Route::put('/members/{member}/verify', [MemberController::class, 'verify'])->name('members.verify');
    Route::put('/members/{member}/reject', [MemberController::class, 'reject'])->name('members.reject');
    Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');

    // Manajemen Induk Latihan & Soal (ADMIN)
    Route::resource('exercises', \App\Http\Controllers\Admin\ExerciseController::class);
    Route::post('/exercises/{exercise}/questions', [\App\Http\Controllers\Admin\ExerciseController::class, 'storeQuestion'])->name('questions.store');
    Route::delete('/questions/{question}', [\App\Http\Controllers\Admin\ExerciseController::class, 'destroyQuestion'])->name('questions.destroy');
    
    // 👇 TAMBAHKAN DUA ROUTE INI 👇
    Route::put('/exercises/{exercise}/reorder-questions', [\App\Http\Controllers\Admin\ExerciseController::class, 'reorderQuestions'])->name('questions.reorder');
    Route::put('/questions/{question}', [\App\Http\Controllers\Admin\ExerciseController::class, 'updateQuestion'])->name('questions.update');
    
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Bawaan Laravel Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';