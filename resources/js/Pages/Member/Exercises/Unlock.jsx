import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Unlock({ material, exercise }) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.exercise.verify', material.id));
    };

    return (
        <div className="min-h-screen bg-slate-50/80 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Head title={`Buka Kuis: ${exercise.judul}`} />

            {/* Aksen Blur Navy di Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <Link 
                    href={route('member.courses.show', material.chapter.course_id)} 
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-950 mb-6 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Kelas
                </Link>

                <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-950/10 overflow-hidden border border-slate-100 flex flex-col">
                    
                    {/* Header Premium Navy Card */}
                    <div className="bg-gradient-to-br from-blue-950 to-blue-900 p-8 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Motif Lingkaran Transparan di dalam Header */}
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

                        <div className="w-16 h-16 bg-white/10 rounded-[1.25rem] flex items-center justify-center backdrop-blur-md mb-5 border border-white/20 shadow-inner relative z-10">
                            <Lock size={32} className="text-white drop-shadow-md" strokeWidth={2} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 relative z-10 tracking-tight">Kuis Terkunci</h2>
                        <p className="text-blue-200 text-sm font-medium relative z-10 leading-relaxed px-4">
                            Sesi <strong className="text-white">"{exercise.judul}"</strong> dilindungi oleh kata sandi.
                        </p>
                    </div>

                    {/* Form Input Password */}
                    <form onSubmit={submit} className="p-8">
                        {errors.password && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-3.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl flex items-center gap-2.5 border border-rose-100"
                            >
                                <ShieldAlert size={18} className="shrink-0" /> {errors.password}
                            </motion.div>
                        )}

                        <div className="mb-8 relative group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <KeyRound size={14}/> Masukkan Kode Akses
                            </label>
                            
                            <input 
                                type="password" 
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full text-center tracking-[0.5em] text-2xl font-black text-blue-950 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-900 focus:ring-blue-950/10 bg-slate-50 transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-medium placeholder:text-lg"
                                placeholder="••••••••"
                                required 
                                autoFocus
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full py-4 bg-blue-950 text-white font-black rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-xl shadow-blue-950/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                'Memverifikasi...'
                            ) : (
                                <> Buka Akses Latihan </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}