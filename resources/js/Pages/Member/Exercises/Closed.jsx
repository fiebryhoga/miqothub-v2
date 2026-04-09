import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Lock, ArrowLeft } from 'lucide-react';

export default function Closed({ material, exercise }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title={`Latihan Ditutup: ${exercise.judul}`} />

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 text-center relative">
                <div className="h-32 absolute top-0 w-full bg-slate-100 opacity-50"></div>
                
                <div className="p-10 relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center shadow-inner mb-6 -mt-16">
                        <Lock size={36} className="text-slate-500" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 mb-2">Sesi Telah Ditutup</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Mohon maaf, sesi untuk latihan <strong>{exercise.judul}</strong> saat ini sedang dinonaktifkan atau ditutup oleh Instruktur.
                    </p>

                    {/* Tombol kembali diarahkan ke Ruang Belajar Kelas tersebut */}
                    <Link 
                        href={route('member.courses.show', material.chapter.course_id)} 
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} /> Kembali ke Ruang Kelas
                    </Link>
                </div>
            </div>
        </div>
    );
}