import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 selection:bg-emerald-500 selection:text-white font-sans">
            <Head title="Masuk - HajiCourse" />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Kembali ke Beranda</span>
            </Link>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
                {/* Bagian Kiri - Branding (Disembunyikan di layar kecil) */}
                <div className="hidden md:flex md:w-5/12 bg-emerald-600 relative flex-col justify-between overflow-hidden">
                    <img src="assets/images/bg-login.jpg" className='absolute bg-cover w-full h-full' alt="" />
                    {/* Efek Background */}

                    <div className='md:flex h-full w-full p-12 relative flex-col justify-between overflow-hidden'>
                        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-emerald-500 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-teal-400 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                                Selamat Datang <br/> Kembali!
                            </h2>
                            <p className="text-emerald-100 text-lg">
                                Masuk untuk melanjutkan proses pelatihan dan evaluasi petugas haji Anda.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                                <p className="italic font-medium text-emerald-50">
                                    "Melayani tamu Allah adalah sebuah kehormatan dan tanggung jawab yang besar."
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* Bagian Kanan - Form Login */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white relative">
                    <motion.div variants={itemVariants} className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun</h3>
                        <p className="text-gray-500">Silakan masukkan email dan kata sandi Anda.</p>
                    </motion.div>

                    {status && (
                        <motion.div variants={itemVariants} className="mb-6 font-medium text-sm text-green-600 bg-green-50 p-4 rounded-xl">
                            {status}
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Input Email */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`pl-11 w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'} bg-gray-50 focus:bg-white transition-all py-3 px-4 shadow-sm`}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>}
                        </motion.div>

                        {/* Input Password */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`pl-11 w-full rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'} bg-gray-50 focus:bg-white transition-all py-3 px-4 shadow-sm`}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-2 font-medium">{errors.password}</p>}
                        </motion.div>

                        {/* Remember Me & Lupa Password */}
                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-gray-600">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </motion.div>

                        {/* Tombol Submit */}
                        <motion.div variants={itemVariants} className="pt-2">
                            <button
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                {processing ? 'Memproses...' : 'Masuk Sekarang'}
                                {!processing && <LogIn size={20} />}
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center mt-8">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                                    Daftar sebagai Member
                                </Link>
                            </p>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}