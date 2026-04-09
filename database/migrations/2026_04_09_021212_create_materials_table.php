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
            $table->string('judul'); 
            $table->longText('deskripsi')->nullable(); 
            
            // Tipe sudah mencakup semuanya
            $table->enum('tipe', ['video', 'pdf', 'text_only', 'pertemuan', 'latihan']); 
            $table->string('link_video')->nullable(); 
            $table->string('file_path')->nullable(); 
            
            $table->string('durasi')->nullable(); 
            $table->boolean('is_preview')->default(false); 
            $table->integer('urutan')->default(0); 
            
            // ==========================================
            // KOLOM BARU UNTUK FITUR PERTEMUAN
            // ==========================================
            $table->dateTime('tanggal_waktu_meet')->nullable();
            $table->string('link_meet')->nullable();
            $table->string('password_meet')->nullable();
            
            // ==========================================
            // KOLOM BARU UNTUK FITUR LATIHAN
            // ==========================================
            // Relasi ke tabel Latihan (Jika materinya bertipe latihan)
            $table->foreignId('exercise_id')->nullable()->constrained('exercises')->nullOnDelete();
            
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