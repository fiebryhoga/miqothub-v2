import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Closed({ material, exercise }) {
    return (
        <div className="min-h-screen bg-slate-50/80 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Head title={`Latihan Ditutup: ${exercise.judul}`} />

            {/* Aksen Background Radial Navy */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-950/5 overflow-hidden border border-slate-100 text-center relative z-10">
                {/* Header Pattern Navy */}
                <div className="h-32 absolute top-0 w-full bg-gradient-to-b from-blue-950/10 to-transparent"></div>
                
                <div className="p-10 md:p-12 relative z-10 flex flex-col items-center">
                    {/* Ikon Gembok Timbul */}
                    <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-900/10 mb-8 -mt-16 border border-slate-100/50">
                        <Lock size={40} className="text-blue-950" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-blue-950 mb-3 tracking-tight">Sesi Telah Ditutup</h2>
                    
                    <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl mb-8 flex gap-3 text-left">
                        <ShieldAlert size={20} className="text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            Mohon maaf, sesi untuk latihan <strong className="text-blue-950">{exercise.judul}</strong> saat ini sedang dinonaktifkan atau telah ditutup oleh Instruktur.
                        </p>
                    </div>

                    {/* Tombol Kembali ke Kelas */}
                    <Link 
                        href={route('member.courses.show', material.chapter.course_id)} 
                        className="w-full py-4 bg-blue-950 text-white rounded-xl font-bold hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-blue-950/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        Kembali ke Ruang Kelas
                    </Link>
                </div>
            </div>
        </div>
    );
}