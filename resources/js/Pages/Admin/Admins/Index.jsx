import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AdminModal from './Partials/AdminModal';

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
                    <h1 className="text-2xl font-bold text-slate-800">Manajemen Admin</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Kelola data administrator sistem dengan mudah.</p>
                </div>
                <button 
                    onClick={openCreateModal} 
                    /* Menggunakan Biru Dongker (blue-900) */
                    className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all active:scale-95 text-sm"
                >
                    <Plus size={18} strokeWidth={2.5} /> Tambah Admin
                </button>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-semibold text-sm flex items-center gap-3 shadow-sm"
                    >
                        <div className="w-8 h-8 bg-blue-200/50 rounded-full flex items-center justify-center text-blue-900 shrink-0">
                            <ShieldAlert size={16} />
                        </div>
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabel Data Admin */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-5 font-bold">Profil Admin</th>
                                <th className="p-5 font-bold">Email</th>
                                <th className="p-5 font-bold">Tgl. Terdaftar</th>
                                <th className="p-5 font-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {admins.map((admin, index) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                    key={admin.id} className="hover:bg-slate-50/80 transition-colors group"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar / Foto */}
                                            {admin.foto_url ? (
                                                <img src={admin.foto_url} alt={admin.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm" />
                                            ) : (
                                                /* Avatar Kosong: Biru Dongker */
                                                <div className="w-11 h-11 rounded-full bg-blue-900 border border-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {admin.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                {/* Hover Teks: Biru Dongker */}
                                                <p className="font-bold text-slate-800 group-hover:text-blue-900 transition-colors text-sm">{admin.name}</p>
                                                {/* Badge: Teks Biru Dongker */}
                                                <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-900 uppercase tracking-widest border border-blue-200">
                                                    <ShieldAlert size={10} /> Admin Utama
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-slate-600 text-sm font-medium">{admin.email}</td>
                                    <td className="p-5 text-slate-500 text-sm font-medium">
                                        {new Date(admin.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(admin)} className="p-2 text-slate-400 hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Edit Admin">
                                                <Edit size={18} />
                                            </button>
                                            {auth.user.id !== admin.id && (
                                                <button onClick={() => handleDelete(admin.id)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100" title="Hapus Admin">
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