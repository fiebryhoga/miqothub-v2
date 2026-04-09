// resources/js/Pages/Admin/Courses/Index.jsx
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, ShieldAlert, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import CourseModal from './Partials/CourseModal';
import CourseCard from './Partials/CourseCard'; // Import komponen CourseCard baru

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
                        // Menggunakan CourseCard dan mempassing semua props yang dibutuhkan
                        <CourseCard 
                            key={course.id}
                            course={course}
                            index={index}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            formatRupiah={formatRupiah}
                        />
                    ))}
                </div>
            )}

            <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditMode={isEditMode} course={selectedCourse} />
        </AdminLayout>
    );
}