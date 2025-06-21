'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/signin');
  };

  return (
    <>
      {/* Toggle Button (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-500 p-2 rounded shadow-lg"
        onClick={() => setIsOpen(true)}
        title="Open sidebar"
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex h-screen w-64 bg-yellow-500 text-black p-6 shadow-lg fixed left-0 top-0 flex-col justify-between z-40">
        <div>
          <h2 className="text-2xl font-bold mb-6">LEGO Parts Store</h2>
          <nav className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition duration-200 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#20252f"
              >
                <path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z" />
              </svg>
              Our Products
            </Link>
          </nav>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative z-50 w-64 bg-yellow-500 text-black p-6 shadow-lg flex flex-col justify-between h-full">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X size={24} />
            </button>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">LEGO Parts Store</h2>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition duration-200 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#20252f"
                  >
                    <path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z" />
                  </svg>
                  Our Products
                </Link>
              </nav>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
