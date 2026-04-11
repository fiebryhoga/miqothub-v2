// resources/js/Pages/Admin/Courses/Index.jsx
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, ShieldAlert, BookOpen, X, Users, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import CourseModal from './Partials/CourseModal';
import CourseCard from './Partials/CourseCard';

export default function Index({ auth, courses }) {
    const { flash = {} } = usePage().props;

    // State Modal Kelas
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // State Modal Peserta
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [courseForMembers, setCourseForMembers] = useState(null);

    const openCreateModal = () => { setIsEditMode(false); setSelectedCourse(null); setIsModalOpen(true); };
    const openEditModal = (course) => { setIsEditMode(true); setSelectedCourse(course); setIsModalOpen(true); };
    
    // Buka Modal Daftar Peserta
    const openMembersModal = (course) => {
        setCourseForMembers(course);
        setIsMembersModalOpen(true);
    };

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
                {/* ... Header tetap sama ... */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas (Course)</h1>
                    <p className="text-gray-500 mt-1 text-sm">Kelola program pelatihan, harga, dan jadwal batch.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95">
                    <Plus size={20} /> Buat Kelas Baru
                </button>
            </div>

            {/* ... Flash message tetap sama ... */}
             <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center gap-3 shadow-sm">
                        <ShieldAlert size={16} /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {courses.length === 0 ? (
                 /* ... Empty State tetap sama ... */
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
                        <CourseCard 
                            key={course.id}
                            course={course}
                            index={index}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            formatRupiah={formatRupiah}
                            onShowMembers={openMembersModal} // Tambahkan Prop Ini
                        />
                    ))}
                </div>
            )}

            <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditMode={isEditMode} course={selectedCourse} />

            {/* MODAL DAFTAR PESERTA */}
            <AnimatePresence>
                {isMembersModalOpen && courseForMembers && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMembersModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                        
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Users className="text-emerald-500" size={20} /> Daftar Peserta
                                    </h2>
                                    <p className="text-sm text-gray-500">{courseForMembers.nama} (Batch {courseForMembers.batch})</p>
                                </div>
                                <button onClick={() => setIsMembersModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={20}/></button>
                            </div>

                            <div className="p-0 overflow-y-auto flex-1">
                                {courseForMembers.transactions && courseForMembers.transactions.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {courseForMembers.transactions.map((trx, idx) => (
                                            trx.user ? (
                                                <li key={trx.id} className="p-4 hover:bg-emerald-50/50 transition-colors flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                                                        {trx.user.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900">{trx.user.name}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {trx.user.email}</p>
                                                    </div>
                                                </li>
                                            ) : null
                                        ))}
                                    </ul>
                                ) : (
                                     <div className="p-10 text-center">
                                        <Users className="mx-auto text-gray-300 mb-3" size={40} />
                                        <p className="text-gray-500">Belum ada peserta yang tergabung di kelas ini.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}