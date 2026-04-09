<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExerciseScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exercise_id',
        'skor',
        'jumlah_benar',
        'total_soal',
        'dikerjakan_pada',
    ];

    protected $casts = [
        'dikerjakan_pada' => 'datetime',
    ];

    // Pemilik nilai (User/Member)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Latihan yang dikerjakan
    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}