import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Users, Calendar, ArrowRight, ShieldAlert, BookOpen, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import CourseModal from './Partials/CourseModal'; // Import Modal

export default function Index({ auth, courses }) {
    const { flash = {} } = usePage().props;

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const openCreateModal = () => { setIsEditMode(false); setSelectedCourse(null); setIsModalOpen(true); };
    const openEditModal = (course) => { setIsEditMode(true); setSelectedCourse(course); setIsModalOpen(true); };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kelas ini beserta semua datanya?')) {
            router.delete(route('admin.courses.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Kelas" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas (Course)</h1>
                    <p className="text-gray-500 mt-1 text-sm">Kelola program pelatihan, harga, dan jadwal batch.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95">
                    <Plus size={20} /> Buat Kelas Baru
                </button>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center gap-3 shadow-sm">
                        <ShieldAlert size={16} /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {courses.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Belum ada Kelas</h3>
                    <p className="text-gray-500 mb-6 mt-2 max-w-md">Anda belum membuat program kelas apa pun. Klik tombol di bawah untuk mulai membuat kelas pertama Anda.</p>
                    <button onClick={openCreateModal} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                        Buat Kelas Sekarang
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={course.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-300"><BookOpen size={48} /></div>
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

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{course.nama}</h3>
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-xl font-extrabold text-emerald-600">{formatRupiah(course.harga)}</span>
                                    {course.harga_coret > 0 && <span className="text-sm text-gray-400 line-through decoration-red-400">{formatRupiah(course.harga_coret)}</span>}
                                </div>
                                <div className="flex flex-col gap-2 mt-auto text-sm text-gray-500 font-medium">
                                    <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> Mulai: {course.tanggal_mulai ? new Date(course.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum ditentukan'}</div>
                                    <div className="flex items-center gap-2"><Users size={16} className="text-gray-400" /> Kuota: {course.kuota ? `${course.kuota} Peserta` : 'Tidak Terbatas'}</div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
                                <button onClick={() => handleDelete(course.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={() => openEditModal(course)} className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                                    Kelola Kelas <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditMode={isEditMode} course={selectedCourse} />
        </AdminLayout>
    );
}