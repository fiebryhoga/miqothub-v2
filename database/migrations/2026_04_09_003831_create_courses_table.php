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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi');
            $table->json('fitur')->nullable(); // Disimpan dalam format JSON (misal: ["Sertifikat", "Grup WA"])
            $table->integer('harga')->default(0);
            $table->integer('harga_coret')->default(0);
            $table->string('thumbnail')->nullable();
            $table->string('link_grup_wa')->nullable();
            $table->string('batch');
            $table->enum('status', ['onsale', 'offsale'])->default('onsale');
            $table->integer('kuota')->nullable();
            $table->date('tanggal_mulai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
