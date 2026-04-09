import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth }) {
    // Dummy Data untuk Widget
    const stats = [
        { title: 'Total Member', value: '1,240', icon: <Users size={24} />, color: 'bg-blue-500' },
        { title: 'Modul Aktif', value: '24', icon: <FileText size={24} />, color: 'bg-emerald-500' },
        { title: 'Lulus Ujian', value: '856', icon: <CheckCircle size={24} />, color: 'bg-teal-500' },
        { title: 'Tingkat Kelulusan', value: '89%', icon: <TrendingUp size={24} />, color: 'bg-indigo-500' },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard Admin" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Statistik</h1>
                <p className="text-gray-500 mt-1">Selamat datang kembali, {auth.user.name}. Berikut ringkasan sistem hari ini.</p>
            </div>

            {/* Grid Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Area Tabel Dummy / Aktivitas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Pendaftar Member Terbaru</h2>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat Semua</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="pb-3 font-medium">Nama Member</th>
                                <th className="pb-3 font-medium">Pekerjaan</th>
                                <th className="pb-3 font-medium">Tanggal Daftar</th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {/* Dummy Row 1 */}
                            <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <span className="font-medium text-gray-900">Ahmad Fulan</span>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-600">PNS</td>
                                <td className="py-4 text-gray-600">Hari ini, 08:30</td>
                                <td className="py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Terverifikasi</span>
                                </td>
                            </tr>
                            {/* Dummy Row 2 */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                        <span className="font-medium text-gray-900">Siti Aminah</span>
                                    </div>
                                </td>
                                <td className="py-4 text-gray-600">Guru</td>
                                <td className="py-4 text-gray-600">Kemarin, 14:15</td>
                                <td className="py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Menunggu</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}