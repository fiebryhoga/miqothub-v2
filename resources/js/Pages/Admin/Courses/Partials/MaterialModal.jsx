import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, X } from 'lucide-react';

export default function MaterialModal({ show, onClose, chapterId, material, nextOrder }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '', tipe: 'video', deskripsi: '', 
        link_video: '', file_path: null, durasi: '', 
        is_preview: false, urutan: 1, _method: 'post',
        tanggal_waktu_meet: '', link_meet: '', password_meet: '',
        deadline_latihan: ''
    });

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (show) {
            if (material) {
                setData({
                    judul: material.judul, 
                    tipe: material.tipe, 
                    deskripsi: material.deskripsi || '',
                    link_video: material.link_video || '', 
                    file_path: null, 
                    durasi: material.durasi || '',
                    is_preview: material.is_preview ? true : false, 
                    urutan: material.urutan, 
                    _method: 'put',
                    tanggal_waktu_meet: formatDateTimeLocal(material.tanggal_waktu_meet),
                    link_meet: material.link_meet || '',
                    password_meet: material.password_meet || '',
                    deadline_latihan: '' 
                });
            } else {
                setData({
                    judul: '', tipe: 'video', deskripsi: '', link_video: '', file_path: null,
                    durasi: '', is_preview: false, urutan: nextOrder, _method: 'post',
                    tanggal_waktu_meet: '', link_meet: '', password_meet: '', deadline_latihan: ''
                });
            }
        } else {
            reset();
        }
    }, [show, material]);

    // 👇 INI YANG DIPERBAIKI: Mengarahkan data ke rute yang benar sesuai Tipe 👇
    const submit = (e) => {
        e.preventDefault();
        
        let targetRoute = '';
        
        if (material) {
            // Mode Edit: Semua masuk ke updateMaterial
            targetRoute = route('admin.materials.update', material.id);
        } else {
            // Mode Tambah Baru: Pisahkan berdasarkan tipe
            if (data.tipe === 'pertemuan') {
                targetRoute = route('admin.meetings.store', chapterId);
            } else if (data.tipe === 'latihan') {
                targetRoute = route('admin.exercises.store', chapterId);
            } else {
                targetRoute = route('admin.materials.store', chapterId);
            }
        }
        
        post(targetRoute, { forceFormData: true, onSuccess: () => onClose() });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-lg font-black text-slate-800">{material ? 'Edit Data Materi' : 'Tambah Materi Baru'}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Materi</label>
                            <input 
                                type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} 
                                className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 font-medium text-slate-800" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipe Materi</label>
                            <select 
                                value={data.tipe} onChange={e => setData('tipe', e.target.value)} 
                                className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 font-bold text-slate-800"
                            >
                                <option value="video">Video (YouTube/Drive)</option>
                                <option value="pdf">File PDF</option>
                                <option value="text_only">Teks Bacaan Saja</option>
                                <option value="pertemuan">Sesi Pertemuan (Live/Zoom)</option>
                                <option value="latihan">Latihan / Tugas</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Urutan & Estimasi Durasi</label>
                            <div className="flex gap-3">
                                <input 
                                    type="number" value={data.urutan} onChange={e => setData('urutan', e.target.value)} 
                                    className="w-20 px-3 py-3 rounded-xl border-slate-200 bg-slate-50 text-center font-bold text-slate-800" 
                                    title="Urutan" required 
                                />
                                <input 
                                    type="text" value={data.durasi} onChange={e => setData('durasi', e.target.value)} 
                                    className="flex-1 px-4 py-3 rounded-xl border-slate-200 bg-slate-50 font-medium text-slate-800" 
                                    placeholder="Cth: 15 Menit" 
                                />
                            </div>
                        </div>
                    </div>

                    {data.tipe === 'video' && (
                        <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                            <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Link URL Video</label>
                            <input type="url" value={data.link_video} onChange={e => setData('link_video', e.target.value)} className="w-full px-4 py-3 rounded-xl border-blue-200 bg-white font-medium focus:ring-blue-500 focus:border-blue-500" placeholder="https://youtube.com/..." required />
                        </div>
                    )}

                    {data.tipe === 'pdf' && (
                        <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                            <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Upload File PDF {material && '(Biarkan kosong jika tetap)'}</label>
                            <input type="file" accept=".pdf" onChange={e => setData('file_path', e.target.files[0])} className="w-full text-sm font-medium file:mr-4 file:py-2 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200" required={!material} />
                            {errors.file_path && <span className="text-xs text-rose-500 mt-2 block font-medium">{errors.file_path}</span>}
                        </div>
                    )}

                    {data.tipe === 'pertemuan' && (
                        <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Link Zoom / Meet</label>
                                    <input type="url" value={data.link_meet} onChange={e => setData('link_meet', e.target.value)} className="w-full px-4 py-3 rounded-xl border-purple-200 bg-white font-medium focus:ring-purple-500 focus:border-purple-500" placeholder="https://zoom.us/j/..." required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Tanggal & Waktu</label>
                                    <input type="datetime-local" value={data.tanggal_waktu_meet} onChange={e => setData('tanggal_waktu_meet', e.target.value)} className="w-full px-4 py-3 rounded-xl border-purple-200 bg-white font-medium focus:ring-purple-500 focus:border-purple-500" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Password / Passcode (Opsional)</label>
                                <input type="text" value={data.password_meet} onChange={e => setData('password_meet', e.target.value)} className="w-full px-4 py-3 rounded-xl border-purple-200 bg-white font-medium focus:ring-purple-500 focus:border-purple-500" placeholder="Contoh: 123456" />
                            </div>
                        </div>
                    )}

                    {data.tipe === 'latihan' && (
                        <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                            <div className="bg-orange-100 text-orange-800 p-4 rounded-xl text-sm font-medium">
                                <p><strong>Penting:</strong> Setelah materi latihan ini dibuat, Anda harus masuk ke Menu Latihan / Bank Soal untuk menambahkan soal Pilihan Ganda ke dalam modul ini.</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Tambahan / Catatan</label>
                        <textarea 
                            value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="3" 
                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 font-medium text-slate-800"
                        ></textarea>
                    </div>

                    <label className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-colors group">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" checked={data.is_preview} onChange={e => setData('is_preview', e.target.checked)} 
                                className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Jadikan Free Preview</p>
                            <p className="text-xs text-slate-500 mt-0.5">Materi ini bisa dilihat pengunjung publik sebagai "tester" tanpa perlu mendaftar kelas.</p>
                        </div>
                    </label>

                    <div className="pt-5 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Materi'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}