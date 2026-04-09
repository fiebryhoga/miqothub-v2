import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, User, Heart, Briefcase, MapPin, Receipt, BookOpen, Tag, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ViewMemberModal({ isOpen, onClose, member }) {
    if (!member) return null;

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Ambil data transaksi pertama (karena alur kita 1 member 1 transaksi pendaftaran)
    const transaction = member.transactions && member.transactions.length > 0 ? member.transactions[0] : null;
    const courses = transaction?.courses || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                    
                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl bg-white flex flex-col lg:flex-row max-h-[90vh]"
                    >
                        {/* ======================= */}
                        {/* KIRI: PROFIL IDENTITAS  */}
                        {/* ======================= */}
                        <div className="w-full lg:w-5/12 bg-gray-50 flex flex-col overflow-y-auto scrollbar-thin border-r border-gray-100 shrink-0">
                            <div className="p-8 pb-6 border-b border-gray-200/60 bg-white relative shrink-0">
                                <button onClick={onClose} className="lg:hidden absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={18}/></button>
                                
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{member.name}</h3>
                                        <p className="text-sm font-medium text-emerald-600">{member.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md border flex items-center gap-1 ${member.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : member.status_akun === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        Status Akun: {member.status_akun}
                                    </span>
                                    <span className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-md border border-gray-200 flex items-center gap-1.5">
                                        <CalendarDays size={14}/> Daftar: {formatDate(member.created_at)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8 space-y-6 flex-1">
                                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Informasi Personal</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><User size={14}/> Umur</p>
                                        <p className="font-semibold text-gray-800 bg-white p-2.5 rounded-lg border border-gray-100">{member.umur ? `${member.umur} Tahun` : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Heart size={14}/> Status Kawin</p>
                                        <p className="font-semibold text-gray-800 capitalize bg-white p-2.5 rounded-lg border border-gray-100">{member.status || '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Briefcase size={14}/> Pekerjaan</p>
                                    <p className="font-semibold text-gray-800 bg-white p-2.5 rounded-lg border border-gray-100">{member.pekerjaan || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><MapPin size={14}/> Alamat Domisili</p>
                                    <p className="font-semibold text-gray-800 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 shadow-sm">{member.alamat || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* =============================== */}
                        {/* KANAN: TRANSAKSI & DAFTAR KELAS */}
                        {/* =============================== */}
                        <div className="w-full lg:w-7/12 p-8 relative flex flex-col bg-white overflow-y-auto scrollbar-thin">
                            <button onClick={onClose} className="hidden lg:block absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"><X size={20}/></button>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <Receipt className="text-emerald-500"/> Detail Pendaftaran
                            </h3>

                            {transaction ? (
                                <div className="space-y-6">
                                    
                                    {/* 1. Ringkasan Transaksi */}
                                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                                <Tag size={14} /> Total Tagihan Transaksi
                                            </p>
                                            <p className="text-2xl font-extrabold text-emerald-600">{formatRupiah(transaction.total_harga)}</p>
                                            <p className="text-xs text-emerald-600/80 font-bold mt-1">INV: {transaction.kode_transaksi}</p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status Pembayaran</p>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm border ${
                                                transaction.status === 'verified' ? 'bg-emerald-500 border-emerald-600 text-white' : 
                                                transaction.status === 'pending' ? 'bg-amber-400 border-amber-500 text-white' : 
                                                'bg-red-500 border-red-600 text-white'
                                            }`}>
                                                {transaction.status === 'verified' && <CheckCircle2 size={14} />}
                                                {transaction.status === 'pending' && <Clock size={14} />}
                                                {transaction.status === 'rejected' && <AlertCircle size={14} />}
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. Daftar Kelas yang Dipilih */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <BookOpen size={18} className="text-emerald-500" /> 
                                            Program Kelas yang Dipilih ({courses.length})
                                        </h4>
                                        <div className="space-y-2.5">
                                            {courses.length > 0 ? courses.map(course => (
                                                <div key={course.id} className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center hover:border-emerald-300 transition-colors shadow-sm">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 leading-tight">{course.nama}</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5">Batch {course.batch}</p>
                                                    </div>
                                                    <div className="text-right shrink-0 ml-2">
                                                        <p className="text-sm font-bold text-emerald-600">{formatRupiah(course.harga)}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500 italic">Data kelas tidak ditemukan.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. Bukti Transfer */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Receipt size={18} className="text-emerald-500" /> 
                                            Foto Bukti Transfer
                                        </h4>
                                        <div className="bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden relative group w-full h-64 flex items-center justify-center">
                                            {transaction.bukti_url ? (
                                                <a href={transaction.bukti_url} target="_blank" rel="noopener noreferrer" className="w-full h-full block" title="Klik untuk memperbesar gambar">
                                                    <img src={transaction.bukti_url} alt="Bukti Struk" className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300 cursor-zoom-in" />
                                                </a>
                                            ) : (
                                                <div className="text-gray-400 text-center">
                                                    <Receipt size={32} className="mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm font-medium">Foto bukti tidak ditemukan</p>
                                                </div>
                                            )}
                                        </div>
                                        {transaction.bukti_url && (
                                            <p className="text-[10px] text-gray-400 mt-2 text-center">Klik pada gambar untuk melihat ukuran penuh</p>
                                        )}
                                    </div>

                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 mt-10">
                                    <Receipt size={48} className="mb-4 opacity-20" />
                                    <p className="italic font-medium">Belum ada transaksi pendaftaran.</p>
                                </div>
                            )}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}