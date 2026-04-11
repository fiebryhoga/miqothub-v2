import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, BookOpen, Settings, X, ShieldCheck } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
    // Menu Admin
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, route: 'dashboard', active: route().current('dashboard') },
        { name: 'Manajemen Admin', icon: <Users size={20} />, route: 'admin.management.index', active: route().current('admin.management.*') },
        { name: 'Manejemen Member', icon: <Users size={20} />, route: 'admin.members.index', active: route().current('admin.members.*') },
        { name: 'Manajemen Kelas', icon: <BookOpen size={20} />, route: 'admin.courses.index', active: route().current('admin.courses.*') },
    ];

    return (
        <>
            {/* Overlay untuk mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar Tema Terang */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <ShieldCheck size={24} className="text-emerald-600" />
                        </div>
                        Haji<span className="text-emerald-600">Admin</span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-gray-900 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Navigasi */}
                <nav className="p-4 space-y-2 mt-4">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu Utama</p>
                    
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.route === '#' ? '#' : route(item.route)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                item.active 
                                ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {/* Warna icon menyesuaikan status aktif/tidak */}
                            <span className={`${item.active ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'} transition-colors`}>
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