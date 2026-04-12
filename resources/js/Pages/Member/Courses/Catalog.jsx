import { useState } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, X, CheckCircle2, ChevronRight, Receipt, ShoppingBag, Sparkles, CreditCard, Landmark } from 'lucide-react';

export default function Catalog({ auth, courses }) {
    // Mengambil pengaturan aplikasi dari props global Inertia
    const { app_settings } = usePage().props;

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        bukti_pembayaran: null,
    });

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const openModal = (course) => {
        setSelectedCourse(course);
        setData('course_id', course.id);
        setPreview(null);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        reset();
        setPreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('bukti_pembayaran', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('member.purchase'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <MemberLayout user={auth.user}>
            <Head title="Katalog Kelas" />

            
            <div className="mb-8">
                <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
                    <ShoppingBag size={24} className="text-blue-600" /> Katalog Program Kelas
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm font-semibold">
                    Berinvestasi pada ilmu. Pilih program bimbingan terbaik untuk persiapan ibadah Anda.
                </p>
            </div>

            {courses.length === 0 ? (
                // --- EMPTY STATE ---
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
                        <Sparkles size={40} className="text-blue-300" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-800 relative z-10">Katalog Sedang Kosong</h3>
                    <p className="text-slate-500 mt-2 max-w-md text-sm font-medium relative z-10">
                        Anda mungkin sudah mengikuti semua kelas yang tersedia, atau belum ada program kelas baru yang dibuka. Nantikan update selanjutnya!
                    </p>
                </motion.div>
            ) : (
                // --- GRID KATALOG ---
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {courses.map((course, index) => {
                        const features = Array.isArray(course.fitur) ? course.fitur : 
                                         (typeof course.fitur === 'string' ? JSON.parse(course.fitur || '[]') : []);

                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.1 }}
                                key={course.id} 
                                className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-200 flex flex-col hover:shadow-2xl hover:shadow-blue-950/10 hover:-translate-y-1.5 transition-all duration-500 group"
                            >
                                <div className="relative h-44 rounded-t-[1.25rem] rounded-b-xl overflow-hidden bg-slate-100 group-hover:shadow-inner transition-all">
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><BookOpen size={48} strokeWidth={1} /></div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="px-3 py-1.5 bg-white/95 text-blue-950 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                            Batch {course.batch}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-3 left-4 right-4 z-10">
                                        <h3 className="text-lg font-black text-white leading-snug line-clamp-2 drop-shadow-md group-hover:text-blue-100 transition-colors">
                                            {course.nama}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="mb-5 flex items-end gap-2 border-b border-slate-100 pb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investasi Program</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-black text-blue-950 leading-none tracking-tight">
                                                    {formatRupiah(course.harga)}
                                                </span>
                                                {course.harga_coret > 0 && (
                                                    <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300">
                                                        {formatRupiah(course.harga_coret)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 flex-1">
                                        <p className="text-xs font-bold text-slate-800 mb-3">Yang Anda Dapatkan:</p>
                                        {features.length > 0 ? (
                                            <ul className="space-y-2.5">
                                                {features.slice(0, 4).map((fitur, i) => (
                                                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                                                        <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                                                        <span className="leading-snug">{fitur}</span>
                                                    </li>
                                                ))}
                                                {features.length > 4 && (
                                                    <li className="text-xs font-bold text-slate-400 pl-6 pt-1">
                                                        + {features.length - 4} benefit lainnya
                                                    </li>
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">Detail benefit belum dicantumkan.</p>
                                        )}
                                    </div>
                                    
                                    <button 
                                        onClick={() => openModal(course)} 
                                        className="mt-auto w-full py-3.5 bg-slate-50 text-blue-950 border border-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-950 hover:text-white hover:border-blue-950 transition-all duration-300 hover:shadow-lg hover:shadow-blue-950/20 active:scale-95 group/btn"
                                    >
                                        Daftar Sekarang <ChevronRight size={18} className="text-slate-400 group-hover/btn:text-blue-400 group-hover/btn:translate-x-1 transition-all" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            
            
            
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={closeModal} 
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 max-h-[95vh]"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                                <h2 className="text-lg font-black text-blue-950 flex items-center gap-2">
                                    <CreditCard size={20} className="text-blue-600"/> Checkout Kelas
                                </h2>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                
                                
                                <div className="p-6 bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl relative overflow-hidden shadow-lg shadow-blue-950/20 text-white">
                                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                    
                                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1.5 relative z-10">Total Tagihan Pembayaran</p>
                                    <p className="text-3xl font-black text-white mb-6 relative z-10 tracking-tight drop-shadow-md">
                                        {formatRupiah(selectedCourse.harga)}
                                    </p>
                                    
                                    
                                    <div className="space-y-3 relative z-10">
                                        <p className="text-xs font-bold text-blue-200">Silakan transfer ke rekening berikut:</p>
                                        
                                        
                                        {app_settings?.bank1_active === 'true' && (
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-3.5 hover:bg-white/15 transition-colors">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white shrink-0">
                                                    <Landmark size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">{app_settings.bank1_name}</p>
                                                    <p className="text-lg font-black text-white font-mono tracking-widest mt-0.5">{app_settings.bank1_number}</p>
                                                    <p className="text-[11px] font-medium text-blue-100 truncate mt-0.5">a.n. {app_settings.bank1_owner}</p>
                                                </div>
                                            </div>
                                        )}

                                        
                                        {app_settings?.bank2_active === 'true' && (
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-3.5 hover:bg-white/15 transition-colors">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white shrink-0">
                                                    <Landmark size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">{app_settings.bank2_name}</p>
                                                    <p className="text-lg font-black text-white font-mono tracking-widest mt-0.5">{app_settings.bank2_number}</p>
                                                    <p className="text-[11px] font-medium text-blue-100 truncate mt-0.5">a.n. {app_settings.bank2_owner}</p>
                                                </div>
                                            </div>
                                        )}

                                        
                                        {(!app_settings?.bank1_active || app_settings?.bank1_active !== 'true') && (!app_settings?.bank2_active || app_settings?.bank2_active !== 'true') && (
                                            <div className="bg-rose-500/20 backdrop-blur-md p-3 rounded-xl border border-rose-500/30">
                                                <p className="text-xs text-rose-200 font-bold text-center">Metode pembayaran belum dikonfigurasi oleh Admin.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                
                                <div>
                                    <label className="text-sm font-black text-slate-700 mb-2.5 flex items-center gap-2">
                                        <Receipt size={16} className="text-blue-600"/> Upload Bukti Transfer
                                    </label>
                                    <div className="relative w-full h-40 rounded-[1.25rem] border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all duration-300">
                                        {preview ? (
                                            <>
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-bold text-slate-800 shadow-sm">Ganti Foto</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-4 transform group-hover:-translate-y-1 transition-transform">
                                                <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                                                    <Upload size={18} strokeWidth={2.5} />
                                                </div>
                                                <p className="text-sm text-slate-500 font-bold">Pilih foto struk</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">JPG, PNG (Max 2MB)</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                    </div>
                                    {errors.bukti_pembayaran && <p className="text-rose-500 text-xs font-bold mt-2">{errors.bukti_pembayaran}</p>}
                                </div>

                                
                                <button 
                                    type="submit" 
                                    disabled={processing || !data.bukti_pembayaran} 
                                    className="w-full py-4 bg-blue-950 text-white rounded-xl font-black hover:bg-blue-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-blue-950/20 active:scale-95"
                                >
                                    {processing ? 'Mengunggah Bukti...' : 'Kirim Bukti Pembayaran'} <CheckCircle2 size={18} className={processing ? 'animate-pulse' : ''} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MemberLayout>
    );
}