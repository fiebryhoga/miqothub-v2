<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('password')->nullable(); // Kosong = tidak perlu password
            $table->boolean('is_active')->default(true);
            $table->integer('max_attempts')->default(1); // Batas maksimal mengerjakan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};