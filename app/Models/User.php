<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status_akun', // Pastikan ini ada
        'foto_profile',
        'alamat',
        'pekerjaan',
        'umur',        // <--- Tambahkan ini
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Helper: Mendapatkan semua kursus yang dimiliki user (yang sudah lunas/terverifikasi)
     */

    /**
     * Helper: Mendapatkan semua kursus yang dimiliki user (yang sudah lunas/terverifikasi)
     */
    public function courses()
    {
        return \App\Models\Course::join('course_transaction', 'courses.id', '=', 'course_transaction.course_id')
            ->join('transactions', 'transactions.id', '=', 'course_transaction.transaction_id')
            ->where('transactions.user_id', $this->id)
            ->where('transactions.status', 'verified')
            ->select('courses.*')
            ->distinct(); // Pakai distinct agar kelas tidak dobel kalau misal ada transaksi berulang
    }

    public function exerciseScores() {
        return $this->hasMany(ExerciseScore::class);
    }
}
