<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'nama' => 'Bimbingan Manasik Haji Intensif',
                'batch' => 'Gelombang 1',
                'deskripsi' => 'Program persiapan komprehensif bagi calon petugas haji untuk memahami tata cara, fiqih, dan manajemen pelaksanaan ibadah haji secara mendalam.',
                'fitur' => ['E-Sertifikat Resmi', 'Modul Cetak & PDF', 'Grup Diskusi WhatsApp', 'Simulasi Praktik Lapangan'],
                'harga' => 1500000,
                'harga_coret' => 2000000,
                'status' => 'onsale',
                'kuota' => 50,
                'tanggal_mulai' => now()->addDays(14)->toDateString(),
            ],
            [
                'nama' => 'Sertifikasi Pembimbing Ibadah',
                'batch' => 'Gelombang 1',
                'deskripsi' => 'Program khusus persiapan ujian untuk mendapatkan lisensi resmi sebagai pembimbing ibadah haji bersertifikat.',
                'fitur' => ['Tryout Ujian CBT', 'Akses Materi Seumur Hidup', 'Grup WA Eksklusif Pemateri'],
                'harga' => 2500000,
                'harga_coret' => 3200000,
                'status' => 'onsale',
                'kuota' => 30,
                'tanggal_mulai' => now()->addDays(30)->toDateString(),
            ],
            [
                'nama' => 'Pelatihan Manajemen Kloter',
                'batch' => 'Gelombang 2',
                'deskripsi' => 'Pelatihan kepemimpinan dan manajemen krisis khusus untuk ketua kloter (Karom) dan petugas daerah kerja (Daker) di Arab Saudi.',
                'fitur' => ['E-Sertifikat', 'Studi Kasus Real', 'Konsultasi 1-on-1 dengan Alumni'],
                'harga' => 1000000,
                'harga_coret' => 0,
                'status' => 'offsale', 
                'kuota' => null, 
                'tanggal_mulai' => now()->subDays(10)->toDateString(), 
            ],
        ];

        foreach ($courses as $course) {
            Course::create([
                'nama' => $course['nama'],
                'slug' => Str::slug($course['nama'] . '-' . $course['batch']),
                'deskripsi' => $course['deskripsi'],
                'fitur' => $course['fitur'], 
                'harga' => $course['harga'],
                'harga_coret' => $course['harga_coret'],
                'batch' => $course['batch'],
                'status' => $course['status'],
                'kuota' => $course['kuota'],
                'tanggal_mulai' => $course['tanggal_mulai'],
            ]);
        }
    }
}