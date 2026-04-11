import { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Lock, MapPin, Briefcase, Heart, UserPlus, 
    ArrowLeft, Upload, CheckSquare, Receipt, CalendarDays, BookOpen, Sparkles, Phone
} from 'lucide-react';

export default function Register({ courses }) {
    const { app_settings = {} } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', alamat: '', pekerjaan: '', umur: '', status: '',
        password: '', password_confirmation: '',
        course_ids: [], 
        bukti_pembayaran: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('bukti_pembayaran', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const toggleCourse = (id) => {
        let newCourseIds = [...data.course_ids];
        if (newCourseIds.includes(id)) {
            newCourseIds = newCourseIds.filter(courseId => courseId !== id);
        } else {
            newCourseIds.push(id);
        }
        setData('course_ids', newCourseIds);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { forceFormData: true, preserveScroll: true }); 
    };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const selectedCourses = courses.filter(c => data.course_ids.includes(c.id));
    const totalPrice = selectedCourses.reduce((sum, course) => sum + course.harga, 0);

    return (
        // OPTIMASI: Background menggunakan gradasi murni tanpa efek multiply atau blur
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <Head title="Pendaftaran Kelas - MiqotHub" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Tombol Kembali Di Atas Kiri (Tanpa Backdrop Blur) */}
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-10 font-bold text-sm bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200">
                    <ArrowLeft size={18} /> Kembali ke Beranda
                </Link>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} 
                    className="w-full bg-white rounded-[2.5rem] shadow-xl shadow-indigo-900/5 border border-slate-100 flex flex-col md:flex-row overflow-visible"
                >
                    {/* --- KOLOM KIRI (Pilihan Kelas) - 100% Solid Colors --- */}
                    <div className="w-full md:w-[42%] bg-indigo-950 p-8 sm:p-10 lg:p-12 text-white flex flex-col relative shrink-0 md:rounded-l-[2.5rem] rounded-t-[2.5rem] md:rounded-tr-none">
                        
                        <div className="mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-900 mb-5 border border-indigo-800 text-indigo-300 shadow-inner">
                                <BookOpen size={24} strokeWidth={2.5}/>
                            </div>
                            <h2 className="text-3xl font-black mb-3 text-white leading-tight">Pilih Program &<br/>Metode Bayar</h2>
                            <p className="text-indigo-200/80 text-base font-medium">Tentukan kelas yang ingin diikuti, lalu lakukan pembayaran sesuai instruksi di bawah.</p>
                        </div>

                        {/* Daftar Kelas */}
                        <div className="space-y-4 mb-12">
                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-4">Kelas Tersedia ({courses.length})</h3>
                            {courses.length === 0 ? (
                                <div className="p-6 bg-indigo-900 rounded-2xl border border-indigo-800 text-center">
                                    <p className="text-sm font-medium text-indigo-200">Mohon maaf, saat ini belum ada kelas yang dibuka.</p>
                                </div>
                            ) : (
                                courses.map(course => (
                                    <div 
                                        key={course.id} 
                                        onClick={() => toggleCourse(course.id)}
                                        // OPTIMASI: Menghapus shadow glow dan mengganti bg dengan warna solid
                                        className={`p-6 rounded-2xl cursor-pointer border-2 transition-colors duration-200 group ${data.course_ids.includes(course.id) ? 'bg-indigo-900 border-indigo-400' : 'bg-indigo-900/30 border-indigo-900 hover:border-indigo-700 hover:bg-indigo-900/60'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3 gap-3">
                                            <h3 className="font-bold text-lg leading-tight flex-1 text-white group-hover:text-indigo-200 transition-colors">{course.nama}</h3>
                                            <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors mt-0.5 ${data.course_ids.includes(course.id) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-indigo-700 text-transparent'}`}>
                                                <CheckSquare size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-indigo-800">
                                            <span className="px-3 py-1.5 rounded-lg bg-indigo-950 text-[11px] font-black text-indigo-300 uppercase tracking-widest">Batch {course.batch}</span>
                                            <div className="font-black text-xl text-white">{formatRupiah(course.harga)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {errors.course_ids && <p className="text-rose-400 text-xs font-bold mt-2">{errors.course_ids}</p>}
                        </div>

                        {/* Area Pembayaran */}
                        {data.course_ids.length > 0 && (
                            <div className="shrink-0 space-y-6 pt-10 mt-10 border-t border-indigo-800/50">
                                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300">Instruksi Pembayaran</h3>
                                
                                <div className="p-6 rounded-3xl bg-white text-slate-900 border border-slate-100 flex justify-between items-center shadow-lg">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Total {selectedCourses.length} Program</p>
                                        <p className="text-3xl font-black text-indigo-600 leading-none">{formatRupiah(totalPrice)}</p>
                                    </div>
                                    <Sparkles className="text-amber-400" size={32} />
                                </div>

                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-indigo-200">Silakan transfer ke salah satu rekening aktif kami:</p>
                                    
                                    {app_settings.bank1_active === 'true' && (
                                        <div className="p-5 rounded-2xl bg-indigo-900 border border-indigo-800 flex items-center gap-4">
                                            <div className="p-3 bg-indigo-950 rounded-xl text-indigo-300"><Receipt size={20}/></div>
                                            <div>
                                                <p className="text-xs font-black text-indigo-300 uppercase tracking-widest">{app_settings.bank1_name}</p>
                                                <p className="text-lg font-black text-white tracking-wider">{app_settings.bank1_number}</p>
                                                <p className="text-xs font-medium text-indigo-200">a.n. {app_settings.bank1_owner}</p>
                                            </div>
                                        </div>
                                    )}

                                    {app_settings.bank2_active === 'true' && (
                                        <div className="p-5 rounded-2xl bg-indigo-900 border border-indigo-800 flex items-center gap-4">
                                            <div className="p-3 bg-indigo-950 rounded-xl text-purple-300"><Receipt size={20}/></div>
                                            <div>
                                                <p className="text-xs font-black text-purple-300 uppercase tracking-widest">{app_settings.bank2_name}</p>
                                                <p className="text-lg font-black text-white tracking-wider">{app_settings.bank2_number}</p>
                                                <p className="text-xs font-medium text-indigo-200">a.n. {app_settings.bank2_owner}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2"><Upload size={16} className="text-emerald-400"/> Unggah Bukti Transfer (Wajib)</label>
                                    <div className="relative w-full h-32 rounded-2xl border-2 border-dashed border-indigo-700 bg-indigo-900/50 flex flex-col items-center justify-center overflow-hidden group hover:border-indigo-400 transition-colors cursor-pointer">
                                        {preview ? (
                                            <img src={preview} alt="Preview Bukti" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="mx-auto text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" size={28} />
                                                <p className="text-xs font-medium text-indigo-300">Klik untuk pilih foto struk (Max 2MB)</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                    </div>
                                    {errors.bukti_pembayaran && <p className="text-rose-400 text-xs font-bold mt-2">{errors.bukti_pembayaran}</p>}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-auto pt-10 text-center">
                            <p className="text-sm font-medium text-indigo-300 mb-3">Butuh bantuan pendaftaran?</p>
                            <a href={`https://wa.me/${app_settings.wa_admin || ''}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-900 hover:bg-emerald-600 rounded-full text-white font-bold text-sm transition-colors border border-indigo-800 hover:border-emerald-500">
                                <Phone size={16}/> Chat Admin (WhatsApp)
                            </a>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (Form Data Diri) --- */}
                    <div className="w-full md:w-[58%] p-8 sm:p-12 lg:p-16 flex flex-col bg-white overflow-visible">
                        <div className="mb-12 shrink-0">
                            <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Lengkapi<br/>Identitas Diri</h3>
                            <p className="text-slate-500 text-base font-medium">Data ini digunakan untuk keperluan administrasi kelas dan pencetakan e-sertifikat resmi Anda.</p>
                        </div>

                        {/* OPTIMASI PENTING: form tanpa transisi yang tidak perlu pada saat mengetik */}
                        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nama Lengkap (Sesuai KTP)</label>
                                <div className="relative">
                                    <User size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="Contoh: Ahmad Fulan" required />
                                </div>
                                {errors.name && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Aktif</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="email@anda.com" required />
                                </div>
                                {errors.email && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.email}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Alamat Domisili Lengkap</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                    <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="3" className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="Nama Jalan, No. Rumah, RT/RW, Kota/Kabupaten..." required></textarea>
                                </div>
                                {errors.alamat && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.alamat}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pekerjaan</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="Cth: Karyawan Swasta" required />
                                </div>
                                {errors.pekerjaan && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.pekerjaan}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Umur</label>
                                    <div className="relative">
                                        <CalendarDays size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                        <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="25" required />
                                    </div>
                                    {errors.umur && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.umur}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status Kawin</label>
                                    <div className="relative">
                                        <Heart size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-bold appearance-none cursor-pointer shadow-sm" required>
                                            <option value="" disabled>Pilih...</option>
                                            <option value="menikah">Menikah</option>
                                            <option value="belum">Belum</option>
                                        </select>
                                    </div>
                                    {errors.status && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="sm:col-span-2 border-t border-slate-100 my-4"></div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password Akun</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="Minimal 8 karakter" required />
                                </div>
                                {errors.password && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Konfirmasi Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute top-[14px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 py-3.5 text-sm font-medium shadow-sm" placeholder="Ketik ulang password" required />
                                </div>
                            </div>

                            <div className="sm:col-span-2 mt-8 pt-8 border-t border-slate-100">
                                <button 
                                    disabled={processing || data.course_ids.length === 0 || !data.bukti_pembayaran} 
                                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {processing ? (
                                        <> <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim Pendaftaran... </>
                                    ) : (
                                        <>Daftar & Kirim Pembayaran <UserPlus size={20} /></>
                                    )}
                                </button>
                                <p className="text-center text-sm font-medium text-slate-500 mt-6">
                                    Sudah punya akun?{' '}
                                    <Link href={route('login')} className="font-black text-indigo-600 hover:text-indigo-500 transition-colors underline decoration-indigo-200 underline-offset-4">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}