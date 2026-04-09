import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, Clock, ChevronRight, GraduationCap, Sparkles, Compass } from 'lucide-react';

export default function Dashboard({ auth, myCourses = [] }) {
    
    // Variasi animasi untuk grid container
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    // Variasi animasi untuk setiap item/card
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <MemberLayout user={auth.user}>
            <Head title="Kelas Saya | Ruang Belajar" />

            {/* WELCOME BANNER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-emerald-500/20 mb-10 relative overflow-hidden"
            >
                {/* Ornamen Background */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">
                    <Sparkles size={200} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="text-emerald-100" size={28} />
                        <span className="text-emerald-100 font-bold uppercase tracking-wider text-sm">Dashboard Pembelajaran</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Ahlan wa Sahlan, {auth.user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-emerald-50 max-w-xl leading-relaxed">
                        Siapkan dirimu untuk perjalanan spiritual dan keilmuan yang luar biasa. Lanjutkan pembelajaranmu atau jelajahi materi baru hari ini.
                    </p>
                </div>
            </motion.div>

            {/* HEADER SECTON */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Kelas Saya</h2>
                    <p className="text-gray-500 text-sm mt-1">Daftar kelas yang sudah Anda ikuti.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-emerald-600 flex items-center gap-2">
                    <BookOpen size={18} />
                    {myCourses.length} Kelas Aktif
                </div>
            </div>

            {/* DAFTAR KELAS (GRID) */}
            {myCourses.length === 0 ? (
                // EMPTY STATE JIKA BELUM ADA KELAS
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Compass size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Kelas</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Sepertinya Anda belum memiliki kelas aktif atau transaksi Anda sedang dalam proses verifikasi oleh Admin.
                    </p>
                    <Link 
                        href="/" // Sesuaikan dengan route halaman katalog utama (katalog publik)
                        className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2"
                    >
                        Eksplorasi Katalog Kelas <ChevronRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                // GRID KELAS AKTIF
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {myCourses.map((course) => (
                        <motion.div 
                            key={course.id} 
                            variants={itemVariants}
                            className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                {course.thumbnail_url ? (
                                    <img 
                                        src={course.thumbnail_url} 
                                        alt={course.nama} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                                        <BookOpen size={40} className="text-emerald-200" />
                                    </div>
                                )}
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <PlayCircle size={18} /> Mulai Belajar
                                    </div>
                                </div>

                                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-800 shadow-sm">
                                    Batch {course.batch}
                                </div>
                            </div>

                            {/* Detail Kelas */}
                            <div className="px-3 pb-2 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-3 group-hover:text-emerald-600 transition-colors">
                                    {course.nama}
                                </h3>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-6 mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-emerald-500" /> Aktif
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen size={16} className="text-blue-500" /> Modul Tersedia
                                    </div>
                                </div>

                                {/* Tombol Masuk Kelas */}
                                {/* Catatan: Ganti href di bawah ini dengan route yang mengarah ke ruang belajar/materi */}
                                <Link 
                                    href="#" 
                                    className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                                >
                                    Akses Ruang Belajar <ChevronRight size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </MemberLayout>
    );
}