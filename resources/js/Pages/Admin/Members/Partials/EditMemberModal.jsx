import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, X, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EditMemberModal({ isOpen, onClose, member }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, clearErrors, reset, errors } = useForm({
        _method: 'put', 
        name: '', email: '', pekerjaan: '', umur: '', 
        alamat: '', status: '', status_akun: '',
        password: '', foto_profile: null
    });

    useEffect(() => {
        if (member && isOpen) {
            clearErrors();
            setData({
                _method: 'put',
                name: member.name || '', 
                email: member.email || '', 
                pekerjaan: member.pekerjaan || '', 
                umur: member.umur || '', 
                alamat: member.alamat || '', 
                status: member.status || '', 
                status_akun: member.status_akun || 'aktif',
                password: '', 
                foto_profile: null 
            });
            setPreview(member.foto_profile ? `/storage/${member.foto_profile}` : null);
        }
    }, [member, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('foto_profile', file);
        
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(member.foto_profile ? `/storage/${member.foto_profile}` : null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.members.update', member.id), { 
            forceFormData: true, 
            onSuccess: () => {
                reset();
                setPreview(null);
                onClose();
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && member && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-opacity" />
                    
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] border border-slate-100">
                        
                        {/* Header Modal */}
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <Edit size={20} strokeWidth={2.5} />
                                </div>
                                Perbarui Profil Member
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"><X size={20} /></button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-5 overflow-y-auto scrollbar-thin bg-white">
                            
                            {/* Area Upload Foto */}
                            <div className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0 relative group">
                                    {preview ? (
                                        <img src={preview} alt="Preview Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={28} className="text-slate-300" />
                                    )}
                                    {/* Overlay Hover */}
                                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" size={18} />
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Klik untuk ganti foto" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-800 mb-0.5">Foto Profil Member</h3>
                                    <p className="text-[11px] font-medium text-slate-500 mb-2.5">Format JPG/PNG/GIF. Maksimal 2MB.</p>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer transition-colors" />
                                    {errors.foto_profile && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.foto_profile}</p>}
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-medium shadow-sm outline-none transition-colors" required />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Aktif</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-medium shadow-sm outline-none transition-colors" required />
                                    {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div>
                                    <label className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        <span>Ganti Password</span>
                                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md tracking-widest">Opsional</span>
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Kosongkan jika tak diubah" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-medium shadow-sm outline-none transition-colors" />
                                    {errors.password && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status Akun</label>
                                    <select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className={`w-full rounded-xl py-3 px-4 text-sm font-bold tracking-wide outline-none transition-colors cursor-pointer appearance-none shadow-sm ${data.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20' : data.status_akun === 'suspen' ? 'bg-rose-50 text-rose-700 border border-rose-200 focus:border-rose-500 focus:ring-rose-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200 focus:border-amber-500 focus:ring-amber-500/20'}`}>
                                        <option value="aktif">AKTIF</option>
                                        <option value="suspen">SUSPEN (BLOKIR)</option>
                                        <option value="pending">PENDING</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Pekerjaan</label>
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-medium shadow-sm outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Umur</label>
                                    <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-medium shadow-sm outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-semibold shadow-sm outline-none transition-colors cursor-pointer appearance-none">
                                        <option value="">Pilih...</option><option value="menikah">Menikah</option><option value="belum">Belum</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Alamat Lengkap</label>
                                <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-medium shadow-sm outline-none transition-colors resize-none"></textarea>
                            </div>

                            {/* Footer / Action Buttons */}
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">Batal</button>
                                {/* Tombol Simpan Menggunakan Tema Biru Dongker (bg-blue-900) */}
                                <button type="submit" disabled={processing} className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}