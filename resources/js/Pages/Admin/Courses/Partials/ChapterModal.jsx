import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Save } from 'lucide-react';

export default function ChapterModal({ show, onClose, courseId, chapter, nextOrder }) {
    const { data, setData, post, put, processing, reset } = useForm({
        judul: '',
        urutan: 1,
    });

    useEffect(() => {
        if (show) {
            setData({
                judul: chapter ? chapter.judul : '',
                urutan: chapter ? chapter.urutan : nextOrder,
            });
        } else {
            reset();
        }
    }, [show, chapter]);

    const submit = (e) => {
        e.preventDefault();
        if (chapter) {
            put(route('admin.chapters.update', chapter.id), { onSuccess: () => onClose() });
        } else {
            post(route('admin.chapters.store', courseId), { onSuccess: () => onClose() });
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                    />
                    
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-100 flex flex-col"
                    >
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <Layers size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {chapter ? 'Edit Data Bab' : 'Tambah Bab Baru'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        
                        <form onSubmit={submit} className="flex flex-col">
                            <div className="p-6 space-y-5 bg-white">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Judul Bab</label>
                                    <input 
                                        type="text" 
                                        value={data.judul} 
                                        onChange={e => setData('judul', e.target.value)} 
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors" 
                                        placeholder="Cth: Bab 1: Pendahuluan" 
                                        required 
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Urutan Ke-</label>
                                    <input 
                                        type="number" 
                                        value={data.urutan} 
                                        onChange={e => setData('urutan', e.target.value)} 
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors" 
                                        required 
                                        min="1"
                                    />
                                </div>
                            </div>

                            
                            <div className="px-6 py-5 border-t border-slate-100 bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                >
                                    {processing ? (
                                        <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                                    ) : (
                                        <> <Save size={16} /> {chapter ? 'Simpan Perubahan' : 'Simpan Bab'} </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}