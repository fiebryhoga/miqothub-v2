<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'chapter_id',
        'judul',
        'deskripsi',
        'tipe',
        'link_video',
        'file_path',
        'durasi',
        'is_preview',
        'urutan',
        
        // Kolom khusus pertemuan
        'tanggal_waktu_meet',
        'link_meet',
        'password_meet',
        
        // Relasi ke latihan
        'exercise_id',
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'tanggal_waktu_meet' => 'datetime', // Otomatis jadi instance Carbon
    ];

    // Relasi balik ke Bab (Chapter)
    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    // Relasi ke tabel Latihan (Hanya berlaku jika tipenya 'latihan')
    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}