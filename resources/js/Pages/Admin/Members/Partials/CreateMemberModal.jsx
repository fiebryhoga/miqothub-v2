import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';

export default function CreateMemberModal({ isOpen, onClose }) {
    // 👇 PERBAIKAN: Menambahkan password_confirmation di state form
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', 
        pekerjaan: '', umur: '', alamat: '', status: '', status_akun: 'aktif'
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.members.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                        
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <UserPlus className="text-emerald-500" /> Registrasi Member Manual
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><X size={24} /></button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-5 overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Nama Lengkap Sesuai KTP</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" required />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email Aktif</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" required />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Password Akun</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" required />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                {/* 👇 PERBAIKAN: Input Konfirmasi Password Dimunculkan Kembali 👇 */}
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Konfirmasi Password</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" required />
                                </div>
                                
                                <div className="md:col-span-2 border-t border-slate-100 my-2"></div>
                                
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Pekerjaan</label>
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Umur</label>
                                        <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Status</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm font-medium shadow-sm transition-all cursor-pointer">
                                            <option value="">Pilih...</option><option value="menikah">Menikah</option><option value="belum">Belum</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Status Akun</label>
                                    <select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm font-medium shadow-sm transition-all cursor-pointer">
                                        <option value="aktif">Otomatis Aktif</option><option value="pending">Pending</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Alamat Lengkap Domisili</label>
                                    <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all"></textarea>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Batal</button>
                                <button type="submit" disabled={processing} className="px-8 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2">
                                    {processing ? 'Menyimpan...' : 'Simpan Member Baru'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}