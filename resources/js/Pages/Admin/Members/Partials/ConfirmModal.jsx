import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, icon, color, children, isProcessing }) {    
    // Set warna dinamis berdasarkan prop 'color'
    const colorTheme = {
        emerald: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 text-emerald-600 bg-emerald-100',
        amber: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/30 text-amber-600 bg-amber-100',
        red: 'bg-red-600 hover:bg-red-500 shadow-red-500/30 text-red-600 bg-red-100'
    };

    const currentTheme = colorTheme[color] || colorTheme.emerald;
    const btnClass = currentTheme.split(' ')[0] + ' ' + currentTheme.split(' ')[1] + ' ' + currentTheme.split(' ')[2];
    const iconClass = currentTheme.split(' ')[3] + ' ' + currentTheme.split(' ')[4];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
                    
                    {/* Lebar modal dinaikkan sedikit (max-w-md) agar checkbox lega */}
                    <motion.div initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }} 
                        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center max-h-[90vh] overflow-hidden"
                    >
                        <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconClass}`}>{icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{message}</p>
                        
                        {/* AREA UNTUK CHECKBOX KELAS */}
                        <div className="w-full text-left overflow-y-auto scrollbar-thin mb-6">
                            {children}
                        </div>
                        
                        <div className="flex gap-3 w-full mt-auto shrink-0">
                            <button onClick={onClose} disabled={isProcessing} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">Batal</button>
                            <button onClick={onConfirm} disabled={isProcessing} className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${btnClass}`}>
                                {isProcessing ? 'Memproses...' : 'Ya, Lanjutkan'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}