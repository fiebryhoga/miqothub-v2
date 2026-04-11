import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, User, Mail, Lock } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, isEditMode, admin }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        foto_profile: null,
        _method: 'post', 
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (isEditMode && admin) {
                setData({
                    name: admin.name,
                    email: admin.email,
                    password: '', 
                    foto_profile: null,
                    _method: 'put', 
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
        
        const targetRoute = isEditMode 
            ? route('admin.management.update', admin.id) 
            : route('admin.management.store');

        post(targetRoute, {
            forceFormData: true, 
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
                    {/* Backdrop (Slate/Navy theme) */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
                    />

                    {/* Modal Box */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden pointer-events-auto flex flex-col max-h-[95vh] border border-slate-100"
                        >
                            {/* Header Modal */}
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        {isEditMode ? 'Edit Administrator' : 'Tambah Admin Baru'}
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        {isEditMode ? 'Perbarui informasi profil dan akses.' : 'Tambahkan akses untuk pengurus sistem.'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={submit} className="flex-1 overflow-y-auto scrollbar-thin z-10 flex flex-col bg-white">
                                <div className="p-8 pb-4">
                                    {/* Upload Area */}
                                    <div className="mb-8 flex flex-col items-center">
                                        <div className="relative w-28 h-28 mb-3">
                                            <div className="w-full h-full rounded-full border-[3px] border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden relative group shadow-sm transition-colors hover:border-blue-200">
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={32} />
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <span className="text-white text-xs font-bold tracking-wider">GANTI FOTO</span>
                                                </div>
                                                <input 
                                                    type="file" accept="image/*" onChange={handleImageChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        {errors.foto_profile && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.foto_profile}</p>}
                                    </div>

                                    {/* Input Fields Container */}
                                    <div className="space-y-5">
                                        {/* Input Nama */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                                    className={`pl-11 w-full rounded-xl border ${errors.name ? 'border-rose-300 focus:ring-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-3 text-sm font-medium outline-none transition-colors`}
                                                    placeholder="Nama lengkap pengurus" required
                                                />
                                            </div>
                                            {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.name}</p>}
                                        </div>

                                        {/* Input Email */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                                    className={`pl-11 w-full rounded-xl border ${errors.email ? 'border-rose-300 focus:ring-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-3 text-sm font-medium outline-none transition-colors`}
                                                    placeholder="admin@haji.com" required
                                                />
                                            </div>
                                            {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                                        </div>

                                        {/* Input Password */}
                                        <div>
                                            <label className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                <span>Password Akses</span>
                                                {isEditMode && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] tracking-widest">Opsional</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                                    className={`pl-11 w-full rounded-xl border ${errors.password ? 'border-rose-300 focus:ring-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-3 text-sm font-medium outline-none transition-colors`}
                                                    placeholder={isEditMode ? "Biarkan kosong jika tidak diubah" : "Minimal 8 karakter"}
                                                    required={!isEditMode}
                                                />
                                            </div>
                                            {errors.password && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Footer Form */}
                                <div className="mt-auto px-8 py-5 border-t border-slate-100 bg-[#F8FAFC] flex justify-end gap-3">
                                    <button 
                                        type="button" onClick={onClose} disabled={processing}
                                        className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit" disabled={processing}
                                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                    >
                                        {processing ? (
                                            <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                                        ) : (
                                            <> <Save size={18} /> Simpan Data </>
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