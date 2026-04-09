<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            
            // Kolom Urutan
            $table->integer('urutan')->default(0);
            
            // Teks dan Gambar Soal Utama
            $table->text('pertanyaan');
            $table->string('gambar_soal')->nullable();
            
            // Teks dan Gambar Opsi
            $table->text('opsi_a');
            $table->string('gambar_a')->nullable();
            $table->text('opsi_b');
            $table->string('gambar_b')->nullable();
            $table->text('opsi_c');
            $table->string('gambar_c')->nullable();
            $table->text('opsi_d');
            $table->string('gambar_d')->nullable();
            $table->text('opsi_e');
            $table->string('gambar_e')->nullable();
            
            $table->enum('jawaban_benar', ['a', 'b', 'c', 'd', 'e']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};