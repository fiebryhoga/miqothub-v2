<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'deskripsi',
        'password',
        'is_active',
        'max_attempts',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relasi ke tabel Soal (1 Latihan punya Banyak Soal)
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    // Relasi ke tabel Nilai (1 Latihan punya Banyak Nilai/Riwayat dari berbagai user)
    public function scores()
    {
        return $this->hasMany(ExerciseScore::class);
    }

    // Relasi balik ke Material (Jika ingin mencari materi apa yang memakai latihan ini)
    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}