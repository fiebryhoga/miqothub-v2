// resources/js/Components/Member/Navbar.jsx
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';

export default function Navbar({ user, onMenuClick }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick} 
                    className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                >
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
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                        className="flex items-center gap-2 p-1.5 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <span className="hidden sm:block text-sm font-bold text-gray-700">
                            {user.name.split(' ')[0]}
                        </span>
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                                >
                                    <Link href={route('profile.edit')} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                        <User size={18} /> Profil Saya
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <Link href={route('logout')} method="post" as="button" className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                        <LogOut size={18} /> Keluar
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}