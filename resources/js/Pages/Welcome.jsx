import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
    BookOpen, ShieldCheck, MessageSquareShare, Award, 
    ArrowRight, Sparkles, CheckCircle2, PlayCircle, FileText, X, ChevronRight, Play
} from 'lucide-react';

export default function Welcome({ auth, courses = [] }) {
    
    const [activePreview, setActivePreview] = useState(null);

    const previewMaterials = courses.reduce((acc, course) => {
        let coursePreviews = [];
        if (course.chapters) {
            course.chapters.forEach(chapter => {
                if (chapter.materials) {
                    chapter.materials.forEach(material => {
                        if (material.is_preview) {
                            coursePreviews.push({ ...material, courseName: course.nama });
                        }
                    });
                }
            });
        }
        return [...acc, ...coursePreviews];
    }, []);

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url; 
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden scroll-smooth">
            <Head title="MiqotHub - Platform Pembelajaran Digital" />

            {/* --- SUBTLE BACKGROUND --- */}
            <div className="absolute top-0 w-full h-[80vh] bg-gradient-to-b from-white via-indigo-50/30 to-[#F8FAFC] z-0 pointer-events-none"></div>

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-40 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <BookOpen size={18} strokeWidth={3} />
                        </div>
                        Miqot<span className="text-indigo-600">Hub.</span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="font-semibold text-sm px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-indigo-600 transition-all duration-300">
                                Buka Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-semibold text-sm text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">Masuk</Link>
                                <Link href={route('register')} className="font-semibold text-sm px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </motion.div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 pt-32 pb-20">
                <motion.div className="text-center max-w-4xl mx-auto" variants={staggerContainer} initial="hidden" animate="visible">
                    <motion.div variants={fadeUpVariant} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-700 text-xs font-bold tracking-wider uppercase">
                        <Sparkles size={14} className="text-amber-500" /> Platform Edukasi Digital
                    </motion.div>
                    
                    <motion.div variants={fadeUpVariant}>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
                            Tingkatkan Kapasitas <br className="hidden md:block" />
                            <span className="text-indigo-600">
                                Keilmuan Anda.
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div variants={fadeUpVariant}>
                        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Akses materi komprehensif, evaluasi terstruktur, dan pemantauan progres belajar yang terintegrasi penuh untuk pengalaman belajar terbaik.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="#pricelist" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group">
                            Lihat Pilihan Kelas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#fitur" className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center">
                            Pelajari Fitur
                        </a>
                    </motion.div>
                </motion.div>
            </main>

            {/* --- PREVIEW MATERI GRATIS (REMASTERED LIS/SYLLABUS STYLE) --- */}
            {previewMaterials.length > 0 && (
                <section className="relative z-10 py-24 bg-white border-y border-slate-100">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-5xl mx-auto px-6">
                        
                        <div className="text-center mb-16">
                            <motion.span variants={fadeUpVariant} className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-2 block">Coba Gratis</motion.span>
                            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Intip Materi Kami</motion.h2>
                            <motion.p variants={fadeUpVariant} className="text-slate-500 text-lg max-w-2xl mx-auto">Rasakan langsung kualitas penyampaian materi kami sebelum Anda bergabung ke kelas premium.</motion.p>
                        </div>

                        {/* List Layout Pengganti Card Kosong */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {previewMaterials.slice(0, 6).map((material, idx) => (
                                <motion.div 
                                    key={idx} 
                                    variants={fadeUpVariant} 
                                    onClick={() => setActivePreview(material)}
                                    className="group flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Icon Indicator Kecil & Rapi */}
                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                                        {material.tipe === 'video' ? <Play size={22} fill="currentColor" className="ml-1" /> : <FileText size={22} />}
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-md">Preview</span>
                                            <span className="text-xs text-slate-500 truncate font-medium"><BookOpen size={12} className="inline mr-1 text-slate-400" />{material.courseName}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{material.judul}</h3>
                                    </div>
                                    
                                    {/* Arrow CTA */}
                                    <div className="self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ChevronRight size={20} className="text-indigo-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>
            )}

            {/* --- PRICELIST / COURSE CATALOG --- */}
            <section id="pricelist" className="relative z-10 py-24 bg-[#F8FAFC]">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Program Kelas</motion.h2>
                            <motion.p variants={fadeUpVariant} className="text-slate-500">Pilih program komprehensif yang sesuai dengan kebutuhan Anda.</motion.p>
                        </div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-600">Belum Ada Kelas yang Tersedia</h3>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course, idx) => (
                                <motion.div key={course.id} variants={fadeUpVariant} className="bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group">
                                    <div className="relative h-56 rounded-[1.5rem] overflow-hidden bg-slate-100">
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-50"><BookOpen size={40} className="text-indigo-200" /></div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-slate-900 shadow-sm">Batch {course.batch}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.nama}</h3>
                                        
                                        <div className="mb-6 flex flex-col gap-1 pb-6 border-b border-slate-100">
                                            {course.harga_coret > 0 && <span className="text-sm font-medium text-slate-400 line-through decoration-slate-300">{formatRupiah(course.harga_coret)}</span>}
                                            <span className="text-3xl font-black text-slate-900">{formatRupiah(course.harga)}</span>
                                        </div>

                                        <div className="flex-1 space-y-3 mb-8">
                                            <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" /><span className="text-sm text-slate-600">Akses penuh Modul & Video materi</span></div>
                                            <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" /><span className="text-sm text-slate-600">Latihan Soal (CBT) & evaluasi instan</span></div>
                                            {course.link_grup_wa && <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" /><span className="text-sm text-slate-600">Grup Diskusi & Mentoring eksklusif</span></div>}
                                            <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" /><span className="text-sm text-slate-600">Sertifikat Digital (e-Certificate)</span></div>
                                        </div>

                                        <Link href={auth?.user ? route('member.catalog') : route('register')} className="w-full py-3.5 bg-indigo-50 text-indigo-700 rounded-xl font-semibold text-center hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                            Daftar Sekarang
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section id="fitur" className="relative z-10 py-24 bg-white border-t border-slate-100">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2 variants={fadeUpVariant} className="text-3xl font-black text-slate-900 mb-4">Fitur Pembelajaran</motion.h2>
                        <motion.p variants={fadeUpVariant} className="text-slate-500 text-lg max-w-2xl mx-auto">Sistem cerdas (LMS) yang terstruktur untuk hasil belajar yang maksimal.</motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: BookOpen, title: "Materi Terstruktur", desc: "Modul pembelajaran yang selalu diperbarui, dilengkapi video, PDF, dan text interaktif.", color: "text-indigo-600", bg: "bg-indigo-50" },
                            { icon: ShieldCheck, title: "Evaluasi Instan", desc: "Latihan soal berbasis komputer (CBT) yang merekam dan menilai progres otomatis.", color: "text-emerald-600", bg: "bg-emerald-50" },
                            { icon: MessageSquareShare, title: "Notifikasi Cepat", desc: "Tetap terhubung dengan kelas Anda. Dapatkan update jadwal secara langsung.", color: "text-blue-600", bg: "bg-blue-50" },
                            { icon: Award, title: "Rekap Terpadu", desc: "Pantau nilai latihan, masa aktif kelas, dan kelola profil Anda dengan mudah.", color: "text-violet-600", bg: "bg-violet-50" }
                        ].map((fitur, idx) => (
                            <motion.div key={idx} variants={fadeUpVariant} className="p-8 bg-[#F8FAFC] rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all duration-300">
                                <div className={`w-12 h-12 ${fitur.bg} ${fitur.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <fitur.icon size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{fitur.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{fitur.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
            
            <footer className="bg-white border-t border-slate-200 py-10 text-center text-slate-500 text-sm z-10 relative">
                <p>&copy; {new Date().getFullYear()} MiqotHub. All rights reserved.</p>
            </footer>

            {/* ======================================================== */}
            {/* 🍿 POPUP MODAL THEATER UNTUK MATERI PREVIEW */}
            {/* ======================================================== */}
            <AnimatePresence>
                {activePreview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 z-50">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            onClick={() => setActivePreview(null)} 
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" 
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <button onClick={() => setActivePreview(null)} className="absolute top-4 right-4 z-50 p-2 bg-slate-900/10 hover:bg-slate-900 text-slate-700 hover:text-white rounded-full backdrop-blur-md transition-all">
                                <X size={20} />
                            </button>

                            <div className="overflow-y-auto scrollbar-thin flex-1">
                                {activePreview.tipe === 'video' && activePreview.link_video ? (
                                    <div className="w-full aspect-video bg-slate-900 relative">
                                        <iframe 
                                            src={getEmbedUrl(activePreview.link_video)} 
                                            className="absolute inset-0 w-full h-full" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (activePreview.tipe === 'pdf' || activePreview.file_path) ? (
                                    <div className="w-full h-[60vh] bg-slate-100 relative">
                                        <iframe 
                                            src={`/storage/${activePreview.file_path}`} 
                                            className="absolute inset-0 w-full h-full" 
                                            title="PDF Viewer"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="w-full py-16 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                                        <FileText size={48} className="mb-4 text-slate-300" />
                                        <p className="font-medium text-sm">Materi berbasis teks. Silakan baca di bawah.</p>
                                    </div>
                                )}

                                <div className="p-8 md:p-10 bg-white">
                                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6">
                                        <div>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 inline-block">Free Preview</span>
                                            <h3 className="font-black text-slate-900 text-2xl md:text-3xl leading-tight mb-2">{activePreview.judul}</h3>
                                            <p className="text-slate-500 text-sm flex items-center gap-2 font-medium">
                                                <BookOpen size={14} className="text-indigo-500"/> Bagian dari: <span className="text-slate-700 font-bold">{activePreview.courseName}</span>
                                            </p>
                                        </div>
                                        <Link href={route('register')} className="shrink-0 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-md flex items-center gap-2">
                                            Daftar Kelas <ArrowRight size={16} />
                                        </Link>
                                    </div>

                                    {activePreview.deskripsi && (
                                        <div className="pt-6 border-t border-slate-100">
                                            <h4 className="font-bold text-slate-900 text-sm mb-3">Deskripsi Materi</h4>
                                            <div className="prose prose-sm prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: activePreview.deskripsi }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}