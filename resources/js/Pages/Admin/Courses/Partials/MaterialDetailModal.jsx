import React from 'react';
import { motion } from 'framer-motion';
import { 
    Video, FileBadge, FileText, PlayCircle, EyeOff, X, 
    Clock, Tag, Info, ExternalLink, Calendar
} from 'lucide-react';

export default function MaterialDetailModal({ show, onClose, material }) {
    if (!show || !material) return null;

    const isVideo = material.tipe === 'video';
    const isPdf = material.tipe === 'pdf';
    const isText = material.tipe === 'text_only';

    // FUNGSI AJAIB: Mengubah URL YouTube biasa menjadi URL Embed otomatis
    const getEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = '';
        
        try {
            if (url.includes('youtube.com/watch')) {
                videoId = new URL(url).searchParams.get('v');
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                return url; // Sudah format embed
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch (error) {
            return url; // Fallback jika URL tidak valid
        }
    };

    // Helper untuk format tanggal (jika ada data created_at dari backend)
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh]">
                
                {/* HEADER MODAL */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-4 pr-4">
                        <div className={`p-3 rounded-2xl shadow-sm border ${
                            isVideo ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                            isPdf ? 'bg-red-50 border-red-100 text-red-600' : 
                            'bg-amber-50 border-amber-100 text-amber-600'
                        }`}>
                            {isVideo ? <Video size={24}/> : isPdf ? <FileBadge size={24}/> : <FileText size={24}/>}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                    Urutan ke-{material.urutan}
                                </span>
                                {material.is_preview && (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                        Free Preview
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">{material.judul}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors bg-gray-50 shrink-0">
                        <X size={24}/>
                    </button>
                </div>

                {/* BODY CONTENT */}
                <div className="overflow-y-auto custom-scrollbar bg-slate-50/50">
                    
                    {/* AREA MEDIA UTAMA */}
                    <div className="p-6">
                        {isVideo && material.link_video && (
                            <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative group">
                                <iframe 
                                    src={getEmbedUrl(material.link_video)} 
                                    className="absolute inset-0 w-full h-full" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        {isPdf && material.file_path && (
                            <div className="w-full py-12 bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl border border-red-200 flex flex-col items-center justify-center shadow-inner">
                                <FileBadge size={64} className="text-red-500 mb-4 drop-shadow-sm" />
                                <h3 className="text-xl font-bold text-red-900 mb-2">Dokumen Pembelajaran (PDF)</h3>
                                <p className="text-red-600/80 text-sm mb-6 max-w-md text-center">Materi ini berisi dokumen PDF. Klik tombol di bawah untuk membuka dan membaca materinya di tab baru.</p>
                                <a href={`/storage/${material.file_path}`} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                    <ExternalLink size={18} /> Buka File PDF
                                </a>
                            </div>
                        )}

                        {isText && (
                            <div className="w-full py-12 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl border border-amber-200 flex flex-col items-center justify-center shadow-inner">
                                <FileText size={64} className="text-amber-500 mb-4 drop-shadow-sm" />
                                <h3 className="text-xl font-bold text-amber-900 mb-2">Materi Teks Bacaan</h3>
                                <p className="text-amber-700/80 text-sm max-w-md text-center">Materi ini difokuskan pada teks bacaan dan deskripsi di bawah ini.</p>
                            </div>
                        )}
                    </div>

                    {/* GRID INFORMASI DETAIL */}
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Kolom Kiri: Deskripsi (Lebih Lebar) */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
                                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                                    <Info size={18} className="text-emerald-500" />
                                    <h4 className="font-bold text-gray-800">Deskripsi & Catatan Materi</h4>
                                </div>
                                
                                {material.deskripsi ? (
                                    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {material.deskripsi}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <EyeOff size={32} className="mb-3 text-gray-300" />
                                        <p className="text-sm italic">Tidak ada deskripsi yang ditambahkan untuk materi ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Kolom Kanan: Meta Data */}
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Detail Informasi</h4>
                                
                                <ul className="space-y-4">
                                    {/* Durasi */}
                                    <li className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-500 shrink-0">
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Estimasi Durasi</p>
                                            <p className="text-sm font-semibold text-gray-800">{material.durasi || 'Tidak ditentukan'}</p>
                                        </div>
                                    </li>

                                    {/* Tipe */}
                                    <li className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-500 shrink-0">
                                            <Tag size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Tipe Konten</p>
                                            <p className="text-sm font-semibold text-gray-800 capitalize">
                                                {material.tipe === 'text_only' ? 'Teks Bacaan' : material.tipe}
                                            </p>
                                        </div>
                                    </li>

                                    {/* Tanggal Dibuat (Jika ada dari database) */}
                                    <li className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-500 shrink-0">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Ditambahkan Pada</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {formatDate(material.created_at)}
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                {/* Tombol Link Asli untuk Video */}
                                {isVideo && material.link_video && (
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <a href={material.link_video} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-colors border border-gray-200">
                                            <ExternalLink size={16} />
                                            Buka di YouTube
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}