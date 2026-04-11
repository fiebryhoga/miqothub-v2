import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    // Konfigurasi Animasi
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4 sm:p-6 selection:bg-indigo-500 selection:text-white font-sans relative overflow-hidden">
            <Head title="Masuk - MiqotHub" />

            {/* Background Ornamen Ringan */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>

            {/* Tombol Kembali Floating */}
            <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors z-20 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <ArrowLeft size={18} />
                <span className="font-bold text-sm">Kembali</span>
            </Link>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/10 overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-100"
            >
                {/* --- BAGIAN KIRI (Branding & Gambar) --- */}
                <div className="hidden md:flex md:w-5/12 bg-indigo-900 relative flex-col justify-between overflow-hidden">
                    {/* Gambar Background dengan Efek Overlay Gelap/Ungu */}
                    <img src="assets/images/bg-login.jpg" className='absolute object-cover w-full h-full opacity-40 mix-blend-overlay' alt="Background Login" />
                    
                    {/* Gradien tambahan agar teks mudah dibaca */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/80 to-transparent"></div>

                    <div className='md:flex h-full w-full p-12 relative flex-col justify-between overflow-hidden z-10'>
                        {/* Logo Minimalis */}
                        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-lg">
                                <BookOpen size={18} strokeWidth={3} />
                            </div>
                            MiqotHub.
                        </div>
                        
                        <div className="relative mt-auto mb-8">
                            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                                Selamat Datang <br/> Kembali!
                            </h2>
                            <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                                Masuk untuk melanjutkan proses belajar, akses modul terbaru, dan tingkatkan kapasitas keilmuan Anda.
                            </p>
                        </div>

                        {/* Quote Box Glassmorphism */}
                        <div className="relative">
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white shadow-xl">
                                <div className="flex items-center gap-2 mb-2 text-purple-300">
                                    <Sparkles size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Inspirasi</span>
                                </div>
                                <p className="italic font-medium text-indigo-50 leading-relaxed">
                                    "Pendidikan adalah senjata paling ampuh yang bisa Anda gunakan untuk mengubah dunia."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN KANAN (Form Login) --- */}
                <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <motion.div variants={itemVariants} className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Masuk ke Akun</h3>
                        <p className="text-slate-500 font-medium">Silakan masukkan email dan kata sandi Anda.</p>
                    </motion.div>

                    {status && (
                        <motion.div variants={itemVariants} className="mb-6 font-bold text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 size={20} /> {status}
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Input Email */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`pl-12 w-full rounded-2xl border ${errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'} bg-slate-50 focus:bg-white transition-all py-3.5 px-4 shadow-sm text-sm font-medium`}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.email}</p>}
                        </motion.div>

                        {/* Input Password */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`pl-12 w-full rounded-2xl border ${errors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'} bg-slate-50 focus:bg-white transition-all py-3.5 px-4 shadow-sm text-sm font-medium`}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.password}</p>}
                        </motion.div>

                        {/* Remember Me & Lupa Password */}
                        <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-md border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-4 h-4 cursor-pointer transition-colors"
                                />
                                <span className="ml-2 text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-400 transition-colors"
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </motion.div>

                        {/* Tombol Submit (Warna Tema Baru) */}
                        <motion.div variants={itemVariants} className="pt-4">
                            <button
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 px-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk Sekarang'}
                                {!processing && <LogIn size={20} />}
                            </button>
                        </motion.div>

                        {/* Link Daftar */}
                        <motion.div variants={itemVariants} className="text-center mt-8">
                            <p className="text-sm font-medium text-slate-500">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="font-black text-indigo-600 hover:text-indigo-500 transition-colors underline decoration-indigo-200 underline-offset-4">
                                    Daftar Gratis
                                </Link>
                            </p>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}