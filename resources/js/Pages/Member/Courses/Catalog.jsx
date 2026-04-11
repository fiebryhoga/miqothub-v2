import { useState } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, X, CheckCircle2, ChevronRight, Receipt } from 'lucide-react';

export default function Catalog({ auth, courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        bukti_pembayaran: null,
    });

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const openModal = (course) => {
        setSelectedCourse(course);
        setData('course_id', course.id);
        setPreview(null);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        reset();
        setPreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('bukti_pembayaran', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('member.purchase'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <MemberLayout user={auth.user}>
            <Head title="Katalog Kelas Baru" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Katalog Program Kelas</h2>
                <p className="text-gray-500 text-sm mt-1">Tingkatkan ilmu Anda dengan mengikuti program kelas terbaru kami.</p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Anda Sudah Mengikuti Semua Kelas!</h3>
                    <p className="text-gray-500">Nantikan program kelas terbaru kami selanjutnya.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                            <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><BookOpen size={40} className="text-emerald-200" /></div>
                                )}
                                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-800">
                                    Batch {course.batch}
                                </div>
                            </div>
                            <div className="px-3 pb-2 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{course.nama}</h3>
                                <p className="text-xl font-extrabold text-emerald-600 mb-4">{formatRupiah(course.harga)}</p>
                                
                                <button onClick={() => openModal(course)} className="mt-auto w-full py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95">
                                    Daftar Sekarang <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL PEMBAYARAN */}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-900">Konfirmasi Pendaftaran</h2>
                                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><X size={20} /></button>
                            </div>
                            <form onSubmit={submit} className="p-6 space-y-5">
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Total Tagihan</p>
                                    <p className="text-2xl font-black text-emerald-600">{formatRupiah(selectedCourse.harga)}</p>
                                    <p className="text-sm text-emerald-700 font-medium mt-2">Transfer ke BCA: <strong className="text-emerald-900">1234 567 890</strong> (a.n Haji Course)</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Receipt size={16} className="text-emerald-500"/> Upload Bukti Transfer</label>
                                    <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group hover:border-emerald-500 cursor-pointer transition-colors">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-emerald-500 transition-colors" size={28} />
                                                <p className="text-sm text-gray-500 font-medium">Klik untuk pilih foto struk</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                    </div>
                                    {errors.bukti_pembayaran && <p className="text-red-500 text-xs mt-1">{errors.bukti_pembayaran}</p>}
                                </div>

                                <button type="submit" disabled={processing || !data.bukti_pembayaran} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
                                    {processing ? 'Memproses...' : 'Kirim Bukti Pembayaran'} <CheckCircle2 size={18} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MemberLayout>
    );
}