import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, Bell, User as UserIcon, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ user, onMenuClick }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imageError, setImageError] = useState(false); // State fallback foto profil

    // Fungsi cerdas untuk menangkap URL foto profil
    const getAvatarUrl = () => {
        const photoPath = user?.foto_profile || user?.avatar || user?.profile_photo_path || user?.profile_photo_url || user?.photo;
        
        if (!photoPath) return null;
        if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
        if (photoPath.startsWith('/storage/')) return photoPath;
        return `/storage/${photoPath}`;
    };

    const photoUrl = getAvatarUrl();

    return (
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm">
            
            <div className="flex items-center gap-4 sm:gap-6">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMenuClick} 
                    className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm"
                >
                    <Menu size={22} />
                </motion.button>

                
                <div className="hidden sm:block">
                    <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                        <Sparkles size={18} className="text-blu-800" /> Ruang Belajar
                    </h2>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">Lanjutkan progres belajar Anda hari ini</p>
                </div>
            </div>

            
            <div className="flex items-center gap-3 sm:gap-5">
                
                

                
                <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1"></div>

                
                <div className="relative">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                        className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 shadow-sm rounded-full hover:border-emerald-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 group"
                    >
                        
                        <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-black text-sm shadow-inner overflow-hidden border border-emerald-100 group-hover:border-emerald-300 transition-colors shrink-0">
                            {photoUrl && !imageError ? (
                                <img 
                                    src={photoUrl} 
                                    alt={user?.name || 'Member'} 
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || 'M'}</span>
                            )}
                        </div>
                        
                        
                        <div className="hidden sm:flex flex-col items-start">
                            <span className="text-sm font-black text-slate-800 leading-none group-hover:text-emerald-700 transition-colors">
                                {user?.name?.split(' ')[0] || 'Member'}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100/50">
                                Pelajar
                            </span>
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }} 
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-emerald-900/10 border border-slate-100 py-2 z-50 overflow-hidden"
                                >
                                    
                                    <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white">
                                        <p className="text-sm font-black text-emerald-950">{user?.name}</p>
                                        <p className="text-xs font-bold text-slate-400 truncate mt-0.5">{user?.email}</p>
                                    </div>

                                    
                                    <div className="py-2">
                                        <Link href={route('profile.edit')} className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                                            <UserIcon size={16} /> Profil Saya
                                        </Link>
                                    </div>
                                    
                                    
                                    <div className="border-t border-slate-100 pt-2 pb-1">
                                        <Link href={route('logout')} method="post" as="button" className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-black text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
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