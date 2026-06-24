// src/config/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ejcsptynoutfddlhiuze.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqY3NwdHlub3V0ZmRkbGhpdXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTEyMDksImV4cCI6MjA5Nzg4NzIwOX0.d4LEscd36tsIlkSkl1gkaksLGZAw1U2PNXE4qdioylI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('inventario').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
