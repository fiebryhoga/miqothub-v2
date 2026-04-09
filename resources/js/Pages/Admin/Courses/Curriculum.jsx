import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, 
    Video, FileText, FileBadge, PlayCircle, ShieldAlert, LayoutList, Layers 
} from 'lucide-react';

export default function Curriculum({ auth, course }) {
    const { flash = {} } = usePage().props;
    const chapters = course.chapters || [];

    // State Accordion & Modals
    const [expandedChapters, setExpandedChapters] = useState(chapters.map(c => c.id)); // Buka semua secara default
    const [chapterModal, setChapterModal] = useState(false);
    const [materialModal, setMaterialModal] = useState({ isOpen: false, chapterId: null });

    // Form Bab (Chapter)
    const formChapter = useForm({ judul: '', urutan: chapters.length + 1 });

    // Form Materi (Material)
    const formMaterial = useForm({
        judul: '', tipe: 'video', deskripsi: '', 
        link_video: '', file_path: null, durasi: '', 
        is_preview: false, urutan: 1
    });

    // --- LOGIKA ACCORDION ---
    const toggleChapter = (id) => {
        setExpandedChapters(prev => prev.includes(id) ? prev.filter(chapId => chapId !== id) : [...prev, id]);
    };

    // --- FUNGSI SUBMIT ---
    const submitChapter = (e) => {
        e.preventDefault();
        formChapter.post(route('admin.chapters.store', course.id), {
            onSuccess: () => { setChapterModal(false); formChapter.reset(); }
        });
    };

    const submitMaterial = (e) => {
        e.preventDefault();
        formMaterial.post(route('admin.materials.store', materialModal.chapterId), {
            forceFormData: true, // Wajib karena ada upload file
            onSuccess: () => { setMaterialModal({ isOpen: false, chapterId: null }); formMaterial.reset(); }
        });
    };

    const deleteChapter = (id) => {
        if (confirm('Yakin ingin menghapus Bab ini beserta SELURUH materinya?')) router.delete(route('admin.chapters.destroy', id));
    };

    const deleteMaterial = (id) => {
        if (confirm('Hapus materi ini?')) router.delete(route('admin.materials.destroy', id));
    };

    // --- HELPER IKON TIPE MATERI ---
    const getMaterialIcon = (type) => {
        if (type === 'video') return <Video size={18} className="text-blue-500" />;
        if (type === 'pdf') return <FileBadge size={18} className="text-red-500" />;
        return <FileText size={18} className="text-amber-500" />;
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Kurikulum: ${course.nama}`} />

            {/* HEADER */}
            <div className="mb-8">
                <Link href={route('admin.courses.index')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 mb-4 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Daftar Kelas
                </Link>
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <LayoutList className="text-emerald-500"/> Kelola Kurikulum
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm max-w-2xl">Atur susunan bab dan materi pembelajaran untuk kelas <strong className="text-emerald-700">{course.nama}</strong>.</p>
                    </div>
                    <button onClick={() => setChapterModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/30 active:scale-95 shrink-0">
                        <Plus size={18} /> Tambah Bab Baru
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium flex items-center gap-3 shadow-sm">
                        <ShieldAlert size={16} /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* KONTEN KURIKULUM (ACCORDION) */}
            <div className="space-y-4">
                {chapters.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center flex flex-col items-center">
                        <Layers size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Kurikulum Masih Kosong</h3>
                        <p className="text-gray-500 mt-2 mb-6">Mulai bangun struktur materi dengan menambahkan Bab pertama Anda.</p>
                        <button onClick={() => setChapterModal(true)} className="px-6 py-2.5 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100">Tambah Bab</button>
                    </div>
                ) : (
                    chapters.map((chapter) => (
                        <div key={chapter.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header Bab */}
                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
                                <div className="flex items-center gap-3 cursor-pointer select-none flex-1" onClick={() => toggleChapter(chapter.id)}>
                                    <button className="p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-500 hover:text-emerald-600">
                                        {expandedChapters.includes(chapter.id) ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                    </button>
                                    <h3 className="font-bold text-gray-900 text-lg">Bagian {chapter.urutan}: {chapter.judul}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setMaterialModal({ isOpen: true, chapterId: chapter.id })} className="text-xs font-bold px-3 py-1.5 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-1">
                                        <Plus size={14}/> Materi
                                    </button>
                                    <button onClick={() => deleteChapter(chapter.id)} className="text-xs font-bold px-3 py-1.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            </div>

                            {/* Isi Bab (Daftar Materi) */}
                            <AnimatePresence>
                                {expandedChapters.includes(chapter.id) && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="p-2 space-y-1">
                                            {chapter.materials && chapter.materials.length > 0 ? (
                                                chapter.materials.map((material) => (
                                                    <div key={material.id} className="group flex items-center justify-between p-3 px-5 hover:bg-emerald-50/50 rounded-xl transition-colors border border-transparent hover:border-emerald-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                                                {getMaterialIcon(material.tipe)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800 text-sm">{material.urutan}. {material.judul}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{material.tipe}</span>
                                                                    {material.durasi && <span className="text-[10px] text-gray-400 flex items-center gap-1">• <PlayCircle size={10}/> {material.durasi}</span>}
                                                                    {material.is_preview && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded uppercase">Free Preview</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => deleteMaterial(material.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-6 text-center text-sm text-gray-400 italic">Belum ada materi di bab ini.</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>

            {/* ===================================== */}
            {/* MODAL 1: TAMBAH BAB (CHAPTER) */}
            {/* ===================================== */}
            <AnimatePresence>
                {chapterModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setChapterModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900">Tambah Bab Baru</h2>
                            </div>
                            <form onSubmit={submitChapter} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Bab</label>
                                    <input type="text" value={formChapter.data.judul} onChange={e => formChapter.setData('judul', e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 text-sm" placeholder="Cth: Bab 1: Fiqih Haji" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Urutan Ke-</label>
                                    <input type="number" value={formChapter.data.urutan} onChange={e => formChapter.setData('urutan', e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 text-sm" required />
                                </div>
                                <div className="mt-6 pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setChapterModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Batal</button>
                                    <button type="submit" disabled={formChapter.processing} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500">Simpan Bab</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ===================================== */}
            {/* MODAL 2: TAMBAH MATERI (MATERIAL) */}
            {/* ===================================== */}
            <AnimatePresence>
                {materialModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMaterialModal({ isOpen: false, chapterId: null })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                                <h2 className="text-lg font-bold text-gray-900">Tambah Materi Baru</h2>
                            </div>
                            <form onSubmit={submitMaterial} className="p-6 overflow-y-auto scrollbar-thin space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Materi</label>
                                        <input type="text" value={formMaterial.data.judul} onChange={e => formMaterial.setData('judul', e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tipe Materi</label>
                                        <select value={formMaterial.data.tipe} onChange={e => formMaterial.setData('tipe', e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm font-bold">
                                            <option value="video">Video (YouTube/Drive)</option>
                                            <option value="pdf">File PDF</option>
                                            <option value="text_only">Teks Bacaan Saja</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Urutan / Durasi</label>
                                        <div className="flex gap-2">
                                            <input type="number" value={formMaterial.data.urutan} onChange={e => formMaterial.setData('urutan', e.target.value)} className="w-1/3 rounded-xl border-gray-200 bg-gray-50 text-sm px-2 text-center" title="Urutan" required />
                                            <input type="text" value={formMaterial.data.durasi} onChange={e => formMaterial.setData('durasi', e.target.value)} className="w-2/3 rounded-xl border-gray-200 bg-gray-50 text-sm" placeholder="Cth: 15 Menit" />
                                        </div>
                                    </div>
                                </div>

                                {/* FORM DINAMIS BERDASARKAN TIPE */}
                                {formMaterial.data.tipe === 'video' && (
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                        <label className="block text-xs font-bold text-blue-800 mb-1">Link URL Video</label>
                                        <input type="url" value={formMaterial.data.link_video} onChange={e => formMaterial.setData('link_video', e.target.value)} className="w-full rounded-lg border-blue-200 text-sm" placeholder="https://youtube.com/..." required />
                                    </div>
                                )}
                                {formMaterial.data.tipe === 'pdf' && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                        <label className="block text-xs font-bold text-red-800 mb-1">Upload File PDF</label>
                                        <input type="file" accept=".pdf" onChange={e => formMaterial.setData('file_path', e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-100 file:text-red-700 hover:file:bg-red-200" required />
                                        {formMaterial.errors.file_path && <p className="text-red-500 text-xs mt-1">{formMaterial.errors.file_path}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Tambahan (Opsional)</label>
                                    <textarea value={formMaterial.data.deskripsi} onChange={e => formMaterial.setData('deskripsi', e.target.value)} rows="3" className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"></textarea>
                                </div>

                                <label className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer">
                                    <input type="checkbox" checked={formMaterial.data.is_preview} onChange={e => formMaterial.setData('is_preview', e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-800">Jadikan Free Preview</p>
                                        <p className="text-[10px] text-amber-600/80">Materi ini bisa dilihat publik tanpa perlu beli kelas.</p>
                                    </div>
                                </label>

                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                                    <button type="button" onClick={() => setMaterialModal({ isOpen: false, chapterId: null })} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Batal</button>
                                    <button type="submit" disabled={formMaterial.processing} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500">Simpan Materi</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AdminLayout>
    );
}