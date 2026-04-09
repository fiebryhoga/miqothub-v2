import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Plus, Trash2, ClipboardList, Target, X, CheckCircle2, 
    ArrowUp, ArrowDown, Edit, Settings, Lock, LockOpen
} from 'lucide-react';
import QuestionModal from './Partials/QuestionModal';

export default function Show({ auth, exercise }) {
    const { flash = {} } = usePage().props;
    const questions = exercise.questions || [];

    const courseId = exercise.materials && exercise.materials.length > 0 && exercise.materials[0].chapter 
        ? exercise.materials[0].chapter.course_id 
        : null;
    
    const [modal, setModal] = useState({ show: false, question: null });
    const [settingModal, setSettingModal] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    const formSettings = useForm({
        judul: exercise.judul || '',
        deskripsi: exercise.deskripsi || '',
        password: exercise.password || '',
        is_active: exercise.is_active === 1 || exercise.is_active === true,
        max_attempts: exercise.max_attempts || 1,
    });

    const submitSettings = (e) => {
        e.preventDefault();
        formSettings.put(route('admin.exercises.update', exercise.id), {
            onSuccess: () => setSettingModal(false)
        });
    };

    const deleteQuestion = (id) => {
        if (confirm('Yakin ingin menghapus soal ini beserta gambarnya?')) {
            router.delete(route('admin.questions.destroy', id));
        }
    };

    const moveQuestion = (index, direction) => {
        setIsReordering(true);
        const newQuestions = [...questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
        const orderedIds = newQuestions.map(q => q.id);
        
        router.put(route('admin.questions.reorder', exercise.id), { ordered_ids: orderedIds }, {
            onFinish: () => setIsReordering(false)
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Kelola Soal: ${exercise.judul}`} />

            {/* HEADER */}
            <div className="mb-8 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div>
                    {courseId ? (
                            <Link href={route('admin.courses.curriculum', courseId)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-600 mb-6 transition-colors">
                                <ArrowLeft size={16} /> Kembali ke Kurikulum
                            </Link>
                        ) : (
                            <Link href={route('admin.exercises.index')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-600 mb-6 transition-colors">
                                <ArrowLeft size={16} /> Kembali ke Bank Soal
                            </Link>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                <ClipboardList size={24}/>
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{exercise.judul}</h1>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${exercise.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                Status: {exercise.is_active ? 'Aktif' : 'Ditutup'}
                            </span>
                            {exercise.password ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                                    <Lock size={14}/> Diproteksi Password
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                                    <LockOpen size={14}/> Tanpa Password
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setSettingModal(true)} className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 shrink-0">
                            <Settings size={20} /> Pengaturan Kuis
                        </button>
                        <button onClick={() => setModal({ show: true, question: null })} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 active:scale-95 shrink-0">
                            <Plus size={20} /> Tambah Pertanyaan
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-bold flex items-center gap-3 shadow-sm">
                        <CheckCircle2 size={20} className="text-emerald-500" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DAFTAR SOAL */}
            <div className="space-y-6 relative">
                {isReordering && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                        <div className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl animate-pulse">Menyimpan Urutan...</div>
                    </div>
                )}

                {questions.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center">
                        <Target size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-800">Belum Ada Pertanyaan</h3>
                        <button onClick={() => setModal({ show: true, question: null })} className="mt-4 px-6 py-3 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100">Buat Pertanyaan Pertama</button>
                    </div>
                ) : (
                    questions.map((q, index) => (
                        <div key={q.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:border-slate-200 transition-colors">
                            
                            <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 border-b md:border-b-0 border-slate-100 pb-4 md:pb-0">
                                <button onClick={() => moveQuestion(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ArrowUp size={20}/></button>
                                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl font-black flex items-center justify-center text-lg">{index + 1}</div>
                                <button onClick={() => moveQuestion(index, 'down')} disabled={index === questions.length - 1} className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"><ArrowDown size={20}/></button>
                            </div>

                            <div className="flex-1">
                                {q.gambar_soal && (
                                    <div className="mb-4 rounded-xl overflow-hidden bg-slate-100 max-w-sm border border-slate-200">
                                        <img src={`/storage/${q.gambar_soal}`} alt="Gambar Soal" className="w-full h-auto" />
                                    </div>
                                )}
                                <h4 className="text-lg font-bold text-slate-800 mb-6 whitespace-pre-wrap leading-relaxed">{q.pertanyaan}</h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['a', 'b', 'c', 'd', 'e'].map((opt) => {
                                        const isCorrect = q.jawaban_benar === opt;
                                        return (
                                            <div key={opt} className={`flex flex-col gap-3 p-4 rounded-xl border-2 ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                        {opt.toUpperCase()}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-900' : 'text-slate-600'}`}>{q[`opsi_${opt}`]}</span>
                                                    {isCorrect && <CheckCircle2 size={16} className="text-emerald-500 ml-auto shrink-0" />}
                                                </div>
                                                {q[`gambar_${opt}`] && (
                                                    <div className="mt-2 ml-9 rounded-lg overflow-hidden bg-white border border-slate-200 max-w-32">
                                                        <img src={`/storage/${q[`gambar_${opt}`]}`} alt={`Opsi ${opt}`} className="w-full h-auto" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="shrink-0 flex md:flex-col justify-end md:justify-start gap-2 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                <button onClick={() => setModal({ show: true, question: q })} className="p-3 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-blue-100" title="Edit Soal"><Edit size={20}/></button>
                                <button onClick={() => deleteQuestion(q.id)} className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-100" title="Hapus Soal"><Trash2 size={20}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL PENGATURAN */}
            <AnimatePresence>
                {settingModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettingModal(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
                        
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-200 text-slate-700 rounded-lg"><Settings size={20} /></div>
                                    <h2 className="text-xl font-black text-slate-800">Pengaturan Kuis</h2>
                                </div>
                                <button onClick={() => setSettingModal(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><X size={24}/></button>
                            </div>

                            <form onSubmit={submitSettings} className="p-6 md:p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Judul Latihan</label>
                                    <input type="text" value={formSettings.data.judul} onChange={e => formSettings.setData('judul', e.target.value)} className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 font-medium text-slate-800" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2"><Lock size={16}/> Password Kuis</label>
                                        <input type="text" value={formSettings.data.password} onChange={e => formSettings.setData('password', e.target.value)} className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 font-medium text-slate-800" placeholder="Kosong = Tanpa Password" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Max Percobaan</label>
                                        <input type="number" min="1" value={formSettings.data.max_attempts} onChange={e => formSettings.setData('max_attempts', e.target.value)} className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 font-medium text-slate-800" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Deskripsi Kuis</label>
                                    <textarea value={formSettings.data.deskripsi} onChange={e => formSettings.setData('deskripsi', e.target.value)} rows="2" className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 font-medium text-slate-800" placeholder="Opsional..."></textarea>
                                </div>

                                <label className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                                    <input type="checkbox" checked={formSettings.data.is_active} onChange={e => formSettings.setData('is_active', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Status Aktif Kuis</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Jika dimatikan, member tidak akan bisa mengerjakan kuis ini meskipun sudah membeli kelas.</p>
                                    </div>
                                </label>

                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <button type="button" onClick={() => setSettingModal(false)} className="px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Batal</button>
                                    <button type="submit" disabled={formSettings.processing} className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                                        Simpan Pengaturan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL SOAL (DIPANGGIL DARI PARTIALS) */}
            <AnimatePresence>
                {modal.show && (
                    <QuestionModal 
                        show={modal.show} 
                        onClose={() => setModal({ show: false, question: null })} 
                        exerciseId={exercise.id} 
                        question={modal.question} 
                    />
                )}
            </AnimatePresence>

        </AdminLayout>
    );
}