// resources/js/Pages/Member/Courses/Partials/MaterialViewer.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { FileBadge, MonitorPlay, Calendar, Clock, Lock, ClipboardList, CheckCircle2, FileText } from 'lucide-react';

export default function MaterialViewer({ activeMaterial }) {
    
    // Helper untuk mengubah link YouTube biasa menjadi link Embed
    // Helper untuk mengubah link YouTube dan Drive menjadi link Embed yang benar
    const getEmbedUrl = (url) => {
        if (!url) return '';
        
        // 1. Cek dan ubah jika itu link YouTube
        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const ytMatch = url.match(ytRegExp);
        if (ytMatch && ytMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${ytMatch[2]}`;
        }

        // 2. Cek dan ubah jika itu link Google Drive
        if (url.includes('drive.google.com/file/d/')) {
            // Google Drive menolak iframe jika menggunakan /view
            // Maka kita ganti secara otomatis string setelah ID file menjadi /preview
            return url.replace(/\/view.*$/, '/preview');
        }

        return url;
    };

    if (!activeMaterial) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-20 text-center flex flex-col items-center">
                <FileText size={64} className="text-slate-200 mb-4" />
                <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Materi Terpilih</h2>
                <p className="text-slate-500">Silakan pilih materi dari daftar kurikulum di samping untuk mulai belajar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            
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

            {/* 2. PDF (MENGGUNAKAN TAMENG OVERLAY) */}
            {activeMaterial.tipe === 'pdf' && (
                <div 
                    className="bg-slate-100 flex flex-col border-b border-slate-200 relative select-none"
                    onContextMenu={(e) => e.preventDefault()} // Blokir klik kanan di area pembungkus
                    style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }} // Blokir tekan lama di HP
                >
                    <div className="w-full h-[75vh] md:h-[80vh] relative z-0 flex items-center justify-center overflow-hidden">
                        
                        {/* URL Langsung dengan parameter untuk menyembunyikan toolbar bawaan */}
                        <iframe 
                            src={`/storage/${activeMaterial.file_path}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                            className="w-full h-full border-none bg-slate-100 pointer-events-auto"
                            title="PDF Viewer Secure"
                        ></iframe>

                        {/* ========================================================= */}
                        {/* LAPISAN TAMENG (SHIELDS) UNTUK MEMBLOKIR TOMBOL DOWNLOAD */}
                        {/* ========================================================= */}
                        
                        {/* Tameng Atas: Menutup seluruh baris atas tempat toolbar PDF biasanya muncul */}
                        <div className="absolute top-0 left-0 w-full h-14 bg-transparent z-10 cursor-not-allowed" title="Dilindungi"></div>
                        
                        {/* Tameng Kanan: Menutup area kanan tempat scrollbar/tombol pop-out kadang muncul */}
                        <div className="absolute top-0 right-0 w-16 h-full bg-transparent z-10 cursor-not-allowed"></div>

                        {/* Tameng Sudut Kanan Bawah: Untuk memblokir tombol simpan pop-up di beberapa browser */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-transparent z-10 cursor-not-allowed"></div>
                    </div>

                    <div className="p-4 bg-slate-900 text-slate-300 text-sm font-bold text-center flex items-center justify-center gap-2 relative z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                        <Lock size={18} className="text-emerald-400"/>
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

            {/* DESKRIPSI MATERI */}
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
                        <p className="whitespace-pre-wrap">{activeMaterial.deskripsi}</p>
                    </div>
                ) : (
                    <p className="text-slate-400 italic">Tidak ada deskripsi tambahan untuk materi ini.</p>
                )}
            </div>
        </div>
    );
}