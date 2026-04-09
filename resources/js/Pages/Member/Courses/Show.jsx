// resources/js/Pages/Member/Courses/Show.jsx
import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import MaterialViewer from './Partials/MaterialViewer';
import CurriculumSidebar from './Partials/CurriculumSidebar';

export default function Show({ auth, course }) {
    // Mencari materi pertama untuk dijadikan default saat halaman dibuka
    const firstChapter = course.chapters?.[0];
    const firstMaterial = firstChapter?.materials?.[0] || null;

    const [activeMaterial, setActiveMaterial] = useState(firstMaterial);
    const [expandedChapters, setExpandedChapters] = useState(firstChapter ? [firstChapter.id] : []);

    // ==========================================
    // SCRIPT ANTI-MALING (PROTEKSI SPESIFIK)
    // ==========================================
    useEffect(() => {
        // 1. Blokir Klik Kanan
        const handleContextMenu = (e) => e.preventDefault();

        // 2. Blokir Keyboard Super Agresif
        const handleAggressiveKeyDown = (e) => {
            const allowedKeys = [
                'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'PageUp', 'PageDown', 'Home', 'End', ' ', 'F5'
            ];

            const isRefresh = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r';

            if (!allowedKeys.includes(e.key) && !isRefresh) {
                e.preventDefault();
                if (e.key === 'PrintScreen' || e.metaKey || e.ctrlKey) {
                    navigator.clipboard.writeText(''); 
                }
            }
        };

        // 3. Mencegah Drag & Drop Gambar/Teks
        const handleDragStart = (e) => e.preventDefault();

        // Pasang event listener
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleAggressiveKeyDown);
        document.addEventListener('dragstart', handleDragStart);

        // Bersihkan event listener ketika member keluar
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleAggressiveKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    const toggleChapter = (id) => {
        setExpandedChapters(prev => 
            prev.includes(id) ? prev.filter(chapId => chapId !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title={`${course.nama} - Ruang Belajar`} />

            {/* TOP NAVBAR */}
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('member.courses.index')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 pr-4">
                            <ArrowLeft size={20} /> <span className="hidden md:block text-sm font-bold text-slate-300">Kelas Saya</span>
                        </Link>
                        <div>
                            <h1 className="font-bold text-lg leading-tight hidden md:block">{course.nama}</h1>
                            <p className="text-xs text-slate-400">Ruang Kelas</p>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row items-start gap-6 p-4 md:p-6 select-none">
                
                {/* KIRI: AREA KONTEN UTAMA */}
                <div className="w-full lg:flex-1">
                    <MaterialViewer activeMaterial={activeMaterial} />
                </div>

                {/* KANAN: SIDEBAR KURIKULUM */}
                <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
                    <CurriculumSidebar 
                        course={course} 
                        activeMaterial={activeMaterial} 
                        setActiveMaterial={setActiveMaterial} 
                        expandedChapters={expandedChapters} 
                        toggleChapter={toggleChapter} 
                    />
                </div>

            </div>
        </div>
    );
}