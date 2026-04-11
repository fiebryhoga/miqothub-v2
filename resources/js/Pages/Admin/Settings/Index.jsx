import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Settings, Phone, CreditCard, ShieldAlert } from 'lucide-react';

export default function Index({ auth, settings }) {
    const { flash = {} } = usePage().props;

    // Helper untuk mengonversi string "true"/"false" dari database kembali menjadi boolean
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
        
        // Gunakan transform untuk mencegat dan memformat data sebelum dikirim
        transform((currentData) => ({
            ...currentData,
            bank1_active: currentData.bank1_active ? 'true' : 'false',
            bank2_active: currentData.bank2_active ? 'true' : 'false',
        }));

        // Sekarang post() akan otomatis menggunakan data yang sudah di-transform
        post(route('admin.settings.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Pengaturan Sistem" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Settings className="text-emerald-500" size={32} /> Pengaturan Sistem
                </h1>
                <p className="text-slate-500 mt-1">Kelola nomor kontak admin dan metode pembayaran pendaftaran kelas.</p>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center gap-3">
                        <ShieldAlert size={20} /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={submit} className="space-y-6">
                
                {/* --- KOTAK 1: KONTAK ADMIN --- */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Phone size={24} /></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Kontak Admin (Customer Service)</h2>
                            <p className="text-sm text-slate-500">Nomor ini akan digunakan sebagai rujukan utama saat peserta butuh bantuan.</p>
                        </div>
                    </div>
                    
                    <div className="max-w-md">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nomor WhatsApp</label>
                        <input 
                            type="text" 
                            value={data.wa_admin} 
                            onChange={e => setData('wa_admin', e.target.value)} 
                            placeholder="Contoh: 6281234567890" 
                            className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 font-medium transition-all"
                        />
                        <p className="text-xs text-slate-400 mt-2 italic">* Awali dengan kode negara (62) tanpa spasi atau tanda (+).</p>
                    </div>
                </div>

                {/* --- KOTAK 2: METODE PEMBAYARAN 1 --- */}
                <div className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all ${data.bank1_active ? 'border-emerald-400 shadow-emerald-500/10' : 'border-slate-100 opacity-70 grayscale-[30%]'}`}>
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CreditCard size={24} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Rekening / E-Wallet Utama</h2>
                                <p className="text-sm text-slate-500">Metode pembayaran pilihan pertama.</p>
                            </div>
                        </div>
                        <label className="flex items-center cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                            <input type="checkbox" checked={data.bank1_active} onChange={e => setData('bank1_active', e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 mr-2 w-4 h-4 cursor-pointer" />
                            <span className={`text-sm font-bold ${data.bank1_active ? 'text-emerald-700' : 'text-slate-500'}`}>{data.bank1_active ? 'AKTIF' : 'NONAKTIF'}</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Bank / E-Wallet</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_name} onChange={e => setData('bank1_name', e.target.value)} placeholder="BCA / DANA / OVO" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white py-3 font-medium transition-all disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nomor Rekening</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_number} onChange={e => setData('bank1_number', e.target.value)} placeholder="1234567890" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white py-3 font-medium transition-all disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Atas Nama (Pemilik)</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_owner} onChange={e => setData('bank1_owner', e.target.value)} placeholder="Ahmad Fulan" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white py-3 font-medium transition-all disabled:opacity-50" />
                        </div>
                    </div>
                </div>

                {/* --- KOTAK 3: METODE PEMBAYARAN 2 --- */}
                <div className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all ${data.bank2_active ? 'border-emerald-400 shadow-emerald-500/10' : 'border-slate-100 opacity-70 grayscale-[30%]'}`}>
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CreditCard size={24} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Rekening / E-Wallet Opsional</h2>
                                <p className="text-sm text-slate-500">Metode pembayaran pilihan kedua (opsional).</p>
                            </div>
                        </div>
                        <label className="flex items-center cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                            <input type="checkbox" checked={data.bank2_active} onChange={e => setData('bank2_active', e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 mr-2 w-4 h-4 cursor-pointer" />
                            <span className={`text-sm font-bold ${data.bank2_active ? 'text-emerald-700' : 'text-slate-500'}`}>{data.bank2_active ? 'AKTIF' : 'NONAKTIF'}</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Bank / E-Wallet</label>
                            <input disabled={!data.bank2_active} type="text" value={data.bank2_name} onChange={e => setData('bank2_name', e.target.value)} placeholder="BCA / DANA / OVO" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white py-3 font-medium transition-all disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nomor Rekening</label>
                            <input disabled={!data.bank2_active} type="text" value={data.bank2_number} onChange={e => setData('bank2_number', e.target.value)} placeholder="1234567890" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white py-3 font-medium transition-all disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Atas Nama (Pemilik)</label>
                            <input disabled={!data.bank2_active} type="text" value={data.bank2_owner} onChange={e => setData('bank2_owner', e.target.value)} placeholder="Ahmad Fulan" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white py-3 font-medium transition-all disabled:opacity-50" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-12">
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        <Save size={20} /> {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>

        </AdminLayout>
    );
}