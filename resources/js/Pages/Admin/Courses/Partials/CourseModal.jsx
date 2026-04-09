import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Type, FileText, DollarSign, Users, Calendar, Link as LinkIcon, CheckSquare, Plus, Trash2, Tag } from 'lucide-react';

export default function CourseModal({ isOpen, onClose, isEditMode, course }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: '', deskripsi: '', harga: '', harga_coret: '', batch: '', 
        status: 'onsale', kuota: '', tanggal_mulai: '', link_grup_wa: '', 
        fitur: [''], // Array default 1 item kosong
        thumbnail: null, _method: 'post',
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (isEditMode && course) {
                setData({
                    nama: course.nama, deskripsi: course.deskripsi, harga: course.harga, 
                    harga_coret: course.harga_coret || '', batch: course.batch, 
                    status: course.status, kuota: course.kuota || '', 
                    tanggal_mulai: course.tanggal_mulai ? course.tanggal_mulai.split('T')[0] : '', 
                    link_grup_wa: course.link_grup_wa || '', 
                    fitur: course.fitur?.length > 0 ? course.fitur : [''], 
                    thumbnail: null, _method: 'put',
                });
                setPreview(course.thumbnail_url);
            } else {
                reset(); setData('_method', 'post'); setPreview(null);
            }
        }
    }, [isOpen, isEditMode, course]);

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('thumbnail', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // Handle Dynamic Fitur Array
    const handleFiturChange = (index, value) => {
        const newFitur = [...data.fitur];
        newFitur[index] = value;
        setData('fitur', newFitur);
    };
    const addFitur = () => setData('fitur', [...data.fitur, '']);
    const removeFitur = (index) => {
        const newFitur = data.fitur.filter((_, i) => i !== index);
        setData('fitur', newFitur.length ? newFitur : ['']);
    };

    const submit = (e) => {
        e.preventDefault();
        const targetRoute = isEditMode ? route('admin.courses.update', course.id) : route('admin.courses.store');
        post(targetRoute, { forceFormData: true, onSuccess: () => onClose() });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            // Modal dibuat lebih lebar (max-w-5xl)
                            className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[95vh]"
                        >
                            {/* Header Modal */}
                            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 z-10 shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Data Kelas' : 'Buat Kelas Baru'}</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Lengkapi informasi program pelatihan petugas haji.</p>
                                </div>
                                <button onClick={onClose} className="p-2.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm transition-all border border-gray-200">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body (DIBAGI 2 KOLOM) */}
                            <form onSubmit={submit} className="flex-1 overflow-y-auto scrollbar-thin z-10 flex flex-col">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
                                    
                                    {/* KOLOM KIRI (7 Kolom): Visual & Konten */}
                                    <div className="lg:col-span-7 space-y-6">
                                        
                                        {/* Upload Thumbnail Banner */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail Kelas</label>
                                            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-400 transition-colors">
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-emerald-500 transition-colors" size={32} />
                                                        <p className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</p>
                                                        <p className="text-xs text-gray-400 mt-1">16:9 Rasio. Maks 2MB.</p>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            </div>
                                            {errors.thumbnail && <p className="text-red-500 text-xs mt-1.5">{errors.thumbnail}</p>}
                                        </div>

                                        {/* Nama & Deskripsi */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kelas</label>
                                            <div className="relative">
                                                <Type size={18} className="absolute top-3.5 left-4 text-gray-400" />
                                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="pl-11 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3" placeholder="Contoh: Pemantapan Petugas Kloter" required />
                                            </div>
                                            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap</label>
                                            <div className="relative">
                                                <FileText size={18} className="absolute top-3.5 left-4 text-gray-400" />
                                                <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="4" className="pl-11 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3" placeholder="Jelaskan apa yang akan dipelajari..." required />
                                            </div>
                                            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                                        </div>

                                        {/* Dynamic Fitur Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                                                <span>Fasilitas / Fitur yang Didapat</span>
                                                <button type="button" onClick={addFitur} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-emerald-100 transition-colors">
                                                    <Plus size={14} /> Tambah
                                                </button>
                                            </label>
                                            <div className="space-y-3">
                                                {data.fitur.map((item, index) => (
                                                    <div key={index} className="flex gap-2 relative">
                                                        <CheckSquare size={18} className="absolute top-3.5 left-4 text-emerald-500 z-10" />
                                                        <input type="text" value={item} onChange={e => handleFiturChange(index, e.target.value)} className="pl-11 flex-1 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3 text-sm" placeholder="Contoh: E-Sertifikat Resmi Kemenag" required />
                                                        <button type="button" onClick={() => removeFitur(index)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* KOLOM KANAN (5 Kolom): Harga & Pengaturan Sistem */}
                                    <div className="lg:col-span-5 bg-slate-50/80 p-6 rounded-3xl border border-slate-100 h-fit space-y-6">
                                        
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag size={20} className="text-emerald-600" />
                                            <h3 className="font-bold text-gray-900">Pengaturan Kelas</h3>
                                        </div>

                                        {/* Harga Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Harga Jual (Rp)</label>
                                                <div className="relative">
                                                    <DollarSign size={16} className="absolute top-3.5 left-3 text-gray-400" />
                                                    <input type="number" value={data.harga} onChange={e => setData('harga', e.target.value)} className="pl-9 w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm font-bold text-gray-900" placeholder="0" required />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Harga Coret (Opsional)</label>
                                                <div className="relative">
                                                    <DollarSign size={16} className="absolute top-3.5 left-3 text-gray-400" />
                                                    <input type="number" value={data.harga_coret} onChange={e => setData('harga_coret', e.target.value)} className="pl-9 w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm text-gray-500 line-through" placeholder="0" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Batch & Status */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Batch / Gelombang</label>
                                                <input type="text" value={data.batch} onChange={e => setData('batch', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm font-semibold" placeholder="Misal: 1" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status Pendaftaran</label>
                                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm font-semibold cursor-pointer appearance-none">
                                                    <option value="onsale">✅ Buka (On Sale)</option>
                                                    <option value="offsale">⛔ Tutup (Off Sale)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Kuota & Tanggal */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kuota Peserta</label>
                                                <div className="relative">
                                                    <Users size={16} className="absolute top-3.5 left-3 text-gray-400" />
                                                    <input type="number" value={data.kuota} onChange={e => setData('kuota', e.target.value)} className="pl-9 w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm" placeholder="Kosong = Unlimited" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tanggal Mulai</label>
                                                <div className="relative">
                                                    <Calendar size={16} className="absolute top-3.5 left-3 text-gray-400" />
                                                    <input type="date" value={data.tanggal_mulai} onChange={e => setData('tanggal_mulai', e.target.value)} className="pl-9 w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm text-gray-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Link Grup WA */}
                                        <div className="pt-2">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Link Grup WhatsApp (Akses Peserta)</label>
                                            <div className="relative">
                                                <LinkIcon size={16} className="absolute top-3.5 left-3 text-gray-400" />
                                                <input type="url" value={data.link_grup_wa} onChange={e => setData('link_grup_wa', e.target.value)} className="pl-9 w-full rounded-xl border border-gray-200 bg-white focus:border-emerald-500 py-3 text-sm text-emerald-600" placeholder="https://chat.whatsapp.com/..." />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                
                                {/* Footer Form */}
                                <div className="mt-auto px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
                                    <button type="button" onClick={onClose} disabled={processing} className="px-6 py-3 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70">
                                        {processing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                                        {processing ? 'Menyimpan...' : 'Simpan Kelas'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}