import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Settings, Phone, CreditCard, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Index({ auth, settings }) {
    const { flash = {} } = usePage().props;

    
    const getBool = (val) => val === 'true' || val === true;

    const { data, setData, post, processing, transform } = useForm({
        wa_admin: settings?.wa_admin || '',
        bank1_active: getBool(settings?.bank1_active),
        bank1_name: settings?.bank1_name || '',
        bank1_number: settings?.bank1_number || '',
        bank1_owner: settings?.bank1_owner || '',
        bank2_active: getBool(settings?.bank2_active),
        bank2_name: settings?.bank2_name || '',
        bank2_number: settings?.bank2_number || '',
        bank2_owner: settings?.bank2_owner || '',
    });

    const submit = (e) => {
        e.preventDefault();
        transform((currentData) => ({
            ...currentData,
            bank1_active: currentData.bank1_active ? 'true' : 'false',
            bank2_active: currentData.bank2_active ? 'true' : 'false',
        }));
        post(route('admin.settings.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Pengaturan Sistem" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                        <Settings size={28} strokeWidth={2.5} />
                    </div>
                    Pengaturan Sistem
                </h1>
                <p className="text-slate-500 mt-2 font-medium text-sm">Kelola nomor kontak admin dan metode pembayaran pendaftaran kelas.</p>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
                        <CheckCircle2 size={18} className="text-blue-600" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={submit} className="space-y-6">
                
                
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="p-3 bg-blue-900 text-white rounded-xl shadow-md shadow-blue-900/20">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">Kontak Customer Service</h2>
                            <p className="text-sm text-slate-500 font-medium">Nomor WhatsApp rujukan utama saat peserta butuh bantuan.</p>
                        </div>
                    </div>
                    
                    <div className="max-w-md">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nomor WhatsApp Admin</label>
                        <input 
                            type="text" 
                            value={data.wa_admin} 
                            onChange={e => setData('wa_admin', e.target.value)} 
                            placeholder="Contoh: 6281234567890" 
                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-3 px-4 font-semibold text-slate-800 transition-all outline-none"
                        />
                        <p className="text-[11px] text-slate-400 mt-3 font-medium italic">* Gunakan kode negara (62) tanpa spasi atau tanda (+).</p>
                    </div>
                </div>

                
                <div className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all duration-300 ${data.bank1_active ? 'border-blue-500 shadow-xl shadow-blue-900/5' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shadow-sm border transition-colors ${data.bank1_active ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                <CreditCard size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Metode Pembayaran Utama</h2>
                                <p className="text-sm text-slate-500 font-medium">Informasi rekening yang akan muncul pertama kali.</p>
                            </div>
                        </div>
                        <label className={`flex items-center cursor-pointer px-4 py-2 rounded-xl border-2 transition-all ${data.bank1_active ? 'bg-blue-900 border-blue-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <input type="checkbox" checked={data.bank1_active} onChange={e => setData('bank1_active', e.target.checked)} className="rounded text-blue-500 focus:ring-blue-500 mr-2.5 w-4 h-4 cursor-pointer border-slate-300" />
                            <span className="text-xs font-black uppercase tracking-widest">{data.bank1_active ? 'AKTIF' : 'NONAKTIF'}</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Bank / E-Wallet</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_name} onChange={e => setData('bank1_name', e.target.value)} placeholder="BCA / DANA / OVO" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-slate-800 transition-all disabled:opacity-50 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nomor Rekening</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_number} onChange={e => setData('bank1_number', e.target.value)} placeholder="1234567890" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-slate-800 transition-all disabled:opacity-50 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Atas Nama (Pemilik)</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_owner} onChange={e => setData('bank1_owner', e.target.value)} placeholder="Ahmad Fulan" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-slate-800 transition-all disabled:opacity-50 outline-none" />
                        </div>
                    </div>
                </div>

                
                <div className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all duration-300 ${data.bank2_active ? 'border-blue-500 shadow-xl shadow-blue-900/5' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shadow-sm border transition-colors ${data.bank2_active ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                <CreditCard size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Metode Pembayaran Cadangan</h2>
                                <p className="text-sm text-slate-500 font-medium">Metode pembayaran pilihan kedua (opsional).</p>
                            </div>
                        </div>
                        <label className={`flex items-center cursor-pointer px-4 py-2 rounded-xl border-2 transition-all ${data.bank2_active ? 'bg-blue-900 border-blue-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <input type="checkbox" checked={data.bank2_active} onChange={e => setData('bank2_active', e.target.checked)} className="rounded text-blue-500 focus:ring-blue-500 mr-2.5 w-4 h-4 cursor-pointer border-slate-300" />
                            <span className="text-xs font-black uppercase tracking-widest">{data.bank2_active ? 'AKTIF' : 'NONAKTIF'}</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Bank / E-Wallet</label>
                            <input disabled={!data.bank2_active} type="text" value={data.bank2_name} onChange={e => setData('bank2_name', e.target.value)} placeholder="BCA / DANA / OVO" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-slate-800 transition-all disabled:opacity-50 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nomor Rekening</label>
                            <input disabled={!data.bank2_active} type="text" value={data.bank2_number} onChange={e => setData('bank2_number', e.target.value)} placeholder="1234567890" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-slate-800 transition-all disabled:opacity-50 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Atas Nama (Pemilik)</label>
                            <input disabled={!data.bank2_active} type="text" value={data.bank2_owner} onChange={e => setData('bank2_owner', e.target.value)} placeholder="Ahmad Fulan" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-slate-800 transition-all disabled:opacity-50 outline-none" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-12">
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="flex items-center gap-2 px-10 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95 disabled:opacity-70 text-sm"
                    >
                        {processing ? (
                            <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                        ) : (
                            <> <Save size={18} /> Simpan Pengaturan </>
                        )}
                    </button>
                </div>
            </form>

        </AdminLayout>
    );
}