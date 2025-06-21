'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/signin');
  };

  return (
    <nav className="bg-yellow-500 text-black px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">LEGO Parts Store</h1>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/signin"
          className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
