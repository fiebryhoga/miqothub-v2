import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

export default function Quiz({ material, exercise, questions }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data, setData, post, processing } = useForm({
        answers: {} // Menyimpan jawaban, cth: { id_soal_1: 'a', id_soal_2: 'c' }
    });

    const currentQ = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (optionValue) => {
        setData('answers', {
            ...data.answers,
            [currentQ.id]: optionValue
        });
    };

    const submitQuiz = () => {
        if (confirm('Yakin ingin menyelesaikan latihan ini? Jawaban tidak bisa diubah lagi.')) {
            post(route('member.exercise.submit', material.id));
        }
    };

    if (questions.length === 0) {
        return <div className="text-center p-20 text-slate-500">Belum ada soal untuk kuis ini.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <Head title={`Kuis: ${exercise.judul}`} />

            <div className="max-w-4xl mx-auto">
                {/* Header & Progress Bar */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-800 mb-4">{exercise.judul}</h1>
                    <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                        <span>Pertanyaan {currentIndex + 1} dari {questions.length}</span>
                        <span>{Math.round(progress)}% Selesai</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* AREA SOAL */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-6">
                    
                    {/* Tampilkan Gambar Soal (Jika Ada) */}
                    {currentQ.gambar_soal && (
                        <div className="mb-8 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 inline-block">
                            <img src={`/storage/${currentQ.gambar_soal}`} alt="Ilustrasi Soal" className="max-h-80 w-auto object-contain" />
                        </div>
                    )}
                    
                    <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-bold mb-8 whitespace-pre-wrap">
                        {currentQ.pertanyaan}
                    </p>

                    {/* AREA OPSI JAWABAN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['a', 'b', 'c', 'd', 'e'].map((opt) => {
                            const isSelected = data.answers[currentQ.id] === opt;
                            
                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex flex-col gap-4 group ${
                                        isSelected 
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                                            isSelected 
                                                ? 'border-indigo-600 bg-indigo-600 text-white' 
                                                : 'border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500'
                                        }`}>
                                            {opt.toUpperCase()}
                                        </div>
                                        <span className={`text-slate-700 leading-relaxed font-medium mt-1 ${isSelected ? 'text-indigo-900 font-bold' : ''}`}>
                                            {currentQ[`opsi_${opt}`]}
                                        </span>
                                    </div>

                                    {/* Tampilkan Gambar Opsi (Jika Ada) */}
                                    {currentQ[`gambar_${opt}`] && (
                                        <div className="ml-12 rounded-xl overflow-hidden bg-white border border-slate-200 inline-block">
                                            <img src={`/storage/${currentQ[`gambar_${opt}`]}`} alt={`Opsi ${opt}`} className="max-h-32 w-auto object-contain" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* NAVIGASI BAWAH */}
                <div className="flex justify-between items-center">
                    <button 
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        disabled={currentIndex === 0}
                        className="px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 text-slate-500 hover:bg-slate-200 disabled:opacity-0 transition-all"
                    >
                        <ChevronLeft size={20} /> Sebelumnya
                    </button>

                    {!isLast ? (
                        <button 
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="px-8 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                        >
                            Selanjutnya <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button 
                            onClick={submitQuiz}
                            disabled={processing}
                            className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <CheckCircle2 size={20} /> Selesaikan Kuis
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}