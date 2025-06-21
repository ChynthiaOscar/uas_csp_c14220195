'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductTable from '@/components/ProductTable';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [quantity, setQuantity] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/signin');
      return;
    }

    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsed);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foto || !nama || !harga || !quantity) {
      alert('Lengkapi semua field!');
      return;
    }

    const fileExt = foto.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, foto);

    if (uploadError) {
      console.error(uploadError);
      alert('Gagal upload foto!');
      return;
    }

    const { data: imageData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('products').insert([
      {
        foto_product: imageData.publicUrl,
        nama_product: nama,
        harga: parseInt(harga),
        quantity: parseInt(quantity),
      },
    ]);

    if (insertError) {
      console.error(insertError);
      alert('Gagal menambahkan produk ke database');
    } else {
      alert('Produk berhasil ditambahkan!');
      setShowModal(false);
      setNama('');
      setHarga('');
      setQuantity('');
      setFoto(null);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-100 md:ml-64 relative">
        {/* Header */}
        <div className="sticky top-0 w-full bg-black text-yellow-500 px-4 py-3 shadow z-20">
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {user.username}
          </h1>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition w-full sm:w-auto"
            >
              + Add Product
            </button>
          </div>

          <ProductTable searchQuery={searchQuery} />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Tambah Produk
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="file"
                  placeholder="Foto Produk"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] || null)}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Nama Produk"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Harga"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 rounded bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
