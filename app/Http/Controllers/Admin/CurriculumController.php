<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CurriculumController extends Controller
{
    // Menampilkan Halaman Kurikulum suatu Kelas
    public function show(Course $course)
    {
        // Ambil data kelas beserta seluruh bab dan materinya
        $course->load(['chapters.materials']);

        return Inertia::render('Admin/Courses/Curriculum', [
            'course' => $course
        ]);
    }

    // ==========================================
    // BAGIAN BAB (CHAPTER)
    // ==========================================
    public function storeChapter(Request $request, Course $course)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'urutan' => 'required|integer|min:0',
        ]);

        $course->chapters()->create([
            'judul' => $request->judul,
            'urutan' => $request->urutan,
        ]);

        return back()->with('success', 'Bab baru berhasil ditambahkan!');
    }

    public function destroyChapter(Chapter $chapter)
    {
        $chapter->delete(); // Otomatis menghapus materi di dalamnya karena cascadeOnDelete
        return back()->with('success', 'Bab dan seluruh materinya berhasil dihapus.');
    }

    // ==========================================
    // BAGIAN MATERI (MATERIAL)
    // ==========================================
    public function storeMaterial(Request $request, Chapter $chapter)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:video,pdf,text_only',
            'deskripsi' => 'nullable|string',
            'link_video' => 'nullable|url|required_if:tipe,video',
            'file_path' => 'nullable|file|mimes:pdf|max:10240|required_if:tipe,pdf', // Max 10MB
            'durasi' => 'nullable|string|max:50',
            'is_preview' => 'boolean',
            'urutan' => 'required|integer|min:0',
        ]);

        $filePath = null;
        if ($request->hasFile('file_path')) {
            $filePath = $request->file('file_path')->store('course_materials', 'public');
        }

        $chapter->materials()->create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tipe' => $request->tipe,
            'link_video' => $request->link_video,
            'file_path' => $filePath,
            'durasi' => $request->durasi,
            'is_preview' => $request->is_preview ?? false,
            'urutan' => $request->urutan,
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan ke dalam Bab!');
    }

    public function destroyMaterial(Material $material)
    {
        // Hapus file fisik PDF jika ada
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }
        
        $material->delete();
        return back()->with('success', 'Materi berhasil dihapus.');
    }
}