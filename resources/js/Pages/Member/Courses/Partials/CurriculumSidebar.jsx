// resources/js/Pages/Member/Courses/Partials/CurriculumSidebar.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, FileBadge, MonitorPlay, ClipboardList, FileText, ChevronDown, ChevronUp, Clock } from 'lucide-react';

export default function CurriculumSidebar({ course, activeMaterial, setActiveMaterial, expandedChapters, toggleChapter }) {
    
    // Fungsi Render Ikon di Sidebar
    const getMaterialIcon = (type, isActive) => {
        const colorClass = isActive ? 'text-white' : 'text-slate-400';
        switch (type) {
            case 'video': return <PlayCircle size={18} className={colorClass} />;
            case 'pdf': return <FileBadge size={18} className={colorClass} />;
            case 'pertemuan': return <MonitorPlay size={18} className={colorClass} />;
            case 'latihan': return <ClipboardList size={18} className={colorClass} />;
            default: return <FileText size={18} className={colorClass} />;
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-lg font-black text-slate-800">Daftar Materi</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Lacak progres belajarmu di sini</p>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar p-2">
                {course.chapters?.length === 0 ? (
                    <p className="text-center text-slate-400 py-10">Kurikulum belum tersedia.</p>
                ) : (
                    course.chapters?.map((chapter, index) => (
                        <div key={chapter.id} className="mb-2 last:mb-0">
                            
                            {/* Judul Bab (Accordion Header) */}
                            <button 
                                onClick={() => toggleChapter(chapter.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                                    expandedChapters.includes(chapter.id) ? 'bg-slate-100' : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="text-left pr-4">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bab {chapter.urutan || index + 1}</span>
                                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{chapter.judul}</h4>
                                </div>
                                <div className="shrink-0 text-slate-400">
                                    {expandedChapters.includes(chapter.id) ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                                </div>
                            </button>

                            {/* Daftar Materi di dalam Bab */}
                            <AnimatePresence>
                                {expandedChapters.includes(chapter.id) && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }} 
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 pb-4 px-2 space-y-1 relative before:absolute before:left-6 before:top-2 before:bottom-6 before:w-px before:bg-slate-200">
                                            {chapter.materials?.map((material) => {
                                                const isActive = activeMaterial?.id === material.id;
                                                return (
                                                    <button
                                                        key={material.id}
                                                        onClick={() => setActiveMaterial(material)}
                                                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all relative z-10 text-left ${
                                                            isActive 
                                                                ? 'bg-indigo-600 shadow-md' 
                                                                : 'hover:bg-indigo-50'
                                                        }`}
                                                    >
                                                        {/* Ikon Materi */}
                                                        <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                                                            isActive ? 'border-white/30 bg-indigo-500' : 'bg-white border-slate-200'
                                                        }`}>
                                                            {getMaterialIcon(material.tipe, isActive)}
                                                        </div>
                                                        
                                                        {/* Teks Materi */}
                                                        <div>
                                                            <p className={`text-sm font-bold leading-snug mb-1 ${
                                                                isActive ? 'text-white' : 'text-slate-700'
                                                            }`}>
                                                                {material.judul}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                                    isActive ? 'bg-white/20 text-indigo-100' : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                    {material.tipe === 'text_only' ? 'Teks' : material.tipe}
                                                                </span>
                                                                {material.durasi && (
                                                                    <span className={`text-xs font-medium flex items-center gap-1 ${
                                                                        isActive ? 'text-indigo-200' : 'text-slate-400'
                                                                    }`}>
                                                                        <Clock size={12}/> {material.durasi}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {(!chapter.materials || chapter.materials.length === 0) && (
                                                <p className="text-xs text-slate-400 italic pl-12 py-2">Belum ada materi.</p>
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