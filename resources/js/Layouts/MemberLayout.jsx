import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LogOut, User, ShieldCheck, LayoutDashboard, BookOpen, Calendar, Award, Receipt, Menu, X, Bell } from 'lucide-react';

export default function MemberLayout({ user, children }) {
    const { url } = usePage(); // Untuk mendeteksi menu mana yang sedang aktif
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Daftar Menu Member
    const menuItems = [
        { name: 'Beranda', icon: <LayoutDashboard size={20} />, route: 'dashboard', active: url.startsWith('/dashboard') },
        { name: 'Kelas Saya', icon: <BookOpen size={20} />, route: '#', active: url.startsWith('/my-courses') },
        { name: 'Jadwal & Live', icon: <Calendar size={20} />, route: '#', active: url.startsWith('/schedules') },
        { name: 'Sertifikat', icon: <Award size={20} />, route: '#', active: url.startsWith('/certificates') },
        { name: 'Transaksi', icon: <Receipt size={20} />, route: '#', active: url.startsWith('/transactions') },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
            
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
                            key={item.name} href={item.route !== '#' ? route(item.route) : '#'}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all group relative overflow-hidden ${
                                item.active ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {item.active && <motion.div layoutId="activeNav" className="absolute left-0 w-1.5 h-8 bg-emerald-500 rounded-r-full" />}
                            <span className={`${item.active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'} transition-colors`}>{item.icon}</span>
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
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col lg:hidden">
                            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                                <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-600"/> HajiCourse
                                </span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                                {menuItems.map((item) => (
                                    <Link key={item.name} href={item.route !== '#' ? route(item.route) : '#'} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold ${item.active ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500'}`}>
                                        {item.icon} {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                
                {/* TOP HEADER */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-bold text-gray-800 hidden sm:block">Ruang Belajar</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 relative text-gray-400 hover:text-emerald-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="hidden sm:block text-sm font-bold text-gray-700">{user.name.split(' ')[0]}</span>
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                            <Link href={route('profile.edit')} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"><User size={18} /> Profil Saya</Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Link href={route('logout')} method="post" as="button" className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"><LogOut size={18} /> Keluar</Link>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="p-4 sm:p-8 flex-1">
                    {children}
                </main>
            </div>

        </div>
    );
}