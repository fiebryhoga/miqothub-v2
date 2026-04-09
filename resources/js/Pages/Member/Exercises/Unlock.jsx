import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Unlock({ material, exercise }) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.exercise.verify', material.id));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title={`Buka Kuis: ${exercise.judul}`} />

            <div className="w-full max-w-md">
                <Link href={route('dashboard')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition">
                    <ArrowLeft size={16} /> Kembali
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-indigo-600 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
                            <Lock size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Latihan Terkunci</h2>
                        <p className="text-indigo-100 text-sm">"{exercise.judul}" membutuhkan kode akses.</p>
                    </div>

                    <form onSubmit={submit} className="p-8">
                        {errors.password && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100">
                                <ShieldAlert size={16} /> {errors.password}
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Masukkan Password</label>
                            <input 
                                type="password" 
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full text-center tracking-widest text-lg py-3 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50"
                                placeholder="••••••••"
                                required 
                                autoFocus
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Memverifikasi...' : 'Buka Latihan'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}