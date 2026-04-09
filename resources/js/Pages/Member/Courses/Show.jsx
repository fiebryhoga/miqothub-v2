import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PlayCircle, FileBadge, FileText, MonitorPlay, ClipboardList, 
    ChevronDown, ChevronUp, Clock, Calendar, Lock, ArrowLeft, Download, CheckCircle2
} from 'lucide-react';

export default function Show({ auth, course }) {
    // Mencari materi pertama untuk dijadikan default saat halaman dibuka
    const firstChapter = course.chapters?.[0];
    const firstMaterial = firstChapter?.materials?.[0] || null;

    const [activeMaterial, setActiveMaterial] = useState(firstMaterial);
    const [expandedChapters, setExpandedChapters] = useState(firstChapter ? [firstChapter.id] : []);

    // ==========================================
    // SCRIPT ANTI-MALING (PROTEKSI SPESIFIK)
    // ==========================================
    // ==========================================
    // SCRIPT ANTI-MALING (MODE GEMBOK KEYBOARD)
    // ==========================================
    useEffect(() => {
        // 1. Blokir Klik Kanan
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // 2. Blokir Keyboard Super Agresif
        const handleAggressiveKeyDown = (e) => {
            // Daftar tombol yang MASIH diizinkan (untuk scroll & fungsi dasar browser)
            const allowedKeys = [
                'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', // Panah Scroll
                'PageUp', 'PageDown', 'Home', 'End', ' ',          // Navigasi halaman
                'F5'                                               // Refresh halaman
            ];

            // Izinkan kombinasi Ctrl+R atau Cmd+R untuk refresh saja
            const isRefresh = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r';

            // Jika tombol yang ditekan BUKAN tombol yang diizinkan, dan BUKAN perintah refresh
            if (!allowedKeys.includes(e.key) && !isRefresh) {
                e.preventDefault(); // BLOKIR TOTAL
                
                // Opsional: Beri peringatan jika menekan PrintScreen atau kombinasi tertentu
                if (e.key === 'PrintScreen' || e.metaKey || e.ctrlKey) {
                    // Kosongkan clipboard jika sempat tercopy
                    navigator.clipboard.writeText(''); 
                }
            }
        };

        // 3. Mencegah Drag & Drop Gambar/Teks
        const handleDragStart = (e) => {
            e.preventDefault();
        };

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

    // Fungsi Render Ikon di Sidebar
    const getMaterialIcon = (type, isActive) => {
        const colorClass = isActive ? 'text-white' : 'text-slate-400';
        switch (type) {
            case 'video': return <PlayCircle size={18} className={colorClass} />;
            case 'pdf': return <FileBadge size={18} className={colorClass} />;
            case 'pertemuan': return <MonitorPlay size={18} className={colorClass} />;
            case 'latihan': return <ClipboardList size={18} className={colorClass} />;
            default: return <FileText size={18} className={colorClass} />;
        }
    };

    // Helper untuk mengubah link YouTube biasa menjadi link Embed
    const getEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Head title={`${course.nama} - Ruang Belajar`} />

            {/* TOP NAVBAR (Khusus Ruang Belajar) */}

            {/* TOP NAVBAR */}
            <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* 👇 Tombol kembali diubah ke Kelas Saya 👇 */}
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
                    {activeMaterial ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            
                            {/* RENDER BERDASARKAN TIPE MATERI */}
                            
                            {/* 1. VIDEO */}
                            {activeMaterial.tipe === 'video' && (
                                <div className="aspect-video bg-black w-full relative">
                                    {activeMaterial.link_video ? (
                                        <iframe 
                                            src={getEmbedUrl(activeMaterial.link_video)} 
                                            className="absolute inset-0 w-full h-full"
                                            allowFullScreen
                                            title={activeMaterial.judul}
                                        ></iframe>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-500">Video tidak tersedia</div>
                                    )}
                                </div>
                            )}

                            {/* 2. PDF */}
                            {/* 2. PDF (DIBACA DI TEMPAT, ANTI DOWNLOAD) */}
                            {activeMaterial.tipe === 'pdf' && (
                                <div className="bg-slate-100 flex flex-col border-b border-slate-200 relative group">
                                    {/* Tameng Transparan: Mencegah interaksi langsung dengan iframe */}
                                    <div className="absolute inset-0 z-10 hidden md:block"></div>
                                    
                                    <div className="w-full h-[75vh] md:h-[80vh] relative z-0">
                                        <iframe 
                                            src={`/storage/${activeMaterial.file_path}#toolbar=0&navpanes=0&scrollbar=0`} 
                                            className="w-full h-full border-none pointer-events-none"
                                            title="PDF Viewer"
                                        ></iframe>
                                    </div>
                                    <div className="p-4 bg-slate-800 text-slate-300 text-sm font-bold text-center flex items-center justify-center gap-2 relative z-20">
                                        <FileBadge size={18} className="text-rose-400"/>
                                        Dokumen dilindungi. Dilarang menyalin atau mendistribusikan materi ini.
                                    </div>
                                </div>
                            )}

                            {/* 3. PERTEMUAN / ZOOM */}
                            {activeMaterial.tipe === 'pertemuan' && (
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-10 md:p-20 flex flex-col items-center text-center border-b border-slate-200">
                                    <div className="w-24 h-24 bg-white text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-md border border-purple-100">
                                        <MonitorPlay size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 mb-6">Sesi Pertemuan Live</h3>
                                    
                                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                                        <div className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200">
                                            <Calendar size={20} className="text-purple-500"/>
                                            {new Date(activeMaterial.tanggal_waktu_meet).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200">
                                            <Clock size={20} className="text-purple-500"/>
                                            {new Date(activeMaterial.tanggal_waktu_meet).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                        </div>
                                    </div>

                                    {activeMaterial.password_meet && (
                                        <div className="mb-10 p-5 bg-white border-2 border-amber-200 rounded-2xl shadow-sm inline-flex flex-col items-center">
                                            <span className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Lock size={16}/> Passcode Zoom</span>
                                            <span className="text-2xl font-black text-slate-800 tracking-widest">{activeMaterial.password_meet}</span>
                                        </div>
                                    )}

                                    <a 
                                        href={activeMaterial.link_meet} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="px-10 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-xl shadow-purple-200 active:scale-95 transition-all flex items-center gap-2 text-lg"
                                    >
                                        <MonitorPlay size={24} /> Gabung ke Ruang Virtual
                                    </a>
                                </div>
                            )}

                            {/* 4. LATIHAN / KUIS */}
                            {activeMaterial.tipe === 'latihan' && (
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-10 md:p-20 flex flex-col items-center text-center border-b border-slate-200">
                                    <div className="w-24 h-24 bg-white text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-md border border-orange-100">
                                        <ClipboardList size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 mb-4">Evaluasi & Kuis</h3>
                                    <p className="text-slate-600 max-w-md mb-10 leading-relaxed font-medium">
                                        Uji pemahamanmu mengenai materi bab ini. Pastikan koneksi internet stabil sebelum memulai ujian.
                                    </p>
                                    
                                    {activeMaterial.exercise_id ? (
                                        <Link 
                                            href={route('member.exercise.show', activeMaterial.id)}
                                            className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 shadow-xl active:scale-95 transition-all w-full md:w-auto text-lg flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={24} /> Mulai Kerjakan Kuis
                                        </Link>
                                    ) : (
                                        <div className="px-6 py-3 bg-rose-100 text-rose-600 font-bold rounded-xl">
                                            Kuis belum disiapkan oleh instruktur.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* DESKRIPSI MATERI (Muncul di semua tipe) */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider rounded-lg">
                                        Materi {activeMaterial.urutan}
                                    </span>
                                    {activeMaterial.durasi && (
                                        <span className="flex items-center gap-1 text-sm font-bold text-slate-500">
                                            <Clock size={16}/> {activeMaterial.durasi}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 mb-6">{activeMaterial.judul}</h2>
                                
                                {activeMaterial.deskripsi ? (
                                    <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                                        {/* Jika ingin merender HTML (karena rich text), gunakan dangerouslySetInnerHTML */}
                                        {/* Tapi kita pakai text biasa untuk keamanan */}
                                        <p className="whitespace-pre-wrap">{activeMaterial.deskripsi}</p>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 italic">Tidak ada deskripsi tambahan untuk materi ini.</p>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-20 text-center flex flex-col items-center">
                            <FileText size={64} className="text-slate-200 mb-4" />
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Materi Terpilih</h2>
                            <p className="text-slate-500">Silakan pilih materi dari daftar kurikulum di samping untuk mulai belajar.</p>
                        </div>
                    )}
                </div>

                {/* KANAN: SIDEBAR KURIKULUM */}
                <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-lg font-black text-slate-800">Daftar Materi</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">Lacak progres belajarmu di sini</p>
                        </div>

                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar p-2">
                            {course.chapters?.length === 0 ? (
                                <p className="text-center text-slate-400 py-10">Kurikulum belum tersedia.</p>
                            ) : (
                                course.chapters?.map((chapter, index) => (
                                    <div key={chapter.id} className="mb-2 last:mb-0">
                                        
                                        {/* Judul Bab (Accordion Header) */}
                                        <button 
                                            onClick={() => toggleChapter(chapter.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                                                expandedChapters.includes(chapter.id) ? 'bg-slate-100' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="text-left pr-4">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bab {chapter.urutan || index + 1}</span>
                                                <h4 className="font-bold text-slate-800 text-sm leading-snug">{chapter.judul}</h4>
                                            </div>
                                            <div className="shrink-0 text-slate-400">
                                                {expandedChapters.includes(chapter.id) ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                                            </div>
                                        </button>

                                        {/* Daftar Materi di dalam Bab */}
                                        <AnimatePresence>
                                            {expandedChapters.includes(chapter.id) && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }} 
                                                    animate={{ height: 'auto', opacity: 1 }} 
                                                    exit={{ height: 0, opacity: 0 }} 
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-2 pb-4 px-2 space-y-1 relative before:absolute before:left-6 before:top-2 before:bottom-6 before:w-px before:bg-slate-200">
                                                        {chapter.materials?.map((material) => {
                                                            const isActive = activeMaterial?.id === material.id;
                                                            return (
                                                                <button
                                                                    key={material.id}
                                                                    onClick={() => setActiveMaterial(material)}
                                                                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all relative z-10 text-left ${
                                                                        isActive 
                                                                            ? 'bg-indigo-600 shadow-md' 
                                                                            : 'hover:bg-indigo-50'
                                                                    }`}
                                                                >
                                                                    {/* Ikon Materi */}
                                                                    <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                                                                        isActive ? 'border-white/30 bg-indigo-500' : 'bg-white border-slate-200'
                                                                    }`}>
                                                                        {getMaterialIcon(material.tipe, isActive)}
                                                                    </div>
                                                                    
                                                                    {/* Teks Materi */}
                                                                    <div>
                                                                        <p className={`text-sm font-bold leading-snug mb-1 ${
                                                                            isActive ? 'text-white' : 'text-slate-700'
                                                                        }`}>
                                                                            {material.judul}
                                                                        </p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                                                isActive ? 'bg-white/20 text-indigo-100' : 'bg-slate-100 text-slate-500'
                                                                            }`}>
                                                                                {material.tipe === 'text_only' ? 'Teks' : material.tipe}
                                                                            </span>
                                                                            {material.durasi && (
                                                                                <span className={`text-xs font-medium flex items-center gap-1 ${
                                                                                    isActive ? 'text-indigo-200' : 'text-slate-400'
                                                                                }`}>
                                                                                    <Clock size={12}/> {material.durasi}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                        {(!chapter.materials || chapter.materials.length === 0) && (
                                                            <p className="text-xs text-slate-400 italic pl-12 py-2">Belum ada materi.</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}