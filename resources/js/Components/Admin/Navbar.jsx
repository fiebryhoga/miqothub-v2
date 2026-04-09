import { Link } from '@inertiajs/react';
import { Menu, Bell, Search, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, setIsSidebarOpen }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
            {/* Bagian Kiri: Tombol Menu (Mobile) & Judul Halaman */}
            <div className="flex items-center gap-4 sm:gap-6">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSidebarOpen(true)} 
                    className="p-2 rounded-xl text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 md:hidden transition-colors"
                >
                    <Menu size={24} />
                </motion.button>

                {/* Teks Konteks (Disembunyikan di layar sangat kecil) */}
                <div className="hidden lg:block">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">Dashboard</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Pantau aktivitas sistem hari ini</p>
                </div>
            </div>

            {/* Bagian Kanan: Search, Notifikasi, Profile */}
            <div className="flex items-center gap-4 sm:gap-6">
                
                {/* Search Bar Modern (Animasi Memanjang saat di-klik) */}
                <motion.div 
                    animate={{ width: isSearchFocused ? 320 : 240 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="hidden md:flex relative group"
                >
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isSearchFocused ? 'text-emerald-500' : 'text-gray-400'}`}>
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari pendaftar, modul..." 
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="pl-11 pr-12 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all shadow-sm"
                    />
                    {/* Hotkey Hint untuk Estetika */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded bg-white">⌘K</span>
                    </div>
                </motion.div>

                {/* Garis Pembatas vertical */}
                <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                {/* Tombol Notifikasi dengan Efek Ping (Denyut) */}
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                    </span>
                </motion.button>

                {/* User Dropdown Profile */}
                <div className="relative">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-gray-200 shadow-sm rounded-full hover:border-emerald-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden sm:flex flex-col items-start">
                            <span className="text-sm font-bold text-gray-800 leading-none">
                                {user.name}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mt-1">
                                Admin
                            </span>
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                {/* Backdrop tidak terlihat untuk menutup dropdown saat klik area luar */}
                                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)}></div>
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-40 overflow-hidden"
                                >
                                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                                    </div>
                                    
                                    <div className="py-2">
                                        <Link href={route('profile.edit')} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                            <UserIcon size={18} /> Profil Saya
                                        </Link>
                                        <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                            <Settings size={18} /> Pengaturan Sistem
                                        </button>
                                    </div>
                                    
                                    <div className="border-t border-gray-100 py-1.5">
                                        <Link href={route('logout')} method="post" as="button" className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut size={18} /> Keluar
                                        </Link>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}