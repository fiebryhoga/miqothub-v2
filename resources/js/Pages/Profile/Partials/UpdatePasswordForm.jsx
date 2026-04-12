import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    
    const inputStyle = "mt-1 block w-full rounded-xl border-slate-200 text-slate-700 font-semibold focus:border-blue-950 focus:ring-blue-950/10 shadow-sm transition-all";
    const labelStyle = "text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5";

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Kata Sandi Saat Ini" className={labelStyle} />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={inputStyle}
                        autoComplete="current-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.current_password} className="mt-2 font-bold" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" className={labelStyle} />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputStyle}
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2 font-bold" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Kata Sandi Baru" className={labelStyle} />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={inputStyle}
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2 font-bold" />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="px-8 py-3 bg-blue-950 hover:bg-blue-900 shadow-lg shadow-blue-900/20"
                    >
                        {processing ? 'Menyimpan...' : 'Perbarui Sandi'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-2"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 translate-y-2"
                    >
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 size={16} /> Berhasil diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}