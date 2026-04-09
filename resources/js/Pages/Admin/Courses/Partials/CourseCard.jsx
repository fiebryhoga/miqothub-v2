// resources/js/Pages/Admin/Courses/Partials/CourseCard.jsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight, Trash2, BookOpen, Layers } from 'lucide-react';

export default function CourseCard({ course, index, onEdit, onDelete, formatRupiah }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }} 
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
            {/* Bagian Gambar / Thumbnail */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300">
                        <BookOpen size={48} />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full shadow-sm backdrop-blur-md ${course.status === 'onsale' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                        {course.status === 'onsale' ? 'Buka Pendaftaran' : 'Ditutup'}
                    </span>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold bg-white/90 text-gray-800 rounded-full shadow-sm backdrop-blur-md">Batch {course.batch}</span>
                </div>
            </div>

            {/* Bagian Detail Kelas */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{course.nama}</h3>
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-xl font-extrabold text-emerald-600">{formatRupiah(course.harga)}</span>
                    {course.harga_coret > 0 && <span className="text-sm text-gray-400 line-through decoration-red-400">{formatRupiah(course.harga_coret)}</span>}
                </div>
                <div className="flex flex-col gap-2 mt-auto text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" /> 
                        Mulai: {course.tanggal_mulai ? new Date(course.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum ditentukan'}
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" /> 
                        Kuota: {course.kuota ? `${course.kuota} Peserta` : 'Tidak Terbatas'}
                    </div>
                </div>
            </div>

            {/* Bagian Aksi / Tombol */}
            <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-2">
                    <button onClick={() => onDelete(course.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Kelas">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={() => onEdit(course)} className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors" title="Edit Pengaturan Kelas">
                        Edit <ArrowRight size={16} />
                    </button>
                </div>
                
                {/* TOMBOL MENUJU HALAMAN KURIKULUM */}
                <Link 
                    href={route('admin.courses.curriculum', course.id)} 
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Layers size={16} /> Kurikulum
                </Link>
            </div>
        </motion.div>
    );
}