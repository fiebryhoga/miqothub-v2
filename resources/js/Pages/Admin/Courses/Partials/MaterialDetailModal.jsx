import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Video, FileBadge, FileText, PlayCircle, EyeOff, X, 
    Clock, Tag, Info, ExternalLink, Calendar
} from 'lucide-react';

export default function MaterialDetailModal({ show, onClose, material }) {
    if (!show || !material) return null;

    const isVideo = material.tipe === 'video';
    const isPdf = material.tipe === 'pdf';
    const isText = material.tipe === 'text_only';

    // FUNGSI: Mengubah URL YouTube biasa menjadi URL Embed otomatis
    const getEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = '';
        
        try {
            if (url.includes('youtube.com/watch')) {
                videoId = new URL(url).searchParams.get('v');
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                return url; 
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch (error) {
            return url; 
        }
    };

    // Helper format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    };

    return (
        <AnimatePresence>
            {show && material && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
                    
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                    />
                    
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col max-h-[95vh] border border-slate-100"
                    >
                        
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white shrink-0">
                            <div className="flex items-start gap-4 pr-4">
                                
                                <div className={`p-3 rounded-xl shadow-sm border shrink-0 mt-1 ${
                                    isVideo ? 'bg-blue-50 border-blue-200 text-blue-600' : 
                                    isPdf ? 'bg-rose-50 border-rose-200 text-rose-600' : 
                                    'bg-amber-50 border-amber-200 text-amber-600'
                                }`}>
                                    {isVideo ? <Video size={24} strokeWidth={2.5}/> : isPdf ? <FileBadge size={24} strokeWidth={2.5}/> : <FileText size={24} strokeWidth={2.5}/>}
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-widest">
                                            Urutan ke-{material.urutan}
                                        </span>
                                        {material.is_preview && (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase tracking-widest">
                                                Free Preview
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{material.judul}</h2>
                                </div>
                            </div>
                            
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0">
                                <X size={24}/>
                            </button>
                        </div>

                        
                        <div className="overflow-y-auto scrollbar-thin bg-slate-50/50 flex-1">
                            
                            
                            <div className="p-6">
                                {isVideo && material.link_video && (
                                    <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-800 relative">
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
                                    <div className="w-full py-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                                        <FileBadge size={64} className="text-rose-500 mb-4" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Dokumen Pembelajaran (PDF)</h3>
                                        <p className="text-slate-500 text-sm mb-6 max-w-md text-center">Materi ini berisi dokumen PDF. Klik tombol di bawah untuk membuka dan membaca materinya di tab baru.</p>
                                        <a href={`/storage/${material.file_path}`} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 hover:shadow-md transition-colors flex items-center gap-2 text-sm">
                                            <ExternalLink size={18} /> Buka File PDF
                                        </a>
                                    </div>
                                )}

                                {isText && (
                                    <div className="w-full py-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                                        <FileText size={64} className="text-amber-500 mb-4" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Materi Teks Bacaan</h3>
                                        <p className="text-slate-500 text-sm max-w-md text-center">Materi ini difokuskan pada teks bacaan. Silakan baca detail pada bagian deskripsi di bawah.</p>
                                    </div>
                                )}
                            </div>

                            
                            <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                
                                <div className="lg:col-span-2">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                                <Info size={16} strokeWidth={2.5} />
                                            </div>
                                            <h4 className="font-bold text-slate-900">Deskripsi & Catatan Materi</h4>
                                        </div>
                                        
                                        {material.deskripsi ? (
                                            <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: material.deskripsi }} />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                                <EyeOff size={32} className="mb-3 text-slate-300" />
                                                <p className="text-sm font-medium">Tidak ada deskripsi yang ditambahkan untuk materi ini.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                
                                <div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">Detail Informasi</h4>
                                        
                                        <ul className="space-y-4">
                                            
                                            <li className="flex items-start gap-3">
                                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Estimasi Durasi</p>
                                                    <p className="text-sm font-bold text-slate-800">{material.durasi || 'Tidak ditentukan'}</p>
                                                </div>
                                            </li>

                                            
                                            <li className="flex items-start gap-3">
                                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                                                    <Tag size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tipe Konten</p>
                                                    <p className="text-sm font-bold text-slate-800 capitalize">
                                                        {material.tipe === 'text_only' ? 'Teks Bacaan' : material.tipe}
                                                    </p>
                                                </div>
                                            </li>

                                            
                                            <li className="flex items-start gap-3">
                                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                                                    <Calendar size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ditambahkan Pada</p>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {formatDate(material.created_at)}
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>

                                        
                                        {isVideo && material.link_video && (
                                            <div className="mt-6 pt-5 border-t border-slate-100">
                                                <a href={material.link_video} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-200 shadow-sm">
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
            )}
        </AnimatePresence>
    );
}