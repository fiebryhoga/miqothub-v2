import { Link } from '@inertiajs/react';
import { Menu, Bell, Search, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, setIsSidebarOpen }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [imageError, setImageError] = useState(false); 

    
    const getAvatarUrl = () => {
        
        const photoPath = user?.foto_profile || user?.avatar || user?.profile_photo_path || user?.profile_photo_url || user?.photo;
        
        if (!photoPath) return null;
        
        if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
        
        if (photoPath.startsWith('/storage/')) return photoPath;
        
        return `/storage/${photoPath}`;
    };

    const photoUrl = getAvatarUrl();

    return (
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm">
            {/* --- Bagian Kiri: Tombol Menu (Mobile) & Judul --- */}
            <div className="flex items-center gap-4 sm:gap-6">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSidebarOpen(true)} 
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-blue-950 md:hidden transition-colors border border-transparent hover:border-slate-200"
                >
                    <Menu size={22} />
                </motion.button>

                {/* Teks Konteks */}
                <div className="hidden lg:block">
                    <h2 className="text-xl font-black text-blue-950 leading-tight tracking-tight">Dashboard</h2>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">Overview aktivitas sistem Anda</p>
                </div>
            </div>

            {/* --- Bagian Kanan: Search, Notifikasi, Profile --- */}
            <div className="flex items-center gap-3 sm:gap-5">
                
                {/* Search Bar Modern Navy */}
                <motion.div 
                    animate={{ width: isSearchFocused ? 320 : 240 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="hidden md:flex relative group"
                >
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isSearchFocused ? 'text-blue-900' : 'text-slate-400'}`}>
                        <Search size={16} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari kelas, peserta..." 
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="pl-11 pr-12 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all shadow-sm outline-none placeholder:text-slate-400 placeholder:font-medium"
                    />
                    {/* Hotkey Hint */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className={`text-[10px] font-black border px-1.5 py-0.5 rounded-lg shadow-sm transition-colors ${isSearchFocused ? 'bg-blue-900 text-white border-blue-900' : 'text-slate-400 border-slate-200 bg-white'}`}>
                            ⌘K
                        </span>
                    </div>
                </motion.div>

                {/* Garis Pembatas */}
                <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1"></div>

                {/* --- User Dropdown Profile --- */}
                <div className="relative">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 shadow-sm rounded-full hover:border-blue-900/30 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-950/10 group"
                    >
                        {/* Avatar Area with Fallback */}
                        <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white font-black text-sm shadow-inner overflow-hidden border border-slate-100 group-hover:border-blue-200 transition-colors shrink-0">
                            {photoUrl && !imageError ? (
                                <img 
                                    src={photoUrl} 
                                    alt={user?.name || 'User'} 
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)} 
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                            )}
                        </div>

                        <div className="hidden sm:flex flex-col items-start">
                            <span className="text-sm font-black text-slate-800 leading-none group-hover:text-blue-950 transition-colors">
                                {user?.name || 'Administrator'}
                            </span>
                            <span className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest mt-1 bg-blue-50 px-1.5 py-0.5 rounded-md">
                                Admin
                            </span>
                        </div>
                    </motion.button>

                    {/* Dropdown Menu (Navy Touch) */}
                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)}></div>
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-blue-950/10 border border-slate-100 py-2 z-40 overflow-hidden"
                                >
                                    {/* User Info Header in Dropdown */}
                                    <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                                        <p className="text-sm font-black text-blue-950">{user?.name}</p>
                                        <p className="text-xs font-bold text-slate-400 truncate mt-0.5">{user?.email}</p>
                                    </div>
                                    
                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link 
                                            href={route('profile.edit')} 
                                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-950 transition-colors"
                                        >
                                            <UserIcon size={16} /> Profil Saya
                                        </Link>
                                    </div>
                                    
                                    {/* Logout Area */}
                                    <div className="border-t border-slate-100 pt-2 pb-1">
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-black text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        >
                                            <LogOut size={16} strokeWidth={2.5} /> Keluar
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