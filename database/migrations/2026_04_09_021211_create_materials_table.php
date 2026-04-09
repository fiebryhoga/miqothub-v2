<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained('chapters')->cascadeOnDelete();
            $table->string('judul'); // Cth: "Tata Cara Ihram"
            $table->longText('deskripsi')->nullable(); // Penjelasan teks materi
            
            $table->enum('tipe', ['video', 'pdf', 'text_only']); // Jenis materi
            $table->string('link_video')->nullable(); // URL YouTube / GDrive
            $table->string('file_path')->nullable(); // Path untuk file PDF yang diupload
            
            $table->string('durasi')->nullable(); // Cth: "12 Menit"
            $table->boolean('is_preview')->default(false); // True = Bisa ditonton tanpa beli kelas
            $table->integer('urutan')->default(0); // Untuk sorting urutan materi dalam 1 Bab
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
