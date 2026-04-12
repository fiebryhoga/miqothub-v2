import React from 'react';
import { Link } from '@inertiajs/react';
import { FileBadge, MonitorPlay, Calendar, Clock, Lock, ClipboardList, CheckCircle2, FileText, ShieldAlert } from 'lucide-react';

export default function MaterialViewer({ activeMaterial }) {
    
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
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
                    <FileText size={48} className="text-slate-300" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Materi Terpilih</h2>
                <p className="text-slate-500 font-medium">Silakan pilih materi dari daftar kurikulum di samping untuk mulai belajar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            
            {/* ======================================= */}
            {/* 1. TAMPILAN VIDEO */}
            {/* ======================================= */}
            {activeMaterial.tipe === 'video' && (
                <div className="aspect-video bg-slate-900 w-full relative border-b border-slate-200 shadow-inner overflow-hidden">
                    {activeMaterial.link_video ? (
                        <iframe 
                            src={getEmbedUrl(activeMaterial.link_video)} 
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            title={activeMaterial.judul}
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                            <MonitorPlay size={48} className="opacity-20" />
                            <span className="font-semibold text-sm tracking-wider uppercase">Video tidak tersedia</span>
                        </div>
                    )}
                </div>
            )}

            {/* ======================================= */}
            {/* 2. TAMPILAN PDF (SECURE SHIELD VIEW) */}
            {/* ======================================= */}
            {activeMaterial.tipe === 'pdf' && (
                <div 
                    className="bg-slate-100 flex flex-col border-b border-slate-200 relative select-none"
                    onContextMenu={(e) => e.preventDefault()} // Blokir klik kanan
                    style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }} // Blokir tekan lama
                >
                    <div className="w-full h-[70vh] md:h-[75vh] relative z-0 flex items-center justify-center overflow-hidden">
                        
                        {/* Frame PDF */}
                        <iframe 
                            src={`/storage/${activeMaterial.file_path}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                            className="w-full h-full border-none bg-slate-100 pointer-events-auto"
                            title="PDF Viewer Secure"
                        ></iframe>

                        {/* TAMENG PROTEKSI */}
                        <div className="absolute top-0 left-0 w-full h-14 bg-transparent z-10 cursor-not-allowed" title="Dilindungi"></div>
                        <div className="absolute top-0 right-0 w-16 h-full bg-transparent z-10 cursor-not-allowed"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-transparent z-10 cursor-not-allowed"></div>
                    </div>

                    {/* Bar Peringatan Premium Navy */}
                    <div className="p-3.5 bg-blue-950 text-blue-100 text-xs font-bold text-center flex items-center justify-center gap-2.5 relative z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.2)] tracking-wide">
                        <ShieldAlert size={16} className="text-blue-400"/>
                        Dokumen dilindungi. Dilarang menyalin, mengunduh, atau mendistribusikan materi ini.
                    </div>
                </div>
            )}

            {/* ======================================= */}
            {/* 3. TAMPILAN PERTEMUAN (MEET/ZOOM) */}
            {/* ======================================= */}
            {activeMaterial.tipe === 'pertemuan' && (
                <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-10 md:p-20 flex flex-col items-center text-center border-b border-slate-200 relative overflow-hidden">
                    {/* Aksen Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="w-24 h-24 bg-white text-blue-700 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 border border-blue-100 relative z-10">
                        <MonitorPlay size={40} strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-3xl font-black text-blue-950 mb-6 relative z-10 tracking-tight">Sesi Pertemuan Live</h3>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
                        <div className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200">
                            <Calendar size={20} className="text-blue-600"/>
                            {new Date(activeMaterial.tanggal_waktu_meet).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200">
                            <Clock size={20} className="text-blue-600"/>
                            {new Date(activeMaterial.tanggal_waktu_meet).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </div>
                    </div>

                    {activeMaterial.password_meet && (
                        <div className="mb-10 p-5 bg-blue-950 border border-blue-900 rounded-2xl shadow-lg shadow-blue-950/20 inline-flex flex-col items-center min-w-[200px] relative z-10">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <Lock size={14}/> Passcode Zoom
                            </span>
                            <span className="text-2xl font-black text-white tracking-widest">{activeMaterial.password_meet}</span>
                        </div>
                    )}

                    <a 
                        href={activeMaterial.link_meet} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-10 py-4 bg-blue-700 text-white font-black rounded-xl hover:bg-blue-800 shadow-xl shadow-blue-700/20 active:scale-95 transition-all duration-300 flex items-center gap-2.5 text-lg relative z-10 group"
                    >
                        <MonitorPlay size={24} className="group-hover:scale-110 transition-transform" /> 
                        Gabung ke Ruang Virtual
                    </a>
                </div>
            )}

            {/* ======================================= */}
            {/* 4. TAMPILAN LATIHAN (KUIS) */}
            {/* ======================================= */}
            {activeMaterial.tipe === 'latihan' && (
                <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-10 md:p-20 flex flex-col items-center text-center border-b border-slate-200 relative overflow-hidden">
                    <div className="w-24 h-24 bg-white text-blue-700 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 border border-blue-100 relative z-10">
                        <ClipboardList size={40} strokeWidth={2} />
                    </div>
                    
                    <h3 className="text-3xl font-black text-blue-950 mb-4 relative z-10 tracking-tight">Evaluasi & Kuis</h3>
                    
                    <p className="text-slate-500 max-w-md mb-10 leading-relaxed font-semibold relative z-10">
                        Uji pemahamanmu mengenai materi bab ini. Pastikan koneksi internet stabil sebelum memulai ujian.
                    </p>
                    
                    {activeMaterial.exercise_id ? (
                        <Link 
                            href={route('member.exercise.show', activeMaterial.id)}
                            className="px-10 py-4 bg-blue-950 text-white font-black rounded-xl hover:bg-blue-900 shadow-xl shadow-blue-950/20 active:scale-95 transition-all duration-300 w-full md:w-auto text-lg flex items-center justify-center gap-2.5 relative z-10 group"
                        >
                            <CheckCircle2 size={24} className="text-blue-400 group-hover:text-white transition-colors" /> 
                            Mulai Kerjakan Kuis
                        </Link>
                    ) : (
                        <div className="px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-xl border border-slate-200 relative z-10 text-sm">
                            Kuis belum disiapkan oleh instruktur.
                        </div>
                    )}
                </div>
            )}

            {/* ======================================= */}
            {/* BAGIAN DESKRIPSI BAWAH */}
            {/* ======================================= */}
            <div className="p-8 lg:p-10 bg-white">
                <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100/50">
                        Materi {activeMaterial.urutan}
                    </span>
                    {activeMaterial.durasi && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Clock size={14} strokeWidth={2.5}/> {activeMaterial.durasi}
                        </span>
                    )}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-snug tracking-tight">
                    {activeMaterial.judul}
                </h2>
                
                <div className="w-12 h-1 bg-blue-600 rounded-full mb-8"></div>
                
                {activeMaterial.deskripsi ? (
                    <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium">
                        <p className="whitespace-pre-wrap">{activeMaterial.deskripsi}</p>
                    </div>
                ) : (
                    <p className="text-slate-400 italic font-medium">Tidak ada deskripsi tambahan untuk materi ini.</p>
                )}
            </div>

        </div>
    );
}