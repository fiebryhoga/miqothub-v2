<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'fitur',
        'harga',
        'harga_coret',
        'thumbnail',
        'link_grup_wa',
        'batch',
        'status',
        'kuota',
        'tanggal_mulai'
    ];

    /**
     * Konversi tipe data otomatis (Fitur baru standar Laravel 11/12)
     */
    protected function casts(): array
    {
        return [
            'fitur' => 'array', // Mengubah JSON di database menjadi Array di PHP
            'tanggal_mulai' => 'date',
        ];
    }

    /**
     * Relasi: Sebuah kursus bisa dibeli di banyak transaksi
     */
    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class)
                    ->withPivot('harga_saat_beli') // Mengambil data dari tabel pivot
                    ->withTimestamps();
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('urutan', 'asc');
    }
}