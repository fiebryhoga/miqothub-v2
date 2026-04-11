import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, icon, color, children, isProcessing }) {    
    // Set warna dinamis berdasarkan prop 'color'
    // Mengganti 'emerald' menjadi 'blue' untuk menyelaraskan dengan tema
    const colorTheme = {
        blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 text-blue-600 bg-blue-50',
        emerald: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 text-blue-600 bg-blue-50', // Fallback jika masih ada prop emerald
        amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 text-amber-600 bg-amber-50',
        red: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 text-rose-600 bg-rose-50'
    };

    const currentTheme = colorTheme[color] || colorTheme.blue;
    const btnClass = currentTheme.split(' ')[0] + ' ' + currentTheme.split(' ')[1] + ' ' + currentTheme.split(' ')[2];
    const iconClass = currentTheme.split(' ')[3] + ' ' + currentTheme.split(' ')[4];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-opacity" />
                    
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center max-h-[90vh] overflow-hidden border border-slate-100"
                    >
                        <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center mb-5 ${iconClass}`}>{icon}</div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                        <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{message}</p>
                        
                        {/* AREA UNTUK CHECKBOX KELAS (Jika ada children) */}
                        {children && (
                            <div className="w-full text-left overflow-y-auto scrollbar-thin mb-8">
                                {children}
                            </div>
                        )}
                        
                        <div className="flex gap-3 w-full mt-auto shrink-0">
                            <button onClick={onClose} disabled={isProcessing} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm">Batal</button>
                            <button onClick={onConfirm} disabled={isProcessing} className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-70 text-sm ${btnClass}`}>
                                {isProcessing ? 'Memproses...' : 'Ya, Lanjutkan'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}