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
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Kelas (Course)</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Kelola program pelatihan, harga, dan jadwal batch.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all active:scale-95 shadow-md text-sm">
                    <Plus size={18} strokeWidth={2.5} /> Buat Kelas Baru
                </button>
            </div>

             <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold flex items-center gap-3 shadow-sm text-sm">
                        <div className="w-8 h-8 bg-blue-200/50 rounded-full flex items-center justify-center shrink-0">
                            <ShieldAlert size={16} className="text-blue-700" />
                        </div>
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {courses.length === 0 ? (
                 <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                        <BookOpen size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Belum ada Kelas</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 max-w-md leading-relaxed">Anda belum membuat program kelas apa pun. Klik tombol di bawah untuk mulai membuat kelas pertama Anda.</p>
                    <button onClick={openCreateModal} className="px-6 py-3 bg-blue-50 text-blue-900 border border-blue-100 font-bold rounded-xl hover:bg-blue-100 transition-colors shadow-sm text-sm">
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
                            onShowMembers={openMembersModal}
                        />
                    ))}
                </div>
            )}

            <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditMode={isEditMode} course={selectedCourse} />

            {/* MODAL DAFTAR PESERTA */}
            <AnimatePresence>
                {isMembersModalOpen && courseForMembers && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMembersModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-opacity" />
                        
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-slate-900/20 flex flex-col max-h-[85vh] overflow-hidden border border-slate-100">
                            
                            {/* Header Modal Peserta */}
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                        <Users size={20} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Daftar Peserta</h2>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{courseForMembers.nama} (Batch {courseForMembers.batch})</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsMembersModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0">
                                    <X size={20}/>
                                </button>
                            </div>

                            {/* Daftar Peserta */}
                            <div className="p-0 overflow-y-auto scrollbar-thin bg-slate-50/50 flex-1">
                                {courseForMembers.transactions && courseForMembers.transactions.length > 0 ? (
                                    <ul className="divide-y divide-slate-100">
                                        {courseForMembers.transactions.map((trx, idx) => (
                                            trx.user ? (
                                                <li key={trx.id} className="p-4 sm:px-6 hover:bg-white transition-colors flex items-center gap-4 group">
                                                    {/* Avatar Peserta */}
                                                    <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm border border-blue-800">
                                                        {trx.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors truncate">{trx.user.name}</p>
                                                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                                                            <Mail size={12} className="shrink-0"/> {trx.user.email}
                                                        </p>
                                                    </div>
                                                </li>
                                            ) : null
                                        ))}
                                    </ul>
                                ) : (
                                     <div className="p-16 text-center bg-white h-full flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                            <Users className="text-slate-300" size={32} />
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm">Belum ada peserta yang tergabung di kelas ini.</p>
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