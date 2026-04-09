import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, 
    Video, FileText, FileBadge, PlayCircle, ShieldAlert, 
    LayoutList, Layers, Edit, Eye, MonitorPlay, ClipboardList, Clock, Target 
} from 'lucide-react'; // <-- Tambahan Ikon Target

// Import Partials
import ChapterModal from './Partials/ChapterModal';
import MaterialModal from './Partials/MaterialModal';
import MaterialDetailModal from './Partials/MaterialDetailModal';

export default function Curriculum({ auth, course }) {
    const { flash = {} } = usePage().props;
    const chapters = course.chapters || [];

    const [expandedChapters, setExpandedChapters] = useState(chapters.map(c => c.id));
    
    const [modalChapter, setModalChapter] = useState({ show: false, chapter: null });
    const [modalMaterial, setModalMaterial] = useState({ show: false, chapterId: null, material: null, nextOrder: 1 });
    const [modalDetail, setModalDetail] = useState({ show: false, material: null });

    const toggleChapter = (id) => {
        setExpandedChapters(prev => prev.includes(id) ? prev.filter(chapId => chapId !== id) : [...prev, id]);
    };

    const deleteChapter = (id) => {
        if (confirm('Yakin ingin menghapus Bab ini beserta SELURUH materinya? Tindakan ini tidak bisa dibatalkan.')) {
            router.delete(route('admin.chapters.destroy', id));
        }
    };

    const deleteMaterial = (id) => {
        if (confirm('Yakin ingin menghapus materi ini?')) {
            router.delete(route('admin.materials.destroy', id));
        }
    };

    const getMaterialConfig = (type) => {
        switch (type) {
            case 'video': return { icon: <Video size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
            case 'pdf': return { icon: <FileBadge size={20} />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
            case 'pertemuan': return { icon: <MonitorPlay size={20} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
            case 'latihan': return { icon: <ClipboardList size={20} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
            default: return { icon: <FileText size={20} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Kurikulum: ${course.nama}`} />

            <div className="relative mb-8 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70"></div>
                
                <div className="relative z-10">
                    <Link href={route('admin.courses.index')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Kembali ke Daftar Kelas
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <LayoutList size={24}/>
                                </div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kelola Kurikulum</h1>
                            </div>
                            <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                                Susun dan atur alur belajar untuk kelas <strong className="text-indigo-600 font-bold">{course.nama}</strong>. Anda bisa menambahkan video, modul PDF, jadwal pertemuan live, hingga tugas.
                            </p>
                        </div>
                        <button 
                            onClick={() => setModalChapter({ show: true, chapter: null })} 
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 shrink-0"
                        >
                            <Plus size={20} /> Tambah Bab Baru
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-bold flex items-center gap-3 shadow-sm">
                        <ShieldAlert size={20} className="text-emerald-500" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {chapters.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Layers size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Kurikulum Masih Kosong</h3>
                        <p className="text-slate-500 max-w-md mb-8 leading-relaxed">Mulai bangun struktur materi kelas ini dengan menambahkan Bab pertama Anda. Buat alur belajar yang terstruktur dan mudah dipahami member.</p>
                        <button 
                            onClick={() => setModalChapter({ show: true, chapter: null })} 
                            className="px-8 py-3.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 hover:shadow-md transition-all"
                        >
                            Buat Bab Pertama
                        </button>
                    </div>
                ) : (
                    chapters.map((chapter) => (
                        <div key={chapter.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group/chapter">
                            
                            <div className="bg-slate-50/50 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-4 transition-colors hover:bg-slate-50">
                                <div className="flex items-center gap-4 cursor-pointer select-none flex-1" onClick={() => toggleChapter(chapter.id)}>
                                    <button className={`p-2 rounded-lg transition-colors ${expandedChapters.includes(chapter.id) ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-200 text-slate-400 hover:text-indigo-600'}`}>
                                        {expandedChapters.includes(chapter.id) ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                                    </button>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Bab {chapter.urutan}</p>
                                        <h3 className="font-black text-slate-800 text-lg sm:text-xl leading-tight">{chapter.judul}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:opacity-0 group-hover/chapter:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: null, nextOrder: chapter.materials?.length + 1 || 1 })} 
                                        className="text-sm font-bold px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Plus size={16}/> Materi
                                    </button>
                                    <button 
                                        onClick={() => setModalChapter({ show: true, chapter: chapter })} 
                                        className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-100 transition-all shadow-sm" title="Edit Bab"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => deleteChapter(chapter.id)} 
                                        className="p-2.5 bg-white border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm" title="Hapus Bab"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedChapters.includes(chapter.id) && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50/30">
                                        <div className="p-6 space-y-3">
                                            {chapter.materials && chapter.materials.length > 0 ? (
                                                chapter.materials.map((material) => {
                                                    const config = getMaterialConfig(material.tipe);
                                                    return (
                                                        <div key={material.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all gap-4 relative overflow-hidden">
                                                            
                                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                                            <div className="flex items-start md:items-center gap-4 flex-1">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-sm ${config.bg} ${config.color} ${config.border}`}>
                                                                    {config.icon}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">{material.urutan}</span>
                                                                        {material.is_preview && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">Free Preview</span>}
                                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.color} ${config.border}`}>{material.tipe === 'text_only' ? 'TEKS' : material.tipe}</span>
                                                                    </div>
                                                                    <p className="font-bold text-slate-800 text-base group-hover:text-indigo-700 transition-colors">{material.judul}</p>
                                                                    
                                                                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 font-medium">
                                                                        {material.durasi && (
                                                                            <span className="flex items-center gap-1"><Clock size={12}/> {material.durasi}</span>
                                                                        )}
                                                                        {material.tipe === 'pertemuan' && material.tanggal_waktu_meet && (
                                                                            <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded"><Clock size={12}/> {new Date(material.tanggal_waktu_meet).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all justify-end border-t border-slate-100 md:border-0 pt-3 md:pt-0">
                                                                
                                                                {/* 👇 TOMBOL KHUSUS KELOLA SOAL (Hanya muncul jika tipe latihan) 👇 */}
                                                                {material.tipe === 'latihan' && material.exercise_id && (
                                                                    <Link 
                                                                        href={route('admin.exercises.show', material.exercise_id)}
                                                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-lg transition-colors border border-orange-200"
                                                                    >
                                                                        <Target size={14}/> Kelola Soal
                                                                    </Link>
                                                                )}
                                                                
                                                                <button onClick={() => setModalDetail({ show: true, material: material })} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border border-slate-200 hover:border-emerald-200">
                                                                    <Eye size={14}/> Detail
                                                                </button>
                                                                <button onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: material, nextOrder: material.urutan })} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border border-slate-200 hover:border-blue-200">
                                                                    <Edit size={14}/> Edit
                                                                </button>
                                                                <button onClick={() => deleteMaterial(material.id)} className="p-2 text-slate-400 bg-slate-50 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 hover:border-rose-200" title="Hapus Materi">
                                                                    <Trash2 size={16}/>
                                                                </button>
                                                            </div>

                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-10 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">
                                                    <p className="font-medium text-sm">Belum ada materi di bab ini.</p>
                                                    <button onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: null, nextOrder: 1 })} className="mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 underline underline-offset-2">Tambahkan materi sekarang</button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {modalChapter.show && (
                    <ChapterModal 
                        show={modalChapter.show} 
                        onClose={() => setModalChapter({ show: false, chapter: null })} 
                        courseId={course.id} 
                        chapter={modalChapter.chapter} 
                        nextOrder={chapters.length + 1} 
                    />
                )}
                {modalMaterial.show && (
                    <MaterialModal 
                        show={modalMaterial.show} 
                        onClose={() => setModalMaterial({ show: false, chapterId: null, material: null, nextOrder: 1 })} 
                        chapterId={modalMaterial.chapterId} 
                        material={modalMaterial.material} 
                        nextOrder={modalMaterial.nextOrder} 
                    />
                )}
                {modalDetail.show && (
                    <MaterialDetailModal 
                        show={modalDetail.show} 
                        onClose={() => setModalDetail({ show: false, material: null })} 
                        material={modalDetail.material} 
                    />
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}