import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { 
    CheckCircle, XCircle, Trash2, Eye, ShieldAlert, Edit, 
    Clock, AlertTriangle, UserPlus, BookOpen, Search, Users, 
    UserCheck, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

// Import Semua Partials
import ConfirmModal from './Partials/ConfirmModal';
import ViewMemberModal from './Partials/ViewMemberModal';
import EnrollmentModal from './Partials/EnrollmentModal';
import CreateMemberModal from './Partials/CreateMemberModal'; // <-- Partial Baru
import EditMemberModal from './Partials/EditMemberModal';     // <-- Partial Baru

export default function Index({ auth, members, allCourses }) {
    const { flash = {} } = usePage().props;
    
    // State Navigasi & Search
    const [activeTab, setActiveTab] = useState('aktif'); 
    const [searchQuery, setSearchQuery] = useState('');
    
    // State Modals
    const [viewModal, setViewModal] = useState({ isOpen: false, member: null });
    const [editModal, setEditModal] = useState({ isOpen: false, member: null });
    const [createModal, setCreateModal] = useState(false);
    const [enrollModal, setEnrollModal] = useState({ isOpen: false, member: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null, title: '', message: '', icon: null, color: '' });
    
    const [processingAction, setProcessingAction] = useState(false);
    const [verifyCourseIds, setVerifyCourseIds] = useState([]);

    // --- LOGIKA FILTER DATA UNTUK 3 TAB ---
    const filteredMembers = useMemo(() => {
        const tabFiltered = members.filter(m => {
            const hasPendingTransaction = m.transactions?.some(t => t.status === 'pending');
            
            if (activeTab === 'aktif') return m.status_akun === 'aktif'; 
            if (activeTab === 'registrasi') return m.status_akun === 'pending'; 
            if (activeTab === 'pembelian') return m.status_akun === 'aktif' && hasPendingTransaction; 
            return false;
        });

        if (!searchQuery) return tabFiltered;
        return tabFiltered.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [members, activeTab, searchQuery]);

    // Counter Notifikasi Tab
    const activeCount = members.filter(m => m.status_akun === 'aktif').length;
    const registrasiCount = members.filter(m => m.status_akun === 'pending').length;
    const pembelianCount = members.filter(m => m.status_akun === 'aktif' && m.transactions?.some(t => t.status === 'pending')).length;

    // --- UTILITIES ---
    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // --- HANDLERS ---
    const triggerConfirm = (type, member) => {
        let config = {};
        if (type === 'verify') {
            const pendingTrx = member.transactions?.find(t => t.status === 'pending');
            const initialCourses = pendingTrx?.courses.map(c => c.id) || [];
            setVerifyCourseIds(initialCourses);
            
            const isNewAccount = member.status_akun === 'pending';
            config = { 
                title: isNewAccount ? 'Terima Pendaftaran Baru' : 'Konfirmasi Pembelian Paket', 
                message: isNewAccount 
                    ? `Verifikasi pembayaran dan aktifkan akun untuk ${member.name}?` 
                    : `Setujui pengajuan penambahan kelas untuk member aktif ${member.name}?`, 
                icon: <CheckCircle size={32} />, color: 'emerald' 
            };
        } else if (type === 'reject') {
            const isNewAccount = member.status_akun === 'pending';
            config = { 
                title: isNewAccount ? 'Tolak Pendaftaran' : 'Tolak Pembelian', 
                message: isNewAccount
                    ? `Tolak pendaftaran ${member.name}? Akun tidak akan diaktifkan.`
                    : `Tolak pengajuan pembelian kelas ini? (Akun member tetap aktif).`, 
                icon: <XCircle size={32} />, color: 'amber' 
            };
        } else if (type === 'delete') {
            config = { title: 'Hapus Permanen', message: `Hapus semua data ${member.name}? Tindakan ini tidak bisa dibatalkan.`, icon: <AlertTriangle size={32} />, color: 'red' };
        }
        setConfirmModal({ isOpen: true, type, id: member.id, ...config });
    };

    const executeAction = () => {
        setProcessingAction(true);
        const { type, id } = confirmModal;
        const options = { 
            onSuccess: () => { setConfirmModal({ ...confirmModal, isOpen: false }); setProcessingAction(false); },
            onError: () => setProcessingAction(false)
        };
        
        if (type === 'verify') router.put(route('admin.members.verify', id), { course_ids: verifyCourseIds }, options);
        else if (type === 'reject') router.put(route('admin.members.reject', id), {}, options);
        else if (type === 'delete') router.delete(route('admin.members.destroy', id), options);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Member" />

            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-emerald-500" size={32} /> Manajemen Member
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola data peserta, verifikasi pendaftaran baru, dan pembelian paket.</p>
                </div>
                <button onClick={() => setCreateModal(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg active:scale-95 shrink-0">
                    <UserPlus size={20} /> Tambah Member Manual
                </button>
            </div>

            {/* TABS & SEARCH BAR */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full xl:w-auto relative overflow-x-auto scrollbar-thin">
                    <button onClick={() => setActiveTab('aktif')} className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-xl transition-all z-10 flex items-center gap-2 ${activeTab === 'aktif' ? 'text-emerald-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'aktif' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100 z-[-1]" />}
                        <UserCheck size={18} /> Member Aktif 
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>{activeCount}</span>
                    </button>
                    <button onClick={() => setActiveTab('registrasi')} className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-xl transition-all z-10 flex items-center gap-2 ${activeTab === 'registrasi' ? 'text-amber-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'registrasi' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100 z-[-1]" />}
                        <UserPlus size={18} /> Registrasi Baru 
                        {registrasiCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'registrasi' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>{registrasiCount}</span>
                    </button>
                    <button onClick={() => setActiveTab('pembelian')} className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-xl transition-all z-10 flex items-center gap-2 ${activeTab === 'pembelian' ? 'text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'pembelian' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100 z-[-1]" />}
                        <ShoppingCart size={18} /> Pembelian Paket
                        {pembelianCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'pembelian' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{pembelianCount}</span>
                    </button>
                </div>

                <div className="relative w-full xl:w-72 shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" placeholder="Cari nama atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border-slate-200 rounded-2xl text-sm focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                    />
                </div>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center gap-3">
                        <ShieldAlert size={20} /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-widest font-black">
                                <th className="p-6">Identitas Peserta</th>
                                {activeTab === 'aktif' && <><th className="p-6">Akses Kelas Dimiliki</th><th className="p-6">Status / Masa Aktif</th></>}
                                {activeTab === 'registrasi' && <><th className="p-6">Kelas Dipilih</th><th className="p-6 text-center">Status Pendaftaran</th></>}
                                {activeTab === 'pembelian' && <><th className="p-6">Pengajuan Kelas Baru</th><th className="p-6 text-center">Info Tagihan</th></>}
                                <th className="p-6 text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMembers.map((member, index) => {
                                const activeCourses = [];
                                member.transactions?.filter(t => t.status === 'verified').forEach(t => t.courses?.forEach(c => activeCourses.push({...c})));
                                const pendingTrx = member.transactions?.find(t => t.status === 'pending');
                                const pendingCourses = pendingTrx?.courses || [];
                                
                                return (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                {/* 👇 PERBAIKAN: Cek apakah punya foto profil 👇 */}
                                                {member.foto_profile ? (
                                                    <img 
                                                        src={`/storage/${member.foto_profile}`} 
                                                        alt={member.name} 
                                                        className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-200" 
                                                    />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-white transition-all duration-300 ${activeTab === 'aktif' ? 'bg-emerald-50 text-emerald-600' : activeTab === 'registrasi' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                                
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{member.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* KOLOM DINAMIS */}
                                        {activeTab === 'aktif' && (
                                            <>
                                                <td className="p-6">
                                                    {activeCourses.length > 0 ? (
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{activeCourses[0].nama}</p>
                                                            {activeCourses.length > 1 && <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg uppercase">+ {activeCourses.length - 1} Kelas Lainnya</span>}
                                                        </div>
                                                    ) : <span className="text-xs font-bold text-slate-300 italic">Tidak ada akses kelas</span>}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="w-fit px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-100">AKTIF</span>
                                                        {activeCourses.length > 0 && <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5"><Clock size={12} className="text-emerald-400" /> Cek di Kelola Akses</span>}
                                                    </div>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'registrasi' && (
                                            <>
                                                <td className="p-6">
                                                    {pendingCourses.length > 0 ? (
                                                        <div className="space-y-1"><p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{pendingCourses[0].nama}</p>{pendingCourses.length > 1 && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">+{pendingCourses.length - 1} lainnya</span>}</div>
                                                    ) : <span className="text-xs text-slate-300 italic">-</span>}
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 shadow-sm"><Clock size={14} className="animate-pulse" /><span className="text-[10px] font-black uppercase tracking-widest">Cek Pembayaran</span></div>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'pembelian' && (
                                            <>
                                                <td className="p-6">
                                                    {pendingCourses.length > 0 && (
                                                        <div className="flex items-center gap-3"><BookOpen className="text-blue-400" size={24} /><div><p className="text-sm font-bold text-blue-900 truncate max-w-[180px]">{pendingCourses[0].nama}</p>{pendingCourses.length > 1 && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded mt-1 inline-block">+{pendingCourses.length - 1} Paket</span>}</div></div>
                                                    )}
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex flex-col items-center gap-1"><p className="text-sm font-black text-slate-800">{formatRupiah(pendingTrx?.total_harga || 0)}</p><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">INV: {pendingTrx?.kode_transaksi.split('-')[1]}</span></div>
                                                </td>
                                            </>
                                        )}

                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <button onClick={() => setViewModal({ isOpen: true, member })} title="Lihat Bukti Pembayaran / Detail" className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-200 rounded-xl transition-all"><Eye size={18} /></button>
                                                
                                                {activeTab === 'aktif' ? (
                                                    <>
                                                        <button onClick={() => setEnrollModal({ isOpen: true, member })} title="Kelola Akses Kelas" className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"><BookOpen size={18} /></button>
                                                        <button onClick={() => setEditModal({ isOpen: true, member })} title="Edit Profil" className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm border border-blue-100"><Edit size={18} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => triggerConfirm('verify', member)} title={activeTab === 'pembelian' ? "Setujui Pembelian Kelas" : "Terima & Aktifkan Akun"} className={`p-2.5 rounded-xl transition-all shadow-sm border ${activeTab === 'pembelian' ? 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border-blue-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-100'}`}><CheckCircle size={18} /></button>
                                                        <button onClick={() => triggerConfirm('reject', member)} title="Tolak" className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm border border-amber-100"><XCircle size={18} /></button>
                                                    </>
                                                )}
                                                {activeTab === 'aktif' && <button onClick={() => triggerConfirm('delete', member)} title="Hapus Permanen" className="p-2.5 text-rose-300 hover:text-white hover:bg-rose-500 rounded-xl transition-all"><Trash2 size={18} /></button>}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filteredMembers.length === 0 && <tr><td colSpan="4" className="p-20 text-center"><Users size={48} className="text-slate-200 mb-4 mx-auto" /><p className="text-slate-400 font-bold italic text-sm">Tidak ditemukan data dalam kategori ini.</p></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KOMPONEN MODAL TERPISAH (PARTIALS) */}
            <ViewMemberModal isOpen={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, member: null })} member={viewModal.member} />
            <EnrollmentModal 
                isOpen={enrollModal.isOpen} 
                onClose={() => setEnrollModal({ isOpen: false, member: null })} 
                member={members.find(m => m.id === enrollModal.member?.id) || enrollModal.member} 
                allCourses={allCourses} 
            />
            <CreateMemberModal isOpen={createModal} onClose={() => setCreateModal(false)} />
            <EditMemberModal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, member: null })} member={editModal.member} />

            <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={executeAction} title={confirmModal.title} message={confirmModal.message} icon={confirmModal.icon} color={confirmModal.color} isProcessing={processingAction}>
                {confirmModal.type === 'verify' && (
                    <div className="space-y-2 border-y border-slate-100 py-4 mt-2 max-h-48 overflow-y-auto scrollbar-thin">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Konfirmasi Akses Kelas</p>
                        {allCourses.map(course => (
                            <label key={course.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${verifyCourseIds.includes(course.id) ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                                <input type="checkbox" checked={verifyCourseIds.includes(course.id)} onChange={() => {
                                    setVerifyCourseIds(prev => prev.includes(course.id) ? prev.filter(id => id !== course.id) : [...prev, course.id]);
                                }} className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"/>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold leading-tight ${verifyCourseIds.includes(course.id) ? 'text-emerald-800' : 'text-slate-700'}`}>{course.nama}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Batch {course.batch} • {formatRupiah(course.harga)}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </ConfirmModal>
        </AdminLayout>
    );
}