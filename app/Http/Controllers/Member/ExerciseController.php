<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\ExerciseScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function show(Material $material)
    {
        $exercise = $material->exercise()->with('questions')->firstOrFail();
        $user = Auth::user();

        // 1. CEK NILAI DULUAN: Kalau sudah pernah ngerjain, langsung tampilkan nilainya.
        // Meskipun kuis sudah ditutup, member yang sudah ngerjain tetep berhak lihat nilainya.
        $existingScore = ExerciseScore::where('user_id', $user->id)
                                      ->where('exercise_id', $exercise->id)
                                      ->first();

        if ($existingScore) {
            return Inertia::render('Member/Exercises/Result', [
                'material' => $material,
                'exercise' => $exercise,
                'score' => $existingScore
            ]);
        }

        // 2. CEK STATUS KUIS: Kalau belum ngerjain dan kuis ditutup, tampilkan halaman Closed
        if (!$exercise->is_active) {
            return Inertia::render('Member/Exercises/Closed', [
                'material' => $material,
                'exercise' => $exercise
            ]);
        }

        // 3. CEK PASSWORD
        $sessionKey = 'unlocked_exercise_' . $exercise->id;
        if ($exercise->password && !session()->has($sessionKey)) {
            return Inertia::render('Member/Exercises/Unlock', [
                'material' => $material,
                'exercise' => $exercise
            ]);
        }

        // 4. TAMPILKAN SOAL (Kunci Jawaban Disembunyikan)
        $questions = $exercise->questions->map(function($q) {
            return collect($q)->except(['jawaban_benar', 'created_at', 'updated_at']);
        });

        return Inertia::render('Member/Exercises/Quiz', [
            'material' => $material,
            'exercise' => $exercise,
            'questions' => $questions
        ]);
    }

    public function verifyPassword(Request $request, Material $material)
    {
        $exercise = $material->exercise;
        if ($request->password === $exercise->password) {
            session()->put('unlocked_exercise_' . $exercise->id, true);
            return redirect()->route('member.exercise.show', $material->id);
        }
        return back()->withErrors(['password' => 'Password yang Anda masukkan salah.']);
    }

    public function submit(Request $request, Material $material)
    {
        $exercise = $material->exercise;
        $user = Auth::user();

        // Cegah member ngerjain lebih dari 1 kali
        if (ExerciseScore::where('user_id', $user->id)->where('exercise_id', $exercise->id)->exists()) {
            return redirect()->route('member.exercise.show', $material->id);
        }

        $userAnswers = $request->input('answers', []); 
        $questions = $exercise->questions;
        $jumlahBenar = 0;
        $totalSoal = $questions->count();

        if ($totalSoal === 0) return back()->with('error', 'Latihan ini belum memiliki soal.');

        foreach ($questions as $question) {
            if (isset($userAnswers[$question->id]) && $userAnswers[$question->id] === $question->jawaban_benar) {
                $jumlahBenar++;
            }
        }

        $skorAkhir = round(($jumlahBenar / $totalSoal) * 100);

        ExerciseScore::create([
            'user_id' => $user->id,
            'exercise_id' => $exercise->id,
            'skor' => $skorAkhir,
            'jumlah_benar' => $jumlahBenar,
            'total_soal' => $totalSoal,
            'dikerjakan_pada' => now(),
        ]);

        return redirect()->route('member.exercise.show', $material->id);
    }
}