<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function index()
    {
        $exercises = Exercise::withCount('questions')->with('materials')->latest()->get();
        return Inertia::render('Admin/Exercises/Index', ['exercises' => $exercises]);
    }

    public function show(Exercise $exercise)
    {
        // 👇 PERBAIKAN: Load 'materials.chapter' agar Tombol Kembali Kurikulum berfungsi!
        $exercise->load([
            'questions' => function ($query) { $query->orderBy('urutan', 'asc'); },
            'materials.chapter' 
        ]);

        $scores = \App\Models\ExerciseScore::where('exercise_id', $exercise->id)
            ->with('user:id,name,email') 
            ->orderBy('skor', 'desc') 
            ->get();

        return Inertia::render('Admin/Exercises/Show', [
            'exercise' => $exercise,
            'scores' => $scores
        ]);
    }

    // ==========================================
    // UPDATE PENGATURAN LATIHAN
    // ==========================================
    public function update(Request $request, Exercise $exercise)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'password' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'waktu_menit' => 'required|integer|min:1', // <-- UBAH KE WAKTU_MENIT
        ]);

        $exercise->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'password' => $request->password,
            'is_active' => $request->is_active ?? false,
            'waktu_menit' => $request->waktu_menit, // <-- UBAH KE WAKTU_MENIT
        ]);

        return back()->with('success', 'Pengaturan Kuis/Latihan berhasil diperbarui!');
    }

    // Fungsi Helper untuk Upload Gambar
    private function uploadImage($request, $fieldName, $oldPath = null)
    {
        if ($request->hasFile($fieldName)) {
            if ($oldPath) Storage::disk('public')->delete($oldPath);
            return $request->file($fieldName)->store('question_images', 'public');
        }
        return $oldPath; // Jika tidak ada file baru, kembalikan nama file lama
    }

    // ==========================================
    // TAMBAH SOAL
    // ==========================================
    public function storeQuestion(Request $request, Exercise $exercise)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban_benar' => 'required|in:a,b,c,d,e',
            'opsi_a' => 'required|string', 'opsi_b' => 'required|string',
            'opsi_c' => 'required|string', 'opsi_d' => 'required|string', 'opsi_e' => 'required|string',
            // Validasi file gambar opsional (maks 2MB)
            'gambar_soal' => 'nullable|image|max:2048',
            'gambar_a' => 'nullable|image|max:2048', 'gambar_b' => 'nullable|image|max:2048',
            'gambar_c' => 'nullable|image|max:2048', 'gambar_d' => 'nullable|image|max:2048', 'gambar_e' => 'nullable|image|max:2048',
        ]);

        $data = $request->all();
        
        // Atur urutan otomatis di nomor paling belakang
        $maxUrutan = $exercise->questions()->max('urutan');
        $data['urutan'] = $maxUrutan ? $maxUrutan + 1 : 1;
        $data['exercise_id'] = $exercise->id;

        // Proses Upload
        $fields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e'];
        foreach ($fields as $field) {
            $data[$field] = $this->uploadImage($request, $field);
        }

        Question::create($data);
        return back()->with('success', 'Soal berhasil ditambahkan!');
    }

    // ==========================================
    // UPDATE / EDIT SOAL
    // ==========================================
    public function updateQuestion(Request $request, Question $question)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban_benar' => 'required|in:a,b,c,d,e',
            'opsi_a' => 'required|string', 'opsi_b' => 'required|string',
            'opsi_c' => 'required|string', 'opsi_d' => 'required|string', 'opsi_e' => 'required|string',
            'gambar_soal' => 'nullable|image|max:2048',
            'gambar_a' => 'nullable|image|max:2048', 'gambar_b' => 'nullable|image|max:2048',
            'gambar_c' => 'nullable|image|max:2048', 'gambar_d' => 'nullable|image|max:2048', 'gambar_e' => 'nullable|image|max:2048',
        ]);

        $data = $request->except(['_method', 'remove_gambar_soal', 'remove_gambar_a', 'remove_gambar_b', 'remove_gambar_c', 'remove_gambar_d', 'remove_gambar_e']);

        $fields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e'];
        foreach ($fields as $field) {
            // Cek apakah admin secara eksplisit meminta gambar lama dihapus (tombol tong sampah diklik)
            $removeField = 'remove_' . $field;
            
            if ($request->$removeField == 'true' || $request->$removeField == 1) {
                if ($question->$field) Storage::disk('public')->delete($question->$field);
                $data[$field] = null;
            } else {
                // Proses upload seperti biasa (jika ada file baru yang menimpa yang lama)
                $data[$field] = $this->uploadImage($request, $field, $question->$field);
            }
        }

        $question->update($data);
        return back()->with('success', 'Soal berhasil diperbarui!');
    }

    // ==========================================
    // URUTKAN SOAL (REORDER)
    // ==========================================
    public function reorderQuestions(Request $request, Exercise $exercise)
    {
        // Menerima array: [['id' => 1, 'urutan' => 1], ['id' => 3, 'urutan' => 2]]
        $request->validate([
            'ordered_ids' => 'required|array',
        ]);

        foreach ($request->ordered_ids as $index => $id) {
            Question::where('id', $id)->where('exercise_id', $exercise->id)->update(['urutan' => $index + 1]);
        }

        return back()->with('success', 'Urutan soal berhasil diperbarui!');
    }

    // ==========================================
    // HAPUS SOAL
    // ==========================================
    public function destroyQuestion(Question $question)
    {
        // Hapus file fisik gambar jika ada
        $fields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e'];
        foreach ($fields as $field) {
            if ($question->$field) Storage::disk('public')->delete($question->$field);
        }

        $question->delete();
        return back()->with('success', 'Soal berhasil dihapus!');
    }
}