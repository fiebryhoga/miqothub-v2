import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Sparkles, PlayCircle, Clock, ChevronRight, Compass } from 'lucide-react';

export default function Dashboard({ auth, stats = {}, recentCourses = [] }) {
    // Fallback data statistik jika dari backend belum dikirim
    const userStats = {
        kelas_aktif: stats.kelas_aktif || 0,
        kuis_selesai: stats.kuis_selesai || 0,
        sertifikat: stats.sertifikat || 0,
    };

    return (
        <MemberLayout user={auth.user}>
            <Head title="Dashboard Member" />

            {/* ======================================= */}
            {/* HERO SECTION: AHLAN WA SAHLAN */}
            {/* ======================================= */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-blue-950/20 relative overflow-hidden mb-10"
            >
                {/* Aksen Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6">
                            <Sparkles size={14} className="text-blue-300" /> Ruang Belajar Utama
                        </div>
                        
                        {/* Kaligrafi / Teks Arab Elegan */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-arabic mb-2 drop-shadow-lg" dir="rtl">
                            أَهْلًا وَسَهْلًا
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                            Ahlan wa Sahlan, {auth.user.name.split(' ')[0]}!
                        </h2>
                        
                        <p className="text-blue-200 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
                            Semoga Allah memberikan kemudahan dalam setiap langkah belajarmu. Lanjutkan progres materi hari ini dan persiapkan dirimu dengan sebaik-baiknya.
                        </p>
                    </div>

                    {/* Quick Info Box di Kanan Hero */}
                    <div className="hidden lg:flex flex-col gap-3 shrink-0 w-64">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-300">
                                <Clock size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Waktu Saat Ini</p>
                                <p className="text-lg font-black text-white tracking-wider">
                                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ======================================= */}
            {/* WIDGET STATISTIK */}
            {/* ======================================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <BookOpen size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-blue-950 leading-none mb-1">{userStats.kelas_aktif}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kelas Diikuti</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <PlayCircle size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-800 leading-none mb-1">{userStats.kuis_selesai}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kuis Diselesaikan</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <Trophy size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-800 leading-none mb-1">{userStats.sertifikat}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sertifikat Diraih</p>
                    </div>
                </motion.div>
            </div>

            {/* ======================================= */}
            {/* AREA KELAS TERAKHIR / LANJUTKAN BELAJAR */}
            {/* ======================================= */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-blue-950 tracking-tight">Lanjutkan Belajarmu</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Akses cepat ke kelas yang sedang kamu ikuti.</p>
                </div>
                <Link 
                    href={route('member.courses.index')}
                    className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
                >
                    Lihat Semua Kelas <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {recentCourses.length === 0 ? (
                // Empty State Jika Belum Punya Kelas
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 text-center flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                        <Compass size={36} className="text-slate-300" />
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-2">Belum Ada Kelas Aktif</h4>
                    <p className="text-slate-500 font-medium mb-6 max-w-sm">Kamu belum terdaftar di kelas manapun. Yuk, cari program yang sesuai untukmu!</p>
                    <Link 
                        href={route('member.catalog')}
                        className="px-6 py-3 bg-blue-950 text-white font-bold rounded-xl hover:bg-blue-900 shadow-lg shadow-blue-950/20 transition-all active:scale-95"
                    >
                        Eksplorasi Katalog
                    </Link>
                </motion.div>
            ) : (
                // Grid Kelas Terakhir
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentCourses.map((course, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + (index * 0.1) }}
                            key={course.id}
                            className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl hover:shadow-blue-950/10 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="h-40 bg-slate-100 rounded-[1.25rem] relative overflow-hidden mb-4">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={40} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                            </div>

                            <div className="px-2 pb-2 flex-1 flex flex-col">
                                <h4 className="text-base font-black text-slate-800 leading-snug mb-4 line-clamp-2 group-hover:text-blue-900 transition-colors">
                                    {course.nama}
                                </h4>
                                
                                <Link 
                                    href={route('member.courses.show', course.id)} 
                                    className="mt-auto w-full py-2.5 bg-slate-50 text-blue-950 border border-slate-200 rounded-xl text-sm font-bold hover:bg-blue-950 hover:text-white hover:border-blue-950 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group/btn"
                                >
                                    <PlayCircle size={18} className="text-slate-400 group-hover/btn:text-white transition-colors" /> Lanjutkan
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </MemberLayout>
    );
}