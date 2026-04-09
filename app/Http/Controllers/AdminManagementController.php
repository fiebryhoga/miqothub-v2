<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminManagementController extends Controller
{
    // Menampilkan daftar Admin
    public function index()
    {
        $admins = User::where('role', 'admin')->latest()->get()->map(function ($admin) {
            // Ubah path foto agar bisa dibaca di frontend
            $admin->foto_url = $admin->foto_profile ? asset('storage/' . $admin->foto_profile) : null;
            return $admin;
        });

        return Inertia::render('Admin/Admins/Index', [
            'admins' => $admins
        ]);
    }

    // Menampilkan form tambah Admin
    public function create()
    {
        return Inertia::render('Admin/Admins/Create');
    }

    // Menyimpan data Admin baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_profile')) {
            $fotoPath = $request->file('foto_profile')->store('profile_photos', 'public');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
            'foto_profile' => $fotoPath,
        ]);

        return redirect()->route('admin.management.index')->with('success', 'Admin berhasil ditambahkan.');
    }

    // Menampilkan form edit Admin
    public function edit(User $admin)
    {
        $admin->foto_url = $admin->foto_profile ? asset('storage/' . $admin->foto_profile) : null;
        return Inertia::render('Admin/Admins/Edit', [
            'admin' => $admin
        ]);
    }

    // Mengupdate data Admin
    public function update(Request $request, User $admin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $admin->id,
            'password' => ['nullable', Rules\Password::defaults()],
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('foto_profile')) {
            // Hapus foto lama jika ada
            if ($admin->foto_profile) {
                Storage::disk('public')->delete($admin->foto_profile);
            }
            $data['foto_profile'] = $request->file('foto_profile')->store('profile_photos', 'public');
        }

        $admin->update($data);

        return redirect()->route('admin.management.index')->with('success', 'Data Admin berhasil diperbarui.');
    }

    // Menghapus Admin
    public function destroy(User $admin)
    {
        if ($admin->foto_profile) {
            Storage::disk('public')->delete($admin->foto_profile);
        }
        $admin->delete();

        return redirect()->route('admin.management.index')->with('success', 'Admin berhasil dihapus.');
    }
}