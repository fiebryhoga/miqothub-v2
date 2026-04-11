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
        'waktu_menit',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function questions() { return $this->hasMany(Question::class); }
    public function scores() { return $this->hasMany(ExerciseScore::class); }
    public function materials() { return $this->hasMany(Material::class); }
}