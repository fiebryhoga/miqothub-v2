import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, Trash2, Eye, ShieldAlert, Edit, X, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ConfirmModal from './Partials/ConfirmModal';
import ViewMemberModal from './Partials/ViewMemberModal';

export default function Index({ auth, members, allCourses }) {
    const { flash = {} } = usePage().props;
    
    // State Navigasi & Modal Utama
    const [activeTab, setActiveTab] = useState('pending');
    const [viewModal, setViewModal] = useState({ isOpen: false, member: null });
    const [editModal, setEditModal] = useState({ isOpen: false, member: null });
    
    // State Modal Konfirmasi
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null, title: '', message: '', icon: null, color: '' });
    const [processingAction, setProcessingAction] = useState(false);
    
    // State Khusus untuk Checkbox Kelas di Modal Verifikasi
    const [verifyCourseIds, setVerifyCourseIds] = useState([]);

    // Form setup untuk Edit Member (Identitas dasar)
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: '', email: '', pekerjaan: '', umur: '', alamat: '', status: '', status_akun: ''
    });

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    
    const getExpiryDate = (verifiedDateString) => {
        const date = new Date(verifiedDateString);
        date.setFullYear(date.getFullYear() + 1); 
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Filter Data berdasarkan Tab
    const pendingMembers = members.filter(m => m.status_akun === 'pending');
    const activeMembers = members.filter(m => m.status_akun !== 'pending'); 
    const displayedMembers = activeTab === 'pending' ? pendingMembers : activeMembers;

    // --- LOGIKA TRIGGER KONFIRMASI ---
    const triggerConfirm = (type, member) => {
        let config = {};
        if (type === 'verify') {
            // Saat klik verify, ambil array ID kelas yang member pilih saat daftar, simpan ke state verifyCourseIds
            const initialCourses = member.transactions[0]?.courses.map(c => c.id) || [];
            setVerifyCourseIds(initialCourses);
            
            config = { 
                title: 'Verifikasi & Atur Kelas', 
                message: `Pilih/sesuaikan kelas untuk ${member.name} sebelum mengaktifkan akun.`, 
                icon: <CheckCircle size={32} />, 
                color: 'emerald' 
            };
        } else if (type === 'reject') {
            config = { title: 'Tolak & Tangguhkan', message: `Tolak pembayaran ini dan blokir akun ${member.name}? Peserta tidak akan bisa login.`, icon: <XCircle size={32} />, color: 'amber' };
        } else if (type === 'delete') {
            config = { title: 'Hapus Permanen', message: `Hapus semua data ${member.name} selamanya? Tindakan ini tidak bisa dibatalkan.`, icon: <AlertTriangle size={32} />, color: 'red' };
        }
        
        setConfirmModal({ isOpen: true, type, id: member.id, ...config });
    };

    // --- LOGIKA TOGGLE CHECKBOX KELAS DI MODAL ---
    const toggleVerifyCourse = (courseId) => {
        if (verifyCourseIds.includes(courseId)) {
            setVerifyCourseIds(verifyCourseIds.filter(id => id !== courseId));
        } else {
            setVerifyCourseIds([...verifyCourseIds, courseId]);
        }
    };

    // --- LOGIKA EKSEKUSI AKSI ---
    const executeAction = () => {
        setProcessingAction(true);
        const { type, id } = confirmModal;
        
        if (type === 'verify') {
            // Kirim array course_ids yang sudah disesuaikan admin ke backend
            router.put(route('admin.members.verify', id), { course_ids: verifyCourseIds }, { 
                onSuccess: () => { setConfirmModal({ ...confirmModal, isOpen: false }); setProcessingAction(false); },
                onError: () => setProcessingAction(false)
            });
        } 
        else if (type === 'reject') {
            router.put(route('admin.members.reject', id), {}, { 
                onSuccess: () => { setConfirmModal({ ...confirmModal, isOpen: false }); setProcessingAction(false); } 
            });
        } 
        else if (type === 'delete') {
            router.delete(route('admin.members.destroy', id), { 
                onSuccess: () => { setConfirmModal({ ...confirmModal, isOpen: false }); setProcessingAction(false); } 
            });
        }
    };

    // --- LOGIKA MODAL EDIT ---
    const openEdit = (member) => {
        clearErrors();
        setData({ 
            name: member.name, email: member.email, pekerjaan: member.pekerjaan || '', 
            umur: member.umur || '', alamat: member.alamat || '', 
            status: member.status || '', status_akun: member.status_akun 
        });
        setEditModal({ isOpen: true, member });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('admin.members.update', editModal.member.id), { 
            onSuccess: () => setEditModal({ isOpen: false, member: null }) 
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Member" />

            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Member</h1>
                    <p className="text-gray-500 mt-1 text-sm">Kelola verifikasi pembayaran, data diri, dan masa aktif peserta.</p>
                </div>
                <div className="flex bg-gray-200/60 p-1 rounded-xl w-full md:w-auto relative">
                    {['pending', 'aktif'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all z-10 ${activeTab === tab ? 'text-emerald-800' : 'text-gray-500 hover:text-gray-700'}`}>
                            {activeTab === tab && <motion.div layoutId="activeTabIndicator" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-100 z-[-1]" />}
                            {tab === 'pending' ? `Menunggu (${pendingMembers.length})` : `Member Aktif (${activeMembers.length})`}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center gap-3 shadow-sm">
                        <ShieldAlert size={16} /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TABEL DATA */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-5 font-semibold">Identitas</th>
                                <th className="p-5 font-semibold">Program Kelas</th>
                                {activeTab === 'aktif' ? <th className="p-5 font-semibold">Masa Aktif</th> : <th className="p-5 font-semibold text-center">Status</th>}
                                <th className="p-5 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {displayedMembers.map((member, index) => {
                                const transaction = member.transactions[0]; 
                                // Karena sekarang bisa banyak kelas, kita tampilkan info rekap singkat di tabel
                                const courseCount = transaction?.courses?.length || 0;
                                const firstCourse = transaction?.courses[0]; 
                                
                                return (
                                    <motion.tr initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} key={member.id} className="hover:bg-emerald-50/20 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shrink-0">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{member.name}</p>
                                                    <p className="text-xs text-gray-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {courseCount > 0 ? (
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-700 max-w-[200px] truncate">
                                                        {courseCount > 1 ? `${courseCount} Kelas Dipilih` : firstCourse.nama}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-500">{transaction.kode_transaksi} • {formatRupiah(transaction.total_harga)}</p>
                                                </div>
                                            ) : <span className="text-xs text-gray-400 italic">Belum daftar kelas</span>}
                                        </td>
                                        {activeTab === 'aktif' ? (
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center justify-center gap-1 w-fit px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${member.status_akun === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {member.status_akun}
                                                    </span>
                                                    {member.status_akun === 'aktif' && transaction?.status === 'verified' && (
                                                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                                                            <Clock size={12} className="text-amber-500" /> S/d {getExpiryDate(transaction.updated_at)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="p-5 text-center">
                                                <span className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 shadow-sm border border-amber-200/50">
                                                    Perlu Dicek
                                                </span>
                                            </td>
                                        )}
                                        <td className="p-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setViewModal({ isOpen: true, member })} title="Detail Lengkap" className="p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-all"><Eye size={18} /></button>
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <button onClick={() => triggerConfirm('verify', member)} title="Terima & Aktifkan" className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"><CheckCircle size={18} /></button>
                                                        <button onClick={() => triggerConfirm('reject', member)} title="Tolak Pendaftaran" className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm border border-amber-100"><XCircle size={18} /></button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => openEdit(member)} title="Edit Identitas" className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"><Edit size={18} /></button>
                                                )}
                                                <button onClick={() => triggerConfirm('delete', member)} title="Hapus Permanen" className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {displayedMembers.length === 0 && <tr><td colSpan="4" className="text-center py-12 text-gray-400 italic">Belum ada data di kategori ini.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PANGGIL KOMPONEN PARTIALS (VIEW & CONFIRM) */}
            <ViewMemberModal isOpen={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, member: null })} member={viewModal.member} />
            
            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
                onConfirm={executeAction} 
                title={confirmModal.title} 
                message={confirmModal.message} 
                icon={confirmModal.icon} 
                color={confirmModal.color}
                isProcessing={processingAction}
            >
                {/* INJECTION: Tampilkan List Checkbox Kelas HANYA saat Konfirmasi Verifikasi */}
                {confirmModal.type === 'verify' && allCourses && (
                    <div className="space-y-2 border-y border-gray-100 py-3 mt-2 max-h-48 overflow-y-auto">
                        <p className="text-xs font-bold text-gray-400 mb-2 px-1">Daftar Kelas (Bisa Disesuaikan)</p>
                        {allCourses.map(course => (
                            <label key={course.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${verifyCourseIds.includes(course.id) ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={verifyCourseIds.includes(course.id)} 
                                    onChange={() => toggleVerifyCourse(course.id)}
                                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <p className={`text-sm font-bold leading-tight ${verifyCourseIds.includes(course.id) ? 'text-emerald-800' : 'text-gray-700'}`}>{course.nama}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Batch {course.batch} • {formatRupiah(course.harga)}</p>
                                </div>
                            </label>
                        ))}
                        {verifyCourseIds.length === 0 && <p className="text-xs text-red-500 mt-2 font-medium">Pilih minimal 1 kelas untuk diverifikasi.</p>}
                    </div>
                )}
            </ConfirmModal>

            {/* MODAL EDIT MEMBER (IDENTITAS) */}
            <AnimatePresence>
                {editModal.isOpen && editModal.member && (
                    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModal({ isOpen: false, member: null })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900">Edit Data Member</h2>
                                <button onClick={() => setEditModal({ isOpen: false, member: null })} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={submitEdit} className="p-6 space-y-4">
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm" required /></div>
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Email Aktif</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm" required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-semibold text-gray-700 mb-1">Pekerjaan</label><input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm" /></div>
                                    <div><label className="block text-xs font-semibold text-gray-700 mb-1">Status Kawin</label><select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm cursor-pointer"><option value="menikah">Menikah</option><option value="belum">Belum Menikah</option></select></div>
                                </div>
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Lengkap</label><textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 py-2.5 text-sm"></textarea></div>
                                <div><label className="block text-xs font-semibold text-gray-700 mb-1">Status Akun</label><select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className={`w-full rounded-xl border border-gray-200 focus:ring-2 py-2.5 text-sm font-bold cursor-pointer ${data.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-700 focus:border-emerald-500' : 'bg-red-50 text-red-700 focus:border-red-500'}`}><option value="aktif">Aktif (Bisa Login)</option><option value="suspen">Suspen (Blokir)</option><option value="pending">Pending</option></select></div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <button type="button" onClick={() => setEditModal({ isOpen: false, member: null })} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Batal</button>
                                    <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}