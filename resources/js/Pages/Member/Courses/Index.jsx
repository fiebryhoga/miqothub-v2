// resources/js/Pages/Member/Courses/Index.jsx
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, Compass } from 'lucide-react';

export default function Index({ auth, myCourses = [] }) {
    return (
        <MemberLayout user={auth.user}>
            <Head title="Kelas Saya" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Kelas Saya</h1>
                <p className="text-gray-500 mt-1 text-sm">Lanjutkan proses belajar dan persiapkan ibadah Anda dengan maksimal.</p>
            </div>

            {myCourses.length === 0 ? (
                // EMPTY STATE (Jika belum punya kelas)
                <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                        <Compass size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Anda belum mengikuti kelas apapun</h3>
                    <p className="text-gray-500 mt-2 mb-6 max-w-sm text-sm">
                        Mulai perjalanan belajar Anda dengan mendaftar program bimbingan yang kami sediakan.
                    </p>
                    <Link 
                        href="/" // Arahkan ke halaman katalog/landing page
                        className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/30"
                    >
                        Eksplorasi Kelas
                    </Link>
                </div>
            ) : (
                // GRID KELAS
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myCourses.map((course, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: index * 0.1 }} 
                            key={course.id} 
                            className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="h-44 bg-gray-100 rounded-2xl relative overflow-hidden mb-4">
                                {course.thumbnail_url ? (
                                    <img 
                                        src={course.thumbnail_url} 
                                        alt={course.nama} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300">
                                        <BookOpen size={40} />
                                    </div>
                                )}
                                
                                {/* Overlay Gradient untuk estetika */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                
                                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold uppercase rounded-lg">
                                        Batch {course.batch}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2 pb-2 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                                    {course.nama}
                                </h3>
                                
                                {/* Progres Bar Buatan (Bisa dihubungkan dengan database nanti) */}
                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
                                        <span>Progres Belajar</span>
                                        <span className="text-emerald-600">0%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                        <div className="bg-emerald-500 h-2 rounded-full w-0"></div>
                                    </div>

                                    <Link 
                                        href={`/my-courses/${course.id}`} // Nanti ini diarahkan ke halaman isi materi
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                                    >
                                        <PlayCircle size={18} /> Mulai Belajar
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </MemberLayout>
    );
}