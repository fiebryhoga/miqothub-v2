import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, ChevronLeft, Flag } from 'lucide-react';

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
        if (confirm('Yakin ingin menyelesaikan latihan ini? Jawaban Anda tidak bisa diubah lagi setelah dikirim.')) {
            post(route('member.exercise.submit', material.id));
        }
    };

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center p-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg w-full">
                    <Flag size={48} className="mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-black text-blue-950 mb-2">Soal Kosong</h2>
                    <p className="text-slate-500 font-medium">Belum ada soal yang disiapkan untuk kuis ini.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 font-sans select-none">
            <Head title={`Kuis: ${exercise.judul}`} />

            <div className="max-w-4xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-black text-blue-950 mb-5 tracking-tight">{exercise.judul}</h1>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-end mb-2.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Pertanyaan <strong className="text-blue-950 text-base">{currentIndex + 1}</strong> / {questions.length}
                            </span>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">
                                {Math.round(progress)}% Selesai
                            </span>
                        </div>
                        
                        
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-blue-800 to-blue-500 h-2 rounded-full transition-all duration-700 ease-out" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-950/5 border border-slate-100 p-6 md:p-10 lg:p-12 mb-8">
                    
                    
                    {currentQ.gambar_soal && (
                        <div className="mb-8 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 inline-block p-2 shadow-inner">
                            <img src={`/storage/${currentQ.gambar_soal}`} alt="Ilustrasi Soal" className="max-h-[300px] w-auto object-contain rounded-xl" />
                        </div>
                    )}
                    
                    <p className="text-lg md:text-xl lg:text-2xl text-slate-800 leading-relaxed font-bold mb-10 whitespace-pre-wrap">
                        {currentQ.pertanyaan}
                    </p>

                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                        {['a', 'b', 'c', 'd', 'e'].map((opt) => {
                            const isSelected = data.answers[currentQ.id] === opt;
                            // Cek apakah opsi ini memiliki teks (menghindari error/kosong)
                            if (!currentQ[`opsi_${opt}`] && !currentQ[`gambar_${opt}`]) return null;
                            
                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    className={`w-full text-left p-5 rounded-[1.25rem] border-2 transition-all duration-300 flex flex-col gap-4 group ${
                                        isSelected 
                                            ? 'border-blue-900 bg-blue-50/80 shadow-md shadow-blue-900/10 scale-[1.02]' 
                                            : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center font-black text-sm shrink-0 transition-colors duration-300 ${
                                            isSelected 
                                                ? 'border-blue-900 bg-blue-950 text-white' 
                                                : 'border-slate-200 text-slate-400 bg-white group-hover:border-blue-300 group-hover:text-blue-600'
                                        }`}>
                                            {opt.toUpperCase()}
                                        </div>
                                        <span className={`text-slate-700 leading-relaxed font-medium mt-1.5 transition-colors ${isSelected ? 'text-blue-950 font-black' : 'group-hover:text-blue-900'}`}>
                                            {currentQ[`opsi_${opt}`]}
                                        </span>
                                    </div>

                                    
                                    {currentQ[`gambar_${opt}`] && (
                                        <div className="ml-14 mt-2 rounded-xl overflow-hidden bg-white border border-slate-100 inline-block p-1">
                                            <img src={`/storage/${currentQ[`gambar_${opt}`]}`} alt={`Opsi ${opt}`} className="max-h-24 w-auto object-contain rounded-lg" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                
                <div className="flex justify-between items-center bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        disabled={currentIndex === 0}
                        className="px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-0 transition-all"
                    >
                        <ChevronLeft size={20} /> <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    {!isLast ? (
                        <button 
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="px-6 py-3 bg-slate-100 text-blue-950 rounded-xl font-black hover:bg-blue-50 border border-transparent hover:border-blue-200 flex items-center gap-2 transition-all duration-300 group"
                        >
                            <span className="hidden sm:inline">Selanjutnya</span> <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </button>
                    ) : (
                        <button 
                            onClick={submitQuiz}
                            disabled={processing}
                            className="px-8 py-3.5 bg-blue-950 text-white rounded-xl font-black hover:bg-blue-900 flex items-center gap-2.5 shadow-lg shadow-blue-950/20 active:scale-95 transition-all duration-300 disabled:opacity-50"
                        >
                            <CheckCircle2 size={20} className={processing ? 'animate-pulse' : 'text-blue-400'} /> 
                            {processing ? 'Menyimpan...' : 'Kirim Jawaban'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}