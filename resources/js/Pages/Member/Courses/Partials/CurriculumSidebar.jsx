import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, FileBadge, MonitorPlay, ClipboardList, FileText, ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';

export default function CurriculumSidebar({ course, activeMaterial, setActiveMaterial, expandedChapters, toggleChapter }) {
    
    // Fungsi Render Ikon di Sidebar
    const getMaterialIcon = (type, isActive) => {
        const colorClass = isActive ? 'text-blue-200' : 'text-slate-400 group-hover/btn:text-blue-500 transition-colors';
        switch (type) {
            case 'video': return <PlayCircle size={16} className={colorClass} strokeWidth={2.5} />;
            case 'pdf': return <FileBadge size={16} className={colorClass} strokeWidth={2.5} />;
            case 'pertemuan': return <MonitorPlay size={16} className={colorClass} strokeWidth={2.5} />;
            case 'latihan': return <ClipboardList size={16} className={colorClass} strokeWidth={2.5} />;
            default: return <FileText size={16} className={colorClass} strokeWidth={2.5} />;
        }
    };

    return (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden sticky top-24 flex flex-col max-h-[calc(100vh-100px)]">
            {/* Header Sidebar */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                    <BookOpen size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-base font-black text-slate-800">Daftar Kurikulum</h3>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">Materi Kelas {course.nama ? `Batch ${course.batch}` : ''}</p>
                </div>
            </div>

            {/* List Kurikulum (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                {(!course.chapters || course.chapters.length === 0) ? (
                    <div className="text-center text-slate-400 py-10 flex flex-col items-center gap-3">
                        <FileText size={32} className="opacity-50" />
                        <p className="text-sm font-semibold">Kurikulum belum tersedia.</p>
                    </div>
                ) : (
                    course.chapters?.map((chapter, index) => (
                        <div key={chapter.id} className="mb-3 last:mb-0">
                            
                            {/* Judul Bab (Accordion Header) */}
                            <button 
                                onClick={() => toggleChapter(chapter.id)}
                                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all border ${
                                    expandedChapters.includes(chapter.id) 
                                    ? 'bg-blue-50/50 border-blue-100 shadow-sm' 
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                } group/acc`}
                            >
                                <div className="text-left pr-4">
                                    <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${expandedChapters.includes(chapter.id) ? 'text-blue-600' : 'text-slate-400 group-hover/acc:text-slate-500'}`}>
                                        Bab {chapter.urutan || index + 1}
                                    </span>
                                    <h4 className={`font-black text-sm leading-snug transition-colors ${expandedChapters.includes(chapter.id) ? 'text-blue-950' : 'text-slate-700 group-hover/acc:text-slate-900'}`}>
                                        {chapter.judul}
                                    </h4>
                                </div>
                                <div className={`shrink-0 transition-colors ${expandedChapters.includes(chapter.id) ? 'text-blue-600' : 'text-slate-400 group-hover/acc:text-slate-600'}`}>
                                    {expandedChapters.includes(chapter.id) ? <ChevronUp size={20} strokeWidth={2.5}/> : <ChevronDown size={20} strokeWidth={2.5}/>}
                                </div>
                            </button>

                            {/* Daftar Materi di dalam Bab */}
                            <AnimatePresence>
                                {expandedChapters.includes(chapter.id) && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }} 
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 pb-3 px-1 space-y-1 relative before:absolute before:left-[1.35rem] before:top-4 before:bottom-6 before:w-[2px] before:bg-slate-100 before:rounded-full">
                                            {chapter.materials?.map((material) => {
                                                const isActive = activeMaterial?.id === material.id;
                                                return (
                                                    <button
                                                        key={material.id}
                                                        onClick={() => setActiveMaterial(material)}
                                                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all relative z-10 text-left group/btn ${
                                                            isActive 
                                                                ? 'bg-blue-950 shadow-md shadow-blue-950/20 translate-x-1' 
                                                                : 'hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {/* Indikator Titik (Ikon) */}
                                                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 ${
                                                            isActive 
                                                            ? 'border-blue-800 bg-blue-900' 
                                                            : 'bg-white border-slate-100 group-hover/btn:border-blue-100 group-hover/btn:bg-blue-50'
                                                        }`}>
                                                            {getMaterialIcon(material.tipe, isActive)}
                                                        </div>
                                                        
                                                        {/* Teks Materi */}
                                                        <div className="flex-1 min-w-0 py-0.5">
                                                            <p className={`text-sm font-bold leading-tight mb-1.5 truncate transition-colors ${
                                                                isActive ? 'text-white' : 'text-slate-700 group-hover/btn:text-blue-950'
                                                            }`}>
                                                                {material.judul}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                {/* Badge Tipe */}
                                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                                                    isActive 
                                                                    ? 'bg-blue-900/50 text-blue-200 border-blue-800' 
                                                                    : 'bg-white text-slate-500 border-slate-200'
                                                                }`}>
                                                                    {material.tipe === 'text_only' ? 'Teks' : material.tipe}
                                                                </span>
                                                                
                                                                {/* Durasi */}
                                                                {material.durasi && (
                                                                    <span className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                                                                        isActive ? 'text-blue-300' : 'text-slate-400 group-hover/btn:text-slate-500'
                                                                    }`}>
                                                                        <Clock size={12} strokeWidth={2.5}/> {material.durasi}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {(!chapter.materials || chapter.materials.length === 0) && (
                                                <p className="text-xs font-semibold text-slate-400 italic pl-[3.25rem] py-2">Belum ada materi.</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}