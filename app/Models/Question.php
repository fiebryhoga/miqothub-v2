<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'exercise_id',
        'urutan',
        'pertanyaan', 'gambar_soal',
        'opsi_a', 'gambar_a',
        'opsi_b', 'gambar_b',
        'opsi_c', 'gambar_c',
        'opsi_d', 'gambar_d',
        'opsi_e', 'gambar_e',
        'jawaban_benar',
    ];

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}