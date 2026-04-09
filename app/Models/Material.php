<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'chapter_id', 'judul', 'deskripsi', 'tipe', 
        'link_video', 'file_path', 'durasi', 'is_preview', 'urutan'
    ];

    protected function casts(): array
    {
        return [
            'is_preview' => 'boolean',
        ];
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}