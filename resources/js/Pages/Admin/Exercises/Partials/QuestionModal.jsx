import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function QuestionModal({ show, onClose, exerciseId, question }) {
    const isEdit = !!question;

    const { data, setData, post, processing, reset, errors } = useForm({
        pertanyaan: '', jawaban_benar: 'a',
        opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', opsi_e: '',
        gambar_soal: null, gambar_a: null, gambar_b: null, gambar_c: null, gambar_d: null, gambar_e: null,
        // Kolom khusus untuk menandai gambar mana yang mau dihapus oleh Admin
        remove_gambar_soal: false, remove_gambar_a: false, remove_gambar_b: false, 
        remove_gambar_c: false, remove_gambar_d: false, remove_gambar_e: false,
        _method: 'post'
    });

    useEffect(() => {
        if (show) {
            if (isEdit) {
                setData({
                    pertanyaan: question.pertanyaan, jawaban_benar: question.jawaban_benar,
                    opsi_a: question.opsi_a, opsi_b: question.opsi_b, opsi_c: question.opsi_c, opsi_d: question.opsi_d, opsi_e: question.opsi_e,
                    gambar_soal: null, gambar_a: null, gambar_b: null, gambar_c: null, gambar_d: null, gambar_e: null,
                    remove_gambar_soal: false, remove_gambar_a: false, remove_gambar_b: false, 
                    remove_gambar_c: false, remove_gambar_d: false, remove_gambar_e: false,
                    _method: 'put'
                });
            } else {
                reset();
                setData('_method', 'post');
            }
        }
    }, [show, question]);

    const submit = (e) => {
        e.preventDefault();
        const routePath = isEdit ? route('admin.questions.update', question.id) : route('admin.questions.store', exerciseId);
        
        post(routePath, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <h2 className="text-xl font-black text-slate-800">{isEdit ? 'Edit Pertanyaan' : 'Buat Pertanyaan Baru'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><X size={24}/></button>
                </div>

                <form onSubmit={submit} className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* BAGIAN SOAL UTAMA */}
                    <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-3">Teks Pertanyaan</label>
                        <textarea value={data.pertanyaan} onChange={e => setData('pertanyaan', e.target.value)} rows="3" className="w-full mb-4 px-5 py-4 rounded-2xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 font-medium text-slate-800 text-lg leading-relaxed" required></textarea>
                        
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2"><ImageIcon size={16}/> Sisipkan Gambar Soal (Opsional)</label>
                        
                        {/* Preview Gambar Soal Lama */}
                        {isEdit && question.gambar_soal && !data.remove_gambar_soal && !data.gambar_soal && (
                            <div className="relative inline-block mb-3 border border-slate-200 rounded-xl overflow-hidden group">
                                <img src={`/storage/${question.gambar_soal}`} className="h-32 w-auto object-cover" alt="Preview Soal"/>
                                <button type="button" onClick={() => setData('remove_gambar_soal', true)} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Gambar Ini">
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        )}
                        
                        <input type="file" accept="image/*" onChange={e => { setData('gambar_soal', e.target.files[0]); setData('remove_gambar_soal', false); }} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200" />
                    </div>

                    {/* BAGIAN OPSI A-E */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Opsi Jawaban & Gambar</label>
                            <span className="text-xs font-bold text-slate-400">Pilih salah satu radio button sebagai kunci jawaban</span>
                        </div>
                        
                        <div className="space-y-6">
                            {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                                <div key={opt} className={`flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-2xl border-2 transition-all ${data.jawaban_benar === opt ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                                    
                                    <div className="flex items-center gap-3 shrink-0 mt-2">
                                        <input type="radio" name="kunci_jawaban" value={opt} checked={data.jawaban_benar === opt} onChange={e => setData('jawaban_benar', e.target.value)} className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 border-slate-300 cursor-pointer"/>
                                        <div className={`w-8 h-8 rounded-xl font-black flex items-center justify-center ${data.jawaban_benar === opt ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{opt.toUpperCase()}</div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-3">
                                        <textarea value={data[`opsi_${opt}`]} onChange={e => setData(`opsi_${opt}`, e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 focus:border-emerald-500 text-sm font-medium" placeholder={`Teks untuk opsi ${opt.toUpperCase()}...`} required></textarea>
                                        
                                        {/* Preview Gambar Opsi Lama */}
                                        {isEdit && question[`gambar_${opt}`] && !data[`remove_gambar_${opt}`] && !data[`gambar_${opt}`] && (
                                            <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group">
                                                <img src={`/storage/${question[`gambar_${opt}`]}`} className="h-16 w-auto object-cover" alt={`Preview ${opt}`}/>
                                                <button type="button" onClick={() => setData(`remove_gambar_${opt}`, true)} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Gambar">
                                                    <Trash2 size={12}/>
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <ImageIcon size={14} className="text-slate-400"/>
                                            <input type="file" accept="image/*" onChange={e => { setData(`gambar_${opt}`, e.target.files[0]); setData(`remove_gambar_${opt}`, false); }} className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:font-bold file:bg-slate-200 file:text-slate-600 hover:file:bg-slate-300" />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 shrink-0">
                        <button type="button" onClick={onClose} className="px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Batal</button>
                        <button type="submit" disabled={processing} className="px-8 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Pertanyaan'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}