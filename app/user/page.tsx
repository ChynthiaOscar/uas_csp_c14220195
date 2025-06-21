'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  foto_product: string;
  nama_product: string;
  harga: number;
  quantity: number;
}

export default function UserPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/signin');
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'user') {
      router.push('/dashboard');
      return;
    }
    setUser(parsed);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Gagal ambil produk:', error.message);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-yellow-500 text-black px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">LEGO Parts Store</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-black text-yellow-400 px-3 py-1 rounded hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Banner */}
      <div
        className="w-full h-48 sm:h-52 bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/lego_banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h2
          className="relative z-10 text-3xl sm:text-5xl font-bold text-black text-center px-4"
          style={{
            textShadow: '0 0 10px #ffffff, 0 0 20px #ffcc00, 0 0 30px #ffcc00',
          }}
        >
          Welcome, {user?.username}
        </h2>
      </div>

      {/* Sticky Header */}
      <div className="px-4 sm:px-6 py-4 border-b bg-black flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-500">List Produk</h2>
        <input
          type="text"
          placeholder="Cari produk..."
          className="px-3 py-2 rounded-md border bg-black text-yellow-500 placeholder:text-yellow-500 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-10">
        {loading ? (
          <p className="text-gray-500 text-center">Loading produk...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center">Tidak ada produk tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((product) =>
                product.nama_product.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition flex flex-col p-4 items-center text-center"
                >
                  <img
                    src={product.foto_product}
                    alt={product.nama_product}
                    className="w-24 h-24 object-cover object-center rounded mb-4"
                  />
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-1">{product.nama_product}</h3>
                    <p className="text-sm text-gray-700 mb-1">
                      Rp{product.harga.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Stok: {product.quantity}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
