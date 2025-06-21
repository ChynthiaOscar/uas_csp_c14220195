'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  foto_product: string;
  nama_product: string;
  harga: number;
  quantity: number;
}

interface Props {
  searchQuery: string;
}

export default function ProductTable({ searchQuery }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newFoto, setNewFoto] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });

    if (error) {
      console.error('Gagal mengambil produk:', error.message, error);
      alert(`Gagal mengambil data produk: ${error.message}`);
    } else {
      setProducts(data as Product[]);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Gagal menghapus produk!');
    else fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
    setNewFoto(null); 
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    let fotoUrl = selectedProduct.foto_product;

    if (newFoto) {
      const fileExt = newFoto.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, newFoto);

      if (uploadError) {
        console.error('Gagal upload foto:', uploadError.message);
        alert('Gagal upload foto baru!');
        return;
      }

      const { data: imageData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      fotoUrl = imageData.publicUrl;
    }

    const { error } = await supabase.from('products').update({
      nama_product: selectedProduct.nama_product,
      harga: selectedProduct.harga,
      quantity: selectedProduct.quantity,
      foto_product: fotoUrl,
    }).eq('id', selectedProduct.id);

    if (error) {
      alert('Gagal update produk!');
    } else {
      alert('Produk berhasil diperbarui!');
      setShowEditModal(false);
      setSelectedProduct(null);
      setNewFoto(null);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nama_product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-6 bg-white overflow-x-auto rounded shadow">
  {loading ? (
    <p className="text-center text-gray-500 p-4">Loading produk...</p>
  ) : filteredProducts.length === 0 ? (
    <p className="text-center text-gray-500 p-4">Tidak ada produk yang tersedia.</p>
  ) : (
    <table className="min-w-full text-sm text-left border border-gray-300">
      <thead className="bg-black text-white">
        <tr>
          <th className="p-2 border whitespace-nowrap">Foto</th>
          <th className="p-2 border text-center">Nama Produk</th>
          <th className="p-2 border text-center">Harga</th>
          <th className="p-2 border text-center">Quantity</th>
          <th className="p-2 border text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((product) => (
          <tr key={product.id} className="border-t hover:bg-gray-50">
            <td className="p-2 border">
              <img
                src={product.foto_product}
                alt={product.nama_product}
                className="w-12 h-12 object-cover rounded"
              />
            </td>
            <td className="p-2 border text-center break-words max-w-[150px]">
              {product.nama_product}
            </td>
            <td className="p-2 border text-center">Rp{product.harga.toLocaleString()}</td>
            <td className="p-2 border text-center">{product.quantity}</td>
            <td className="p-2 border text-center space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition w-full sm:w-auto"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* Modal Edit */}
  {showEditModal && selectedProduct && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Produk</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <img
            src={selectedProduct.foto_product}
            alt="Preview"
            className="w-20 h-20 rounded object-cover mx-auto"
          />
          <input
            type="file"
            placeholder="Foto Produk"
            accept="image/*"
            onChange={(e) => setNewFoto(e.target.files?.[0] || null)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Nama Produk"
            value={selectedProduct.nama_product}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, nama_product: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Harga"
            value={selectedProduct.harga}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, harga: Number(e.target.value) })
            }
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={selectedProduct.quantity}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, quantity: Number(e.target.value) })
            }
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedProduct(null);
                setNewFoto(null);
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
}
