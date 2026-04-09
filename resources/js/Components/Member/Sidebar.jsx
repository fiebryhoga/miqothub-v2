// resources/js/Components/Member/Sidebar.jsx
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LayoutDashboard, BookOpen, Calendar, Award, Receipt, X } from 'lucide-react';

export default function Sidebar({ user, isOpen, onClose }) {
    const { url } = usePage();

    // Daftar Menu Member
    const menuItems = [
        { name: 'Beranda', icon: <LayoutDashboard size={20} />, route: 'dashboard', active: url.startsWith('/dashboard') },
        { name: 'Kelas Saya', icon: <BookOpen size={20} />, route: 'member.courses.index', active: url.startsWith('/my-courses') },
        { name: 'Jadwal & Live', icon: <Calendar size={20} />, route: '#', active: url.startsWith('/schedules') },
        { name: 'Sertifikat', icon: <Award size={20} />, route: '#', active: url.startsWith('/certificates') },
        { name: 'Transaksi', icon: <Receipt size={20} />, route: '#', active: url.startsWith('/transactions') },
    ];

    return (
        <>
            {/* SIDEBAR (Desktop) */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 fixed inset-y-0 z-20">
                <div className="h-20 flex items-center px-8 border-b border-gray-50">
                    <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold text-gray-900">
                        <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/30">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        Haji<span className="text-emerald-600">Course</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2 scrollbar-thin">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Menu Utama</p>
                    {menuItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.route !== '#' ? route(item.route) : '#'}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all group relative overflow-hidden ${
                                item.active ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {item.active && <motion.div layoutId="activeNav" className="absolute left-0 w-1.5 h-8 bg-emerald-500 rounded-r-full" />}
                            <span className={`${item.active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'} transition-colors`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-50">
                    <Link href={route('profile.edit')} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 group-hover:scale-105 transition-transform">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">Lihat Profil</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* MOBILE SIDEBAR OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={onClose} 
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '-100%' }} 
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                            className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col lg:hidden"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                                <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-600"/> HajiCourse
                                </span>
                                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
                                    <X size={20}/>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                                {menuItems.map((item) => (
                                    <Link 
                                        key={item.name} 
                                        href={item.route !== '#' ? route(item.route) : '#'} 
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold ${item.active ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500'}`}
                                    >
                                        {item.icon} {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}