import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X } from 'lucide-react';

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

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header Premium */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Layers size={20} />
                        </div>
                        <h2 className="text-lg font-black text-slate-800">{chapter ? 'Edit Data Bab' : 'Tambah Bab Baru'}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Bab</label>
                        <input 
                            type="text" 
                            value={data.judul} 
                            onChange={e => setData('judul', e.target.value)} 
                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all font-medium text-slate-800" 
                            placeholder="Cth: Bab 1: Pendahuluan" 
                            required 
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Urutan Ke-</label>
                        <input 
                            type="number" 
                            value={data.urutan} 
                            onChange={e => setData('urutan', e.target.value)} 
                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all font-medium text-slate-800" 
                            required 
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Bab'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}