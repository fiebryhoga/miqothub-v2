<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    
    public function index()
    {
        
        $settings = Setting::pluck('value', 'key')->toArray();
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    
    public function update(Request $request)
    {
        
        $keys = [
            'wa_admin', 
            'bank1_name', 'bank1_number', 'bank1_owner', 'bank1_active',
            'bank2_name', 'bank2_number', 'bank2_owner', 'bank2_active'
        ];

        foreach ($keys as $key) {
            if ($request->has($key)) {
                
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $request->input($key)]
                );
            }
        }

        return back()->with('success', 'Pengaturan sistem berhasil diperbarui!');
    }
}