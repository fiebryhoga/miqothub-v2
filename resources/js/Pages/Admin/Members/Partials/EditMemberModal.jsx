import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, X, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EditMemberModal({ isOpen, onClose, member }) {
    // 👇 State khusus untuk preview gambar
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, clearErrors, reset, errors } = useForm({
        _method: 'put', 
        name: '', email: '', pekerjaan: '', umur: '', 
        alamat: '', status: '', status_akun: '',
        password: '', foto_profile: null
    });

    // Isi form otomatis saat modal dibuka
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
            // Tampilkan foto profil lama jika member sudah punya foto
            setPreview(member.foto_profile ? `/storage/${member.foto_profile}` : null);
        }
    }, [member, isOpen]);

    // Fungsi saat admin memilih file foto baru
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('foto_profile', file);
        
        if (file) {
            // Buat URL sementara untuk preview gambar lokal yang baru dipilih
            setPreview(URL.createObjectURL(file));
        } else {
            // Kembalikan ke foto lama jika admin batal memilih
            setPreview(member.foto_profile ? `/storage/${member.foto_profile}` : null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.members.update', member.id), { 
            forceFormData: true, // Wajib untuk kirim file
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                        
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <Edit className="text-blue-500" /> Perbarui Profil Member
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><X size={24} /></button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-5 overflow-y-auto scrollbar-thin">
                            
                            {/* 👇 BAGIAN UPLOAD FOTO DENGAN PREVIEW 👇 */}
                            <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border-2 border-white flex items-center justify-center shrink-0 relative group">
                                    {preview ? (
                                        <img src={preview} alt="Preview Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-black text-slate-300 uppercase">
                                            {data.name.charAt(0)}
                                        </span>
                                    )}
                                    {/* Overlay Hover */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" size={20} />
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Klik untuk ganti foto" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-800 mb-1">Foto Profil Member</h3>
                                    <p className="text-xs text-slate-500 mb-3">Format JPG, PNG, atau GIF. Maksimal 2MB.</p>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
                                    {errors.foto_profile && <p className="text-red-500 text-xs mt-1">{errors.foto_profile}</p>}
                                </div>
                            </div>
                            {/* 👆 AKHIR BAGIAN FOTO 👆 */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nama Lengkap</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" required />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Aktif</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" required />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Ganti Password (Opsional)</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Kosongkan jika tak diubah" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Status Akun</label>
                                    <select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className={`w-full rounded-xl border py-3 text-sm font-black uppercase cursor-pointer ${data.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : data.status_akun === 'suspen' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                        <option value="aktif">AKTIF</option><option value="suspen">SUSPEN (BLOKIR)</option><option value="pending">PENDING</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Pekerjaan</label>
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Umur</label>
                                    <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm font-medium cursor-pointer">
                                        <option value="">Pilih...</option><option value="menikah">Menikah</option><option value="belum">Belum Menikah</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Alamat Lengkap</label>
                                <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium"></textarea>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Batal</button>
                                <button type="submit" disabled={processing} className="px-8 py-3 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
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