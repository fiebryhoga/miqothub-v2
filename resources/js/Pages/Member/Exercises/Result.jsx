import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Trophy, ArrowLeft, Target, XCircle } from 'lucide-react';

export default function Result({ material, exercise, score }) {
    // Anggap KKM / Batas Lulus adalah 70
    const isPassed = score.skor >= 70;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title={`Hasil: ${exercise.judul}`} />

            <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden text-center relative">
                
                {/* Latar Belakang Atas Dinamis */}
                <div className={`h-32 absolute top-0 w-full opacity-10 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                <div className="p-10 relative z-10">
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-6 -mt-16
                        ${isPassed ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}
                    `}>
                        {isPassed ? <Trophy size={40} className="text-white" /> : <XCircle size={40} className="text-white" />}
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 mb-2">
                        {isPassed ? 'Luar Biasa!' : 'Jangan Menyerah!'}
                    </h2>
                    <p className="text-slate-500 font-medium mb-8">Anda telah menyelesaikan kuis <strong>{exercise.judul}</strong></p>

                    {/* Ringkasan Nilai Bulat */}
                    <div className="flex justify-center mb-10">
                        <div className="relative">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                <circle 
                                    cx="80" cy="80" r="70" 
                                    stroke="currentColor" strokeWidth="8" fill="transparent" 
                                    strokeDasharray={440} strokeDashoffset={440 - (440 * score.skor) / 100}
                                    className={isPassed ? 'text-emerald-500 transition-all duration-1000' : 'text-rose-500 transition-all duration-1000'} 
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-4xl font-black text-slate-800">{score.skor}</span>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Nilai</span>
                            </div>
                        </div>
                    </div>

                    {/* Rincian Statistik */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-center mb-2"><Target size={24} className="text-indigo-500"/></div>
                            <p className="text-2xl font-bold text-slate-800">{score.jumlah_benar}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase">Jawaban Benar</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-center mb-2"><XCircle size={24} className="text-rose-400"/></div>
                            <p className="text-2xl font-bold text-slate-800">{score.total_soal - score.jumlah_benar}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase">Jawaban Salah</p>
                        </div>
                    </div>

                    {/* Tombol Navigasi */}
                    <Link 
                        href={route('dashboard')} 
                        className="inline-flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition shadow-lg"
                    >
                        <ArrowLeft size={20} /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}