import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AdminModal from './Partials/AdminModal'; // Import Modal yang baru dibuat

export default function Index({ auth, admins }) {
    const { flash = {} } = usePage().props; 
    
    // State Manajemen Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedAdmin(null);
        setIsModalOpen(true);
    };

    const openEditModal = (admin) => {
        setIsEditMode(true);
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
            router.delete(route('admin.management.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Admin</h1>
                    <p className="text-gray-500 mt-1 text-sm">Kelola data administrator sistem dengan mudah.</p>
                </div>
                <button 
                    onClick={openCreateModal} 
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95"
                >
                    <Plus size={20} /> Tambah Admin
                </button>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center gap-3 shadow-sm"
                    >
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <ShieldAlert size={16} />
                        </div>
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabel Data Admin */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-5 font-semibold">Profil Admin</th>
                                <th className="p-5 font-semibold">Email</th>
                                <th className="p-5 font-semibold">Tgl. Terdaftar</th>
                                <th className="p-5 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {admins.map((admin, index) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                    key={admin.id} className="hover:bg-emerald-50/30 transition-colors group"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            {admin.foto_url ? (
                                                <img src={admin.foto_url} alt={admin.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {admin.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{admin.name}</p>
                                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase">
                                                    <ShieldAlert size={10} /> Admin Utama
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-gray-600 text-sm font-medium">{admin.email}</td>
                                    <td className="p-5 text-gray-500 text-sm">
                                        {new Date(admin.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(admin)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                                                <Edit size={18} />
                                            </button>
                                            {auth.user.id !== admin.id && (
                                                <button onClick={() => handleDelete(admin.id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Panggil Modal Component */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                isEditMode={isEditMode} 
                admin={selectedAdmin} 
            />

        </AdminLayout>
    );
}