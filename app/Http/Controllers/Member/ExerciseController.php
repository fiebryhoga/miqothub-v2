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

        
        if (!$exercise->is_active) {
            return Inertia::render('Member/Exercises/Closed', [
                'material' => $material,
                'exercise' => $exercise
            ]);
        }

        
        $sessionKey = 'unlocked_exercise_' . $exercise->id;
        if ($exercise->password && !session()->has($sessionKey)) {
            return Inertia::render('Member/Exercises/Unlock', [
                'material' => $material,
                'exercise' => $exercise
            ]);
        }

        
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
        $questions = $exercise->questions;
        $userAnswers = $request->input('answers', []);

        $benar = 0;
        
        foreach ($questions as $q) {
            if (isset($userAnswers[$q->id]) && $userAnswers[$q->id] === $q->jawaban_benar) {
                $benar++;
            }
        }

        $totalSoal = $questions->count();
        
        
        $nilai = $totalSoal > 0 ? round(($benar / $totalSoal) * 100) : 0;

        
        \App\Models\ExerciseScore::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'exercise_id' => $exercise->id,
            ],
            [
                'skor' => $nilai,
                'jumlah_benar' => $benar,
                'total_soal' => $totalSoal,
                'dikerjakan_pada' => now(), 
            ]
        );

        return redirect()->route('member.exercise.result', $material->id)
                         ->with('success', 'Latihan berhasil diselesaikan!');
    }
}