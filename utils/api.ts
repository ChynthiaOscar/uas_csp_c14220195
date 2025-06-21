import { supabase } from '@/lib/supabaseClient';

export const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) console.error('Fetch Error:', error);
  return data || [];
};

export const addProduct = async (product: {
  nama_produk: string;
  harga_satuan: number;
  quantity: number;
}) => {
  const { data, error } = await supabase.from('products').insert([product]);
  if (error) console.error('Insert Error:', error);
  return { data, error };
};

export const updateProduct = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) console.error('Update Error:', error);
  return { data, error };
};

export const deleteProduct = async (id: string) => {
  const { data, error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('Delete Error:', error);
  return { data, error };
};
