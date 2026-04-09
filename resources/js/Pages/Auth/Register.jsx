import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, MapPin, Briefcase, Heart, UserPlus, ArrowLeft, Upload, CheckSquare, Receipt, CalendarDays } from 'lucide-react';

export default function Register({ courses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', alamat: '', pekerjaan: '', umur: '', status: '',
        password: '', password_confirmation: '',
        course_ids: [], // Diubah menjadi Array untuk multi-select
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

    // Fungsi Toggle untuk memilih banyak kelas
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
        post(route('register'), { forceFormData: true }); 
    };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // Kalkulasi Total Harga Kelas yang Dipilih
    const selectedCourses = courses.filter(c => data.course_ids.includes(c.id));
    const totalPrice = selectedCourses.reduce((sum, course) => sum + course.harga, 0);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans selection:bg-emerald-500 selection:text-white relative">
            <Head title="Pendaftaran Kelas - HajiCourse" />

            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors z-20 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <ArrowLeft size={18} /> <span className="hidden sm:block">Kembali ke Beranda</span>
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
                
                {/* KOLOM KIRI - Pilihan Kelas & Upload */}
                <div className="w-full md:w-5/12 bg-slate-900 p-8 text-white flex flex-col relative overflow-hidden shrink-0">
                    <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-emerald-500 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
                    
                    <div className="relative z-10 mb-6">
                        <h2 className="text-3xl font-extrabold mb-2">Pilih Program</h2>
                        <p className="text-gray-400 text-sm">Anda dapat memilih lebih dari satu kelas pelatihan.</p>
                    </div>

                    {/* Daftar Kelas (Scrollable) */}
                    <div className="relative z-10 space-y-3 flex-1 overflow-y-auto scrollbar-thin pr-2">
                        {courses.length === 0 ? (
                            <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-center">
                                <p className="text-sm text-gray-300">Mohon maaf, saat ini belum ada kelas yang dibuka.</p>
                            </div>
                        ) : (
                            courses.map(course => (
                                <div 
                                    key={course.id} 
                                    onClick={() => toggleCourse(course.id)}
                                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${data.course_ids.includes(course.id) ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className="font-bold text-base leading-tight flex-1">{course.nama}</h3>
                                        {/* Checkbox Icon */}
                                        <div className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors mt-0.5 ${data.course_ids.includes(course.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500 text-transparent'}`}>
                                            <CheckSquare size={14} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">Batch {course.batch}</p>
                                    <div className="font-bold text-emerald-300">{formatRupiah(course.harga)}</div>
                                </div>
                            ))
                        )}
                        {errors.course_ids && <p className="text-red-400 text-sm mt-2">{errors.course_ids}</p>}
                    </div>

                    {/* Upload Area (Muncul Dinamis) */}
                    {data.course_ids.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-5 mt-5 border-t border-white/10 relative z-10 shrink-0">
                            <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><Receipt size={16} className="text-emerald-400"/> Upload Bukti Transfer</label>
                            <div className="relative w-full h-28 rounded-xl border-2 border-dashed border-gray-600 bg-black/20 flex flex-col items-center justify-center overflow-hidden group hover:border-emerald-400 transition-colors cursor-pointer">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="text-center p-4">
                                        <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-emerald-400 transition-colors" size={24} />
                                        <p className="text-xs text-gray-400">Klik untuk pilih foto struk</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                            </div>
                            {errors.bukti_pembayaran && <p className="text-red-400 text-xs mt-1">{errors.bukti_pembayaran}</p>}
                            
                            {/* Kotak Info Total Harga */}
                            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-emerald-200 mb-0.5">Total {selectedCourses.length} Kelas</p>
                                    <p className="text-xl font-bold text-white leading-none">{formatRupiah(totalPrice)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Transfer Ke BCA</p>
                                    <p className="text-sm font-bold text-white">1234 567 890</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* KOLOM KANAN - Form Data Diri */}
                <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col bg-white overflow-y-auto scrollbar-thin">
                    <div className="mb-8 shrink-0">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Diri Peserta</h3>
                        <p className="text-gray-500 text-sm">Lengkapi identitas Anda untuk database & e-sertifikat.</p>
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Sesuai KTP</label>
                            <div className="relative">
                                <User size={18} className="absolute top-3 left-3 text-gray-400" />
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="Cth: Ahmad Fulan" required />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Aktif</label>
                            <div className="relative">
                                <Mail size={18} className="absolute top-3 left-3 text-gray-400" />
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="email@anda.com" required />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alamat Domisili Lengkap</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute top-3 left-3 text-gray-400" />
                                <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="Nama Jalan, RT/RW, Kecamatan..." required></textarea>
                            </div>
                            {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pekerjaan</label>
                            <div className="relative">
                                <Briefcase size={18} className="absolute top-3 left-3 text-gray-400" />
                                <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="Cth: Guru / PNS" required />
                            </div>
                            {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Umur</label>
                                <div className="relative">
                                    <CalendarDays size={18} className="absolute top-3 left-3 text-gray-400" />
                                    <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="25" required />
                                </div>
                                {errors.umur && <p className="text-red-500 text-xs mt-1">{errors.umur}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status Kawin</label>
                                <div className="relative">
                                    <Heart size={18} className="absolute top-3 left-3 text-gray-400" />
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm appearance-none cursor-pointer transition-colors" required>
                                        <option value="" disabled>Pilih...</option>
                                        <option value="menikah">Menikah</option>
                                        <option value="belum">Belum</option>
                                    </select>
                                </div>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-2 border-t border-gray-100 my-2"></div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password Akun</label>
                            <div className="relative">
                                <Lock size={18} className="absolute top-3 left-3 text-gray-400" />
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="Minimal 8 karakter" required />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute top-3 left-3 text-gray-400" />
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm transition-colors" placeholder="Ketik ulang password" required />
                            </div>
                        </div>

                        <div className="sm:col-span-2 mt-6 pt-6 border-t border-gray-100">
                            <button disabled={processing || data.course_ids.length === 0 || !data.bukti_pembayaran} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                                {processing ? (
                                    <> <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                                ) : (
                                    <>Kirim Pendaftaran & Pembayaran <UserPlus size={18} /></>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Sudah punya akun? <Link href={route('login')} className="font-bold text-emerald-600 hover:underline">Login di sini</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}