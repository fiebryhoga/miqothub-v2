import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            {/* Header dihapus karena sudah dikelola oleh parent komponen (Edit.jsx) */}
            
            <button 
                onClick={confirmUserDeletion}
                className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl font-bold shadow-sm hover:shadow-lg hover:shadow-rose-600/20 transition-all duration-300 flex items-center gap-2"
            >
                <AlertTriangle size={18} /> Hapus Akun Permanen
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">
                            Hapus Akun Anda?
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-600 font-medium leading-relaxed mb-6 border-b border-slate-100 pb-6">
                        Setelah akun Anda dihapus, semua data profil, histori pendaftaran, kelas, dan sertifikat 
                        akan terhapus secara permanen. Masukkan kata sandi Anda untuk mengonfirmasi tindakan ini.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi Konfirmasi"
                            className="text-rose-950 font-black uppercase text-[10px] tracking-widest mb-1.5"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-xl border-slate-200 text-slate-700 font-semibold focus:border-rose-500 focus:ring-rose-500/10 shadow-sm transition-all"
                            isFocused
                            placeholder="Masukkan kata sandi Anda..."
                        />

                        <InputError message={errors.password} className="mt-2 font-bold text-rose-600" />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Batal
                        </button>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}