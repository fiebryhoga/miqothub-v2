import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, MessageSquareShare, Award } from 'lucide-react';

export default function Welcome({ auth }) {
    // Varian animasi untuk efek beruntun (stagger)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="Selamat Datang - Kursus Petugas Haji" />

            {/* Navbar */}
            <nav className="absolute top-0 w-full p-6 z-10 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.8 }}
                    className="text-2xl font-bold tracking-tighter text-emerald-700"
                >
                    Haji<span className="text-gray-900">Course.</span>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.8 }}
                    className="flex gap-4"
                >
                    {auth.user ? (
                        <Link href={route('dashboard')} className="font-medium text-gray-600 hover:text-emerald-600 transition">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="font-medium px-5 py-2 text-gray-600 hover:text-emerald-600 transition">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="font-medium px-5 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 hover:shadow-lg transition-all duration-300">
                                Daftar Sekarang
                            </Link>
                        </>
                    )}
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden">
                {/* Background Blob untuk estetika modern */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-60 z-0"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-50 rounded-full blur-3xl opacity-60 z-0"></div>

                <motion.div 
                    className="z-10 text-center max-w-4xl mt-20"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-4 inline-block">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide">
                            Platform Pelatihan Resmi
                        </span>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            Persiapkan Diri Menjadi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                Petugas Haji Terbaik
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Akses materi komprehensif, simulasi lapangan, dan evaluasi berkala. Bergabunglah dengan ribuan petugas lainnya dalam melayani tamu Allah.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href={route('register')} className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-300 shadow-xl">
                            Mulai Pelatihan
                        </Link>
                        <a href="#fitur" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold text-lg hover:border-gray-400 transition-all duration-300">
                            Pelajari Fitur
                        </a>
                    </motion.div>
                </motion.div>
            </main>

            {/* Features Section */}
            <section id="fitur" className="py-24 bg-gray-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Kenapa Memilih Platform Kami?</h2>
                        <p className="text-gray-500">Sistem terintegrasi yang dirancang khusus untuk efisiensi pelatihan.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Materi Terstruktur</h3>
                            <p className="text-gray-500 leading-relaxed">Modul pembelajaran yang selalu diperbarui sesuai kebijakan penyelenggaraan haji terbaru.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Ujian Kompetensi</h3>
                            <p className="text-gray-500 leading-relaxed">Sistem CBT (Computer Based Test) untuk mengukur kesiapan dan pemahaman petugas.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <MessageSquareShare size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Notifikasi Real-time</h3>
                            <p className="text-gray-500 leading-relaxed">Terintegrasi dengan WhatsApp Gateway untuk pengingat jadwal ujian dan update materi penting langsung ke ponsel Anda.</p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Sertifikasi</h3>
                            <p className="text-gray-500 leading-relaxed">Dapatkan e-sertifikat resmi setelah menyelesaikan seluruh rangkaian pelatihan dan ujian.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}