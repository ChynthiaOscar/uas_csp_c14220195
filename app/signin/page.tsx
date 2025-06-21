'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg('Username dan password wajib diisi.');
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      setErrorMsg('Username atau password salah.');
      return;
    }

    localStorage.setItem('user', JSON.stringify(data));

    if (data.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/user');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8 relative"
      style={{ backgroundImage: "url('/lego_banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch w-full max-w-6xl">
        {/* Form Login */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 h-full p-6 sm:p-8 rounded-lg w-full backdrop-blur-sm shadow-[0_0_20px_#facc15] flex flex-col justify-center"
          >
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Login</h1>

            {errorMsg && (
              <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
            )}

            <input
              type="text"
              placeholder="Username"
              className="w-full border p-3 rounded mb-4 text-sm sm:text-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded mb-6 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition text-sm sm:text-base"
            >
              Masuk
            </button>
          </form>
        </div>

        {/* Kartu Informasi Akun */}
        <div className="flex-1">
          <div className="relative bg-white/80 h-full p-6 sm:p-8 pt-16 rounded-lg w-full shadow-[0_0_20px_#facc15] backdrop-blur-sm flex flex-col justify-center">
            <div className="absolute top-6 sm:top-8 left-0 w-full bg-yellow-400 text-black px-4 py-2 rounded-t-lg shadow font-semibold text-center text-sm sm:text-lg">
                Informasi Akun Pengguna
              </div>


            <div className="flex flex-col sm:flex-row justify-between gap-6 text-sm mt-10">
              <div className="flex-1 bg-yellow-50/70 rounded-lg p-4 shadow-inner">
                <h3 className="font-bold mb-2">👤 Admin</h3>
                <p>Username: <span className="font-mono">admin</span></p>
                <p>Password: <span className="font-mono">admin123</span></p>
              </div>

              <div className="flex-1 bg-yellow-50/70 rounded-lg p-4 shadow-inner">
                <h3 className="font-bold mb-2">👤 User</h3>
                <p>Username: <span className="font-mono">user</span></p>
                <p>Password: <span className="font-mono">user123</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
