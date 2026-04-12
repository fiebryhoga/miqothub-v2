import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Trash2, HelpCircle, Save } from 'lucide-react';

export default function QuestionModal({ show, onClose, exerciseId, question }) {
    const isEdit = !!question;

    const { data, setData, post, processing, reset, errors } = useForm({
        pertanyaan: '', jawaban_benar: 'a',
        opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', opsi_e: '',
        gambar_soal: null, gambar_a: null, gambar_b: null, gambar_c: null, gambar_d: null, gambar_e: null,
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

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
                    
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
                        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden max-h-[95vh] flex flex-col border border-slate-100"
                    >
                        
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <HelpCircle size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {isEdit ? 'Edit Pertanyaan' : 'Buat Pertanyaan Baru'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        
                        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden bg-white">
                            <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin">
                                
                                
                                <div className="mb-8 p-6 lg:p-8 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-sm">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Teks Pertanyaan Utama</label>
                                    <textarea 
                                        value={data.pertanyaan} 
                                        onChange={e => setData('pertanyaan', e.target.value)} 
                                        rows="3" 
                                        className="w-full mb-5 px-5 py-4 rounded-2xl border-slate-200 bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-medium text-slate-800 text-base md:text-lg leading-relaxed shadow-sm outline-none transition-colors resize-none" 
                                        placeholder="Tuliskan pertanyaan di sini..."
                                        required
                                    ></textarea>
                                    
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                                        <ImageIcon size={14}/> Sisipkan Gambar Soal (Opsional)
                                    </label>
                                    
                                    
                                    {isEdit && question.gambar_soal && !data.remove_gambar_soal && !data.gambar_soal && (
                                        <div className="relative inline-block mb-4 border border-slate-200 rounded-xl overflow-hidden group shadow-sm bg-white p-1">
                                            <img src={`/storage/${question.gambar_soal}`} className="h-32 w-auto object-cover rounded-lg" alt="Preview Soal"/>
                                            <button type="button" onClick={() => setData('remove_gambar_soal', true)} className="absolute top-2 right-2 p-1.5 bg-rose-500/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm" title="Hapus Gambar Ini">
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    )}
                                    
                                    <input 
                                        type="file" accept="image/*" 
                                        onChange={e => { setData('gambar_soal', e.target.files[0]); setData('remove_gambar_soal', false); }} 
                                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors" 
                                    />
                                </div>

                                
                                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 lg:p-8 mb-4 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2 border-b border-slate-100 pb-4">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opsi Jawaban & Gambar</label>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                                            Pilih (Klik) Huruf Sebagai Kunci Jawaban
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                                            <div 
                                                key={opt} 
                                                className={`flex flex-col md:flex-row md:items-start gap-4 p-4 lg:p-5 rounded-2xl border-2 transition-all duration-300 ${
                                                    data.jawaban_benar === opt 
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-900/5' 
                                                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                                }`}
                                            >
                                                
                                                <label className="flex items-center gap-3 shrink-0 mt-1 cursor-pointer group">
                                                    <input 
                                                        type="radio" name="kunci_jawaban" value={opt} 
                                                        checked={data.jawaban_benar === opt} 
                                                        onChange={e => setData('jawaban_benar', e.target.value)} 
                                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500/30 border-slate-300 cursor-pointer transition-colors hidden sm:block"
                                                    />
                                                    <div className={`w-9 h-9 rounded-xl font-black flex items-center justify-center transition-colors shadow-sm ${
                                                        data.jawaban_benar === opt 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-white border border-slate-200 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                                                    }`}>
                                                        {opt.toUpperCase()}
                                                    </div>
                                                </label>
                                                
                                                
                                                <div className="flex-1 space-y-3">
                                                    <textarea 
                                                        value={data[`opsi_${opt}`]} 
                                                        onChange={e => setData(`opsi_${opt}`, e.target.value)} 
                                                        rows="2" 
                                                        className={`w-full rounded-xl focus:ring-4 focus:ring-blue-500/20 text-sm font-medium outline-none transition-colors resize-none ${
                                                            data.jawaban_benar === opt ? 'border-blue-200 bg-white focus:border-blue-500' : 'border-slate-200 bg-white focus:border-blue-400'
                                                        }`} 
                                                        placeholder={`Ketikkan teks untuk opsi ${opt.toUpperCase()}...`} 
                                                        required
                                                    ></textarea>
                                                    
                                                    
                                                    {isEdit && question[`gambar_${opt}`] && !data[`remove_gambar_${opt}`] && !data[`gambar_${opt}`] && (
                                                        <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group bg-white p-1 shadow-sm">
                                                            <img src={`/storage/${question[`gambar_${opt}`]}`} className="h-16 w-auto object-cover rounded" alt={`Preview ${opt}`}/>
                                                            <button type="button" onClick={() => setData(`remove_gambar_${opt}`, true)} className="absolute top-1.5 right-1.5 p-1 bg-rose-500/90 hover:bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all shadow-sm" title="Hapus Gambar">
                                                                <Trash2 size={12}/>
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <ImageIcon size={14} className="text-slate-400 shrink-0"/>
                                                        <input 
                                                            type="file" accept="image/*" 
                                                            onChange={e => { setData(`gambar_${opt}`, e.target.files[0]); setData(`remove_gambar_${opt}`, false); }} 
                                                            className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-bold file:bg-slate-200 file:text-slate-600 hover:file:bg-slate-300 cursor-pointer transition-colors" 
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            
                            <div className="px-6 md:px-8 py-5 bg-[#F8FAFC] border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} disabled={processing} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors disabled:opacity-50 text-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                                    {processing ? (
                                        <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                                    ) : (
                                        <> <Save size={16} /> Simpan Pertanyaan </>
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