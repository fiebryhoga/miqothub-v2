// resources/js/Layouts/MemberLayout.jsx
import { useState } from 'react';
import Sidebar from '@/Components/Member/Sidebar';
import Navbar from '@/Components/Member/Navbar';

export default function MemberLayout({ user, children }) {
    // State untuk mengontrol Sidebar versi Mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
            
            
            <Sidebar 
                user={user} 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
            />

            
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                
                
                <Navbar 
                    user={user} 
                    onMenuClick={() => setIsMobileMenuOpen(true)} 
                />

                
                <main className="p-4 sm:p-8 flex-1">
                    {children}
                </main>
            </div>

        </div>
    );
}