import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, BookOpen, Settings, X, ShieldCheck } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
    // Menu Admin
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, route: 'dashboard', active: route().current('dashboard') },
        { name: 'Manajemen Admin', icon: <ShieldCheck size={20} />, route: 'admin.management.index', active: route().current('admin.management.*') },
        { name: 'Manejemen Member', icon: <Users size={20} />, route: 'admin.members.index', active: route().current('admin.members.*') },
        { name: 'Manajemen Kelas', icon: <BookOpen size={20} />, route: 'admin.courses.index', active: route().current('admin.courses.*') },
        { name: 'Konfigurasi', icon: <Settings size={20} />, route: 'admin.settings.index', active: route().current('admin.settings.*') },
    ];

    return (
        <>
            {/* Overlay untuk mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar Tema Terang (Aksen Indigo) */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-indigo-700">
                        <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg text-white shadow-md shadow-indigo-500/20">
                            <BookOpen size={20} strokeWidth={3} />
                        </div>
                        Miqot<span className="text-slate-900">Admin</span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Navigasi */}
                <nav className="p-4 space-y-1.5 mt-4">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
                    
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.route === '#' ? '#' : route(item.route)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group font-bold text-sm ${
                                item.active 
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                            }`}
                        >
                            {/* Warna icon menyesuaikan status aktif/tidak */}
                            <span className={`${item.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}