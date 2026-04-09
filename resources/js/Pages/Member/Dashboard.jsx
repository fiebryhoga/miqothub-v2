import MemberLayout from '@/Layouts/MemberLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, MessageCircle, Calendar, PlayCircle, Award, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard({ auth, myCourses }) {
    return (
        <MemberLayout user={auth.user}>
            <Head title="Beranda Member" />

            {/* HERO SECTION - Sambutan Interaktif */}
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 sm:p-12 text-white mb-8 relative overflow-hidden shadow-2xl shadow-slate-900/20 flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Efek Dekorasi */}
                <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest mb-6">
                        <CheckCircle2 size={14} /> Akun Terverifikasi
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
                        Siap belajar hari ini, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{auth.user.name.split(' ')[0]}?</span>
                    </h1>
                    <p className="text-slate-300 text-lg sm:text-xl font-medium leading-relaxed">
                        Lanjutkan progres belajar Anda dan persiapkan diri menjadi pelayan tamu Allah yang profesional dan amanah.
                    </p>
                </div>

                {/* Ringkasan Progres Utama (Statik untuk UI saat ini) */}
                {myCourses.length > 0 && (
                    <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-full md:w-80 shrink-0">
                        <p className="text-sm font-semibold text-emerald-300 mb-2">Terakhir Dipelajari</p>
                        <h3 className="font-bold text-lg mb-4 line-clamp-2 leading-tight">{myCourses[0].nama}</h3>
                        
                        <div className="mb-2 flex justify-between items-end">
                            <span className="text-3xl font-extrabold">45<span className="text-lg text-slate-400">%</span></span>
                            <span className="text-xs text-slate-400 font-medium">12/26 Materi</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2.5 mb-6 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1, delay: 0.5 }} className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2.5 rounded-full"></motion.div>
                        </div>

                        <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/30">
                            <PlayCircle size={20} /> Lanjutkan Materi
                        </button>
                    </div>
                )}
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><BookOpen size={28} /></div>
                    <div><p className="text-sm font-bold text-gray-400 uppercase">Kelas Aktif</p><p className="text-3xl font-extrabold text-gray-900">{myCourses.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><TrendingUp size={28} /></div>
                    <div><p className="text-sm font-bold text-gray-400 uppercase">Tugas Selesai</p><p className="text-3xl font-extrabold text-gray-900">0</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><Award size={28} /></div>
                    <div><p className="text-sm font-bold text-gray-400 uppercase">Sertifikat</p><p className="text-3xl font-extrabold text-gray-900">0</p></div>
                </div>
            </div>

            {/* KELAS SAYA GRID */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Program Kelas Saya</h2>
                <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Lihat Semua</button>
            </div>

            {myCourses.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-dashed border-gray-300 p-16 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-5"><BookOpen size={40} className="text-gray-300" /></div>
                    <h3 className="text-xl font-bold text-gray-900">Belum Ada Kelas Aktif</h3>
                    <p className="text-gray-500 mb-8 mt-2 max-w-md">Anda belum memiliki kelas yang aktif. Jika Anda baru saja mendaftar, mohon tunggu Admin memverifikasi pembayaran Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {myCourses.map((course, index) => (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={course.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            
                            {/* Thumbnail Image */}
                            <div className="h-52 bg-gray-100 relative overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300"><BookOpen size={48} /></div>
                                )}
                                
                                {/* Overlay Gradient for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="px-3 py-1 text-[10px] font-bold bg-white/20 text-white backdrop-blur-md rounded-md uppercase tracking-wider mb-2 inline-block">Batch {course.batch}</span>
                                    <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">{course.nama}</h3>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col bg-white z-10 relative">
                                {/* Progress Bar Mini */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-500">Progress Belajar</span>
                                        <span className="text-xs font-extrabold text-emerald-600">0%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '0%' }}></div></div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <Clock size={16} className="text-emerald-500" />
                                    Mulai: {course.tanggal_mulai ? new Date(course.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera Dimulai'}
                                </div>

                                <div className="mt-auto space-y-3">
                                    {course.link_grup_wa ? (
                                        <a href={course.link_grup_wa} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/20 active:scale-95">
                                            <MessageCircle size={20} /> Masuk Grup WA
                                        </a>
                                    ) : (
                                        <button disabled className="w-full py-3.5 px-4 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">Link WA Belum Ada</button>
                                    )}
                                    <button className="w-full py-3.5 px-4 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors active:scale-95">
                                        Masuk Kelas
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </MemberLayout>
    );
}