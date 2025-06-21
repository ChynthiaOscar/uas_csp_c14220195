import { supabase } from './supabaseClient';

export const login = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    return { success: false, message: 'Invalid credentials' };
  }

  localStorage.setItem('user', JSON.stringify(data));
  return { success: true };
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
