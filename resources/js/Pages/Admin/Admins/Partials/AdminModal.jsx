import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, User, Mail, Lock } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, isEditMode, admin }) {
    const [preview, setPreview] = useState(null);

    // Kunci Perbaikan: Kita tambahkan _method di state untuk spoofing PUT request Laravel
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        foto_profile: null,
        _method: 'post', 
    });

    // Jalankan efek ini setiap kali modal dibuka/ditutup atau status edit berubah
    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (isEditMode && admin) {
                setData({
                    name: admin.name,
                    email: admin.email,
                    password: '', // Kosong agar admin tidak perlu isi kecuali ingin ganti
                    foto_profile: null,
                    _method: 'put', // Laravel butuh ini untuk update file via POST
                });
                setPreview(admin.foto_url);
            } else {
                reset();
                setData('_method', 'post');
                setPreview(null);
            }
        }
    }, [isOpen, isEditMode, admin]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('foto_profile', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Kunci Perbaikan 2: Kita selalu gunakan `post()` dari useForm agar 'processing' tertangani otomatis
        const targetRoute = isEditMode 
            ? route('admin.management.update', admin.id) 
            : route('admin.management.store');

        post(targetRoute, {
            forceFormData: true, // Wajib true agar file gambar bisa terkirim
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Blur effect */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40"
                    />

                    {/* Modal Box */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[95vh] border border-white/20 relative"
                        >
                            {/* Dekorasi Background */}
                            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-emerald-400 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                            {/* Header Modal */}
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50 z-10">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                        {isEditMode ? 'Edit Administrator' : 'Tambah Admin Baru'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isEditMode ? 'Perbarui informasi profil dan akses.' : 'Tambahkan akses untuk pengurus sistem.'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={submit} className="flex-1 overflow-y-auto scrollbar-thin z-10 flex flex-col">
                                <div className="p-8 pb-4">
                                    {/* Upload Area */}
                                    <div className="mb-8 flex flex-col items-center">
                                        <div className="relative w-28 h-28 mb-3">
                                            <div className="w-full h-full rounded-full border-[3px] border-emerald-100 bg-emerald-50/50 flex items-center justify-center overflow-hidden relative group shadow-inner transition-all hover:border-emerald-300">
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="text-emerald-400 group-hover:scale-110 transition-transform" size={32} />
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                                                    <span className="text-white text-xs font-bold tracking-wider">GANTI FOTO</span>
                                                </div>
                                                <input 
                                                    type="file" accept="image/*" onChange={handleImageChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        {errors.foto_profile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.foto_profile}</p>}
                                    </div>

                                    {/* Input Fields Container */}
                                    <div className="space-y-5">
                                        {/* Input Nama */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                                    className={`pl-11 w-full rounded-2xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50/50'} focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3 transition-all`}
                                                    placeholder="Nama lengkap pengurus" required
                                                />
                                            </div>
                                            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                                        </div>

                                        {/* Input Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                                    className={`pl-11 w-full rounded-2xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50/50'} focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3 transition-all`}
                                                    placeholder="admin@haji.com" required
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                                        </div>

                                        {/* Input Password */}
                                        <div>
                                            <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                                                <span>Password Akses</span>
                                                {isEditMode && <span className="text-emerald-600/70 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Opsional</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                                    className={`pl-11 w-full rounded-2xl border ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50/50'} focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3 transition-all`}
                                                    placeholder={isEditMode ? "Biarkan kosong jika tidak diubah" : "Minimal 8 karakter"}
                                                    required={!isEditMode}
                                                />
                                            </div>
                                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Footer Form */}
                                <div className="mt-auto px-8 py-5 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 rounded-b-[2rem]">
                                    <button 
                                        type="button" onClick={onClose} disabled={processing}
                                        className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" disabled={processing}
                                        className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <> <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                                        ) : (
                                            <> <Save size={20} /> Simpan Data </>
                                        )}
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