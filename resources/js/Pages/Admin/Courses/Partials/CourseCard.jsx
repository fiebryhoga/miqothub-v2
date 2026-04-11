import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Users, Edit, Trash2, BookOpen, Layers, ArrowRight } from 'lucide-react';

export default function CourseCard({ course, index, onEdit, onDelete, formatRupiah, onShowMembers }) {
    // Hitung jumlah member yang sudah diverifikasi di kelas ini
    const enrolledCount = course.transactions ? course.transactions.length : 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }} 
            className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group"
        >
            {/* --- BAGIAN GAMBAR / THUMBNAIL --- */}
            <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-50 mb-5">
                {course.thumbnail_url ? (
                    <img 
                        src={course.thumbnail_url} 
                        alt={course.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200">
                        <BookOpen size={56} strokeWidth={1.5} />
                    </div>
                )}
                
                {/* Overlay Gradient untuk teks putih */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badge Status */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md backdrop-blur-md border border-white/20 ${course.status === 'onsale' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                        {course.status === 'onsale' ? 'Buka Pendaftaran' : 'Ditutup'}
                    </span>
                </div>
                
                {/* Badge Batch */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-white/95 text-slate-800 rounded-xl shadow-md backdrop-blur-md">
                        Batch {course.batch}
                    </span>
                </div>
            </div>

            {/* --- BAGIAN KONTEN --- */}
            <div className="px-3 flex-1 flex flex-col pb-2">
                <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                    {course.nama}
                </h3>
                
                {/* Harga */}
                <div className="mb-5 flex items-end gap-2">
                    <span className="text-2xl font-black text-emerald-500 leading-none">{formatRupiah(course.harga)}</span>
                    {course.harga_coret > 0 && (
                        <span className="text-sm font-bold text-slate-400 line-through decoration-rose-400 mb-0.5">
                            {formatRupiah(course.harga_coret)}
                        </span>
                    )}
                </div>

                {/* Grid Info Meta (Jadwal & Kuota) */}
                <div className="grid grid-cols-2 gap-3 mt-auto mb-6">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Calendar size={14}/> Mulai
                        </p>
                        <p className="text-xs font-bold text-slate-700 leading-tight">
                            {course.tanggal_mulai ? new Date(course.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}
                        </p>
                    </div>

                    {/* Tombol Kuota yang Interactive */}
                    <div 
                        onClick={() => onShowMembers(course)}
                        className="bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group/quota flex flex-col justify-center shadow-sm hover:shadow-md"
                        title="Klik untuk melihat daftar peserta"
                    >
                        <p className="text-[10px] font-black text-slate-400 group-hover/quota:text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 transition-colors">
                            <Users size={14}/> Peserta
                            <ArrowRight size={12} className="ml-auto opacity-0 group-hover/quota:opacity-100 -translate-x-2 group-hover/quota:translate-x-0 transition-all"/>
                        </p>
                        <p className="text-xs font-bold text-slate-500 group-hover/quota:text-emerald-700 transition-colors">
                            <span className={`text-base font-black ${enrolledCount > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>{enrolledCount}</span> / {course.kuota || '∞'}
                        </p>
                    </div>
                </div>

                {/* --- BAGIAN AKSI / TOMBOL --- */}
                <div className="flex items-center gap-2 pt-2">
                    <Link 
                        href={route('admin.courses.curriculum', course.id)} 
                        className="flex-1 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-slate-200 active:scale-95"
                    >
                        <Layers size={18} /> Kurikulum
                    </Link>
                    
                    <button 
                        onClick={() => onEdit(course)} 
                        className="p-3.5 text-slate-400 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all shadow-sm active:scale-95" 
                        title="Edit Kelas"
                    >
                        <Edit size={18} />
                    </button>
                    
                    <button 
                        onClick={() => onDelete(course.id)} 
                        className="p-3.5 text-slate-400 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-all shadow-sm active:scale-95" 
                        title="Hapus Kelas"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}