import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export default function EnrollmentModal({ isOpen, onClose, member, allCourses }) {
    if (!member) return null;

    const { data, setData, post, processing, reset } = useForm({ course_id: '' });

    // Ekstrak semua kelas yang AKTIF dari semua transaksi member ini
    let activeCourses = [];
    if (member.transactions) {
        member.transactions.forEach(trx => {
            if (trx.status === 'verified' && trx.courses) {
                trx.courses.forEach(course => {
                    // Cek apakah belum ada (hindari duplikat jika anehnya ada 2 transaksi kelas yg sama)
                    if (!activeCourses.find(ac => ac.id === course.id)) {
                        activeCourses.push({ ...course, enrollment_date: trx.updated_at });
                    }
                });
            }
        });
    }

    // Filter course yang belum dimiliki member untuk ditampilkan di Dropdown
    const availableCourses = allCourses.filter(c => !activeCourses.find(ac => ac.id === c.id));

    const handleEnroll = (e) => {
        e.preventDefault();
        post(route('admin.members.enroll', member.id), {
            onSuccess: () => { reset(); }
        });
    };

    const handleUnenroll = (courseId, courseName) => {
        if (confirm(`Yakin ingin mencabut akses member ini dari kelas: ${courseName}?`)) {
            router.delete(route('admin.members.unenroll', { member: member.id, course: courseId }));
        }
    };

    const getExpiryDate = (dateString) => {
        const date = new Date(dateString);
        date.setFullYear(date.getFullYear() + 1); // 1 Tahun dari tanggal enroll
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                    
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><BookOpen size={20} className="text-emerald-500"/> Kelola Akses Kelas</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Atur kelas untuk: <span className="font-bold text-emerald-700">{member.name}</span></p>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={20}/></button>
                        </div>

                        <div className="p-6 overflow-y-auto scrollbar-thin">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Kelas Aktif Saat Ini ({activeCourses.length})</h3>
                            <div className="space-y-3 mb-8">
                                {activeCourses.length === 0 ? (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-sm text-gray-500">Member ini belum memiliki akses ke kelas manapun.</div>
                                ) : (
                                    activeCourses.map(course => (
                                        <div key={course.id} className="flex justify-between items-center p-3 sm:p-4 bg-white border border-emerald-100 rounded-xl shadow-sm hover:border-emerald-300 transition-colors">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{course.nama}</h4>
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">Batch {course.batch}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 mt-1.5">
                                                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12}/> Aktif</span>
                                                    <span className="flex items-center gap-1"><Clock size={12}/> Expired: {getExpiryDate(course.enrollment_date)}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleUnenroll(course.id, course.nama)} className="shrink-0 p-2 sm:px-3 sm:py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                                                <Trash2 size={14}/> <span className="hidden sm:block">Cabut Akses</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-800 mb-3">Tambahkan ke Kelas Baru</h3>
                                <form onSubmit={handleEnroll} className="flex flex-col sm:flex-row gap-3">
                                    <select value={data.course_id} onChange={e => setData('course_id', e.target.value)} className="flex-1 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 text-sm font-medium" required>
                                        <option value="" disabled>-- Pilih Kelas --</option>
                                        {availableCourses.map(c => (
                                            <option key={c.id} value={c.id}>{c.nama} (Batch {c.batch})</option>
                                        ))}
                                        {availableCourses.length === 0 && <option value="" disabled>Member sudah mengikuti semua kelas.</option>}
                                    </select>
                                    <button type="submit" disabled={!data.course_id || processing} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0">
                                        <Plus size={16}/> Masukkan Kelas
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}