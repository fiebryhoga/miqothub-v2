import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, ArrowRight, BookOpen, Clock, Target } from 'lucide-react';

export default function Index({ auth, exercises }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Bank Soal & Latihan" />

            <div className="mb-8 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                            <ClipboardList size={24}/>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bank Soal & Latihan</h1>
                    </div>
                    <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                        Kelola seluruh modul kuis dan tugas yang telah dibuat. Klik pada salah satu kuis untuk mulai menambahkan atau mengedit pertanyaan.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500">Belum ada modul latihan yang dibuat.</p>
                        <p className="text-sm text-slate-400 mt-1">Buat latihan melalui menu Kurikulum Kelas terlebih dahulu.</p>
                    </div>
                ) : (
                    exercises.map((exercise) => (
                        <div key={exercise.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${exercise.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {exercise.is_active ? 'Aktif' : 'Ditutup'}
                                </span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                    <Target size={14}/> {exercise.questions_count || 0} Soal
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                                {exercise.judul}
                            </h3>
                            
                            <div className="flex flex-col gap-2 mb-6 text-sm text-slate-500 font-medium">
                                {exercise.materials && exercise.materials.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} className="text-slate-400"/> 
                                        <span className="truncate">Terhubung ke {exercise.materials.length} Materi</span>
                                    </div>
                                )}
                            </div>

                            <Link 
                                href={route('admin.exercises.show', exercise.id)}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors border border-slate-100 group-hover:border-orange-200"
                            >
                                Kelola Pertanyaan <ArrowRight size={18}/>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}