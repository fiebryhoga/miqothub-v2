import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { 
    CheckCircle, XCircle, Trash2, Eye, ShieldAlert, Edit, X, 
    Clock, AlertTriangle, Plus, UserPlus, BookOpen, Search, Users, UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

// Import Partials
import ConfirmModal from './Partials/ConfirmModal';
import ViewMemberModal from './Partials/ViewMemberModal';
import EnrollmentModal from './Partials/EnrollmentModal';

export default function Index({ auth, members, allCourses }) {
    const { flash = {} } = usePage().props;
    
    // State Navigasi & Search
    const [activeTab, setActiveTab] = useState('aktif'); // Tab Utama: Aktif
    const [searchQuery, setSearchQuery] = useState('');
    
    // State Modals
    const [viewModal, setViewModal] = useState({ isOpen: false, member: null });
    const [editModal, setEditModal] = useState({ isOpen: false, member: null });
    const [createModal, setCreateModal] = useState(false);
    const [enrollModal, setEnrollModal] = useState({ isOpen: false, member: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null, title: '', message: '', icon: null, color: '' });
    
    const [processingAction, setProcessingAction] = useState(false);
    const [verifyCourseIds, setVerifyCourseIds] = useState([]);

    // Forms
    const { data, setData, put, processing: processingEdit, clearErrors } = useForm({
        name: '', email: '', pekerjaan: '', umur: '', alamat: '', status: '', status_akun: ''
    });

    const formCreate = useForm({
        name: '', email: '', password: '', password_confirmation: '', 
        pekerjaan: '', umur: '', alamat: '', status: '', status_akun: 'aktif'
    });

    // --- LOGIKA FILTER DATA ---
    const filteredMembers = useMemo(() => {
        // 1. Pisahkan berdasarkan Tab
        const tabFiltered = members.filter(m => {
            // Cek apakah member punya transaksi yang masih pending
            const hasPendingTransaction = m.transactions?.some(t => t.status === 'pending');
            
            if (activeTab === 'pending') {
                // Masuk Tab Menunggu JIKA: Akunnya pending ATAU Punya transaksi kelas baru yg pending
                return m.status_akun === 'pending' || hasPendingTransaction;
            } else {
                // Masuk Tab Aktif JIKA: Akun aktif DAN Tidak punya transaksi yg pending
                return m.status_akun !== 'pending' && !hasPendingTransaction;
            }
        });

        // 2. Filter berdasarkan Search Query
        if (!searchQuery) return tabFiltered;
        return tabFiltered.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [members, activeTab, searchQuery]);

    // Perbaiki juga angka Counter di tombol Tab
    const pendingCount = members.filter(m => m.status_akun === 'pending' || m.transactions?.some(t => t.status === 'pending')).length;
    const activeCount = members.length - pendingCount;

    // --- UTILITIES ---
    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    
    const getExpiryDate = (verifiedDateString) => {
        const date = new Date(verifiedDateString);
        date.setFullYear(date.getFullYear() + 1); 
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // --- HANDLERS ---
    const triggerConfirm = (type, member) => {
        let config = {};
        if (type === 'verify') {
            const pendingTrx = member.transactions?.find(t => t.status === 'pending');
            const initialCourses = pendingTrx?.courses.map(c => c.id) || [];
            setVerifyCourseIds(initialCourses);
            config = { title: 'Verifikasi Member', message: `Verifikasi pembayaran dan aktifkan akses kelas untuk ${member.name}?`, icon: <CheckCircle size={32} />, color: 'emerald' };
        } else if (type === 'reject') {
            config = { title: 'Tolak Pendaftaran', message: `Tolak pendaftaran ${member.name}? Peserta tidak akan mendapatkan akses.`, icon: <XCircle size={32} />, color: 'amber' };
        } else if (type === 'delete') {
            config = { title: 'Hapus Permanen', message: `Hapus semua data ${member.name} selamanya? Tindakan ini tidak bisa dibatalkan.`, icon: <AlertTriangle size={32} />, color: 'red' };
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

    const openEdit = (member) => {
        clearErrors();
        setData({ name: member.name, email: member.email, pekerjaan: member.pekerjaan || '', umur: member.umur || '', alamat: member.alamat || '', status: member.status || '', status_akun: member.status_akun });
        setEditModal({ isOpen: true, member });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Member" />

            {/* HEADER SECTION */}
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-emerald-500" size={32} /> Manajemen Member
                    </h1>
                    <p className="text-slate-500 mt-1">Kelola akses, verifikasi pembayaran, dan database peserta pelatihan.</p>
                </div>
                <button onClick={() => setCreateModal(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 active:scale-95 shrink-0">
                    <UserPlus size={20} /> Tambah Member Manual
                </button>
            </div>

            {/* TABS & SEARCH BAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full md:w-auto relative">
                    <button onClick={() => setActiveTab('aktif')} className={`relative flex-1 md:flex-none px-8 py-2.5 text-sm font-bold rounded-xl transition-all z-10 flex items-center gap-2 ${activeTab === 'aktif' ? 'text-emerald-900' : 'text-slate-500'}`}>
                        {activeTab === 'aktif' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100 z-[-1]" />}
                        <UserCheck size={18} /> Member Aktif <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>{activeCount}</span>
                    </button>
                    <button onClick={() => setActiveTab('pending')} className={`relative flex-1 md:flex-none px-8 py-2.5 text-sm font-bold rounded-xl transition-all z-10 flex items-center gap-2 ${activeTab === 'pending' ? 'text-amber-900' : 'text-slate-500'}`}>
                        {activeTab === 'pending' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100 z-[-1]" />}
                        <Clock size={18} /> Menunggu <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>{pendingCount}</span>
                    </button>
                </div>

                <div className="relative w-full md:w-72">
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
                                <th className="p-6">Akses Kelas</th>
                                {activeTab === 'aktif' ? <th className="p-6">Status / Masa Aktif</th> : <th className="p-6 text-center">Info Pembayaran</th>}
                                <th className="p-6 text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMembers.map((member, index) => {
                                const activeCourses = [];
                                member.transactions?.filter(t => t.status === 'verified').forEach(t => {
                                    t.courses?.forEach(c => activeCourses.push({...c, enrollment_date: t.updated_at}));
                                });
                                
                                return (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-black text-lg shadow-sm border border-white group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-300">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{member.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {activeCourses.length > 0 ? (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{activeCourses[0].nama}</p>
                                                    {activeCourses.length > 1 && (
                                                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-tighter">
                                                            + {activeCourses.length - 1} Kelas Lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-300 italic">Tidak ada akses kelas</span>
                                            )}
                                        </td>
                                        {activeTab === 'aktif' ? (
                                            <td className="p-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`w-fit px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${member.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                        {member.status_akun}
                                                    </span>
                                                    {activeCourses.length > 0 && (
                                                        <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                                                            <Clock size={12} className="text-amber-500" /> Cek detail akses
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="p-6 text-center">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                                                    <Clock size={14} className="animate-pulse" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-[10px]">Menunggu Cek</span>
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <button onClick={() => setViewModal({ isOpen: true, member })} title="Lihat Detail" className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-200 rounded-xl transition-all"><Eye size={18} /></button>
                                                
                                                {activeTab === 'aktif' ? (
                                                    <>
                                                        <button onClick={() => setEnrollModal({ isOpen: true, member })} title="Kelola Akses Kelas" className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"><BookOpen size={18} /></button>
                                                        <button onClick={() => openEdit(member)} title="Edit Profil" className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm border border-blue-100"><Edit size={18} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => triggerConfirm('verify', member)} title="Terima & Aktifkan" className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"><CheckCircle size={18} /></button>
                                                        <button onClick={() => triggerConfirm('reject', member)} title="Tolak & Hapus" className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm border border-amber-100"><XCircle size={18} /></button>
                                                    </>
                                                )}
                                                <button onClick={() => triggerConfirm('delete', member)} title="Hapus Permanen" className="p-2.5 text-rose-300 hover:text-white hover:bg-rose-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Users size={48} className="text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold italic text-sm">Tidak ditemukan data member dalam kategori ini.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- SEMUA MODALS --- */}
            
            <ViewMemberModal isOpen={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, member: null })} member={viewModal.member} />
            
            <EnrollmentModal isOpen={enrollModal.isOpen} onClose={() => setEnrollModal({ isOpen: false, member: null })} member={enrollModal.member} allCourses={allCourses} />

            <ConfirmModal 
                isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
                onConfirm={executeAction} title={confirmModal.title} message={confirmModal.message} 
                icon={confirmModal.icon} color={confirmModal.color} isProcessing={processingAction}
            >
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

            {/* MODAL: TAMBAH MEMBER MANUAL */}
            <AnimatePresence>
                {createModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCreateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3"><UserPlus className="text-emerald-500" /> Registrasi Member Manual</h2>
                                <button onClick={() => setCreateModal(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><X size={24} /></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); formCreate.post(route('admin.members.store'), { onSuccess: () => { setCreateModal(false); formCreate.reset(); } }); }} className="p-8 space-y-5 overflow-y-auto scrollbar-thin">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Nama Lengkap Sesuai KTP</label>
                                        <input type="text" value={formCreate.data.name} onChange={e => formCreate.setData('name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" placeholder="Contoh: Ahmad Hidayat" required />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email Aktif</label>
                                        <input type="email" value={formCreate.data.email} onChange={e => formCreate.setData('email', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" placeholder="email@contoh.com" required />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Password Akun</label>
                                        <input type="password" value={formCreate.data.password} onChange={e => formCreate.setData('password', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" required />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Pekerjaan</label>
                                        <input type="text" value={formCreate.data.pekerjaan} onChange={e => formCreate.setData('pekerjaan', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Umur</label>
                                            <input type="number" value={formCreate.data.umur} onChange={e => formCreate.setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Status</label>
                                            <select value={formCreate.data.status} onChange={e => formCreate.setData('status', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm font-medium shadow-sm transition-all">
                                                <option value="">Pilih...</option><option value="menikah">Menikah</option><option value="belum">Belum</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Alamat Lengkap Domisili</label>
                                        <textarea value={formCreate.data.alamat} onChange={e => formCreate.setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 py-3 text-sm font-medium shadow-sm transition-all"></textarea>
                                    </div>
                                </div>
                                <div className="mt-4 pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                    <button type="button" onClick={() => setCreateModal(false)} className="px-6 py-3 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Batal</button>
                                    <button type="submit" disabled={formCreate.processing} className="px-8 py-3 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
                                        {formCreate.processing ? 'Menyimpan...' : 'Simpan Member Baru'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: EDIT DATA MEMBER */}
            <AnimatePresence>
                {editModal.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModal({ isOpen: false, member: null })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3"><Edit className="text-blue-500" /> Perbarui Profil Member</h2>
                                <button onClick={() => setEditModal({ isOpen: false, member: null })} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><X size={24} /></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); put(route('admin.members.update', editModal.member.id), { onSuccess: () => setEditModal({ isOpen: false, member: null }) }); }} className="p-8 space-y-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nama Lengkap</label><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" required /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Status Akun</label><select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className={`w-full rounded-xl border py-3 text-sm font-black uppercase ${data.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}><option value="aktif">AKTIF</option><option value="suspen">SUSPEN</option><option value="pending">PENDING</option></select></div>
                                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Umur</label><input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 text-sm font-medium" /></div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button type="button" onClick={() => setEditModal({ isOpen: false, member: null })} className="px-6 py-3 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Batal</button>
                                    <button type="submit" disabled={processingEdit} className="px-8 py-3 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Simpan Perubahan</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AdminLayout>
    );
}