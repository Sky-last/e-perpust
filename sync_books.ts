import { createClient } from '@supabase/supabase-js';
import { INITIAL_BOOKS } from './src/data/books';
import * as fs from 'fs';
import * as path from 'path';
import WebSocket from 'ws';

// Polyfill WebSocket for Supabase client
(global as any).WebSocket = WebSocket;

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@pustaka.com',
    password: 'admin'
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    process.exit(1);
  }

  console.log('Authenticated as:', authData.user?.email);

  // Delete all existing books
  const { error: deleteError } = await supabase.from('books').delete().neq('id', '__dummy__');
  if (deleteError) { console.error('Delete error:', deleteError.message); process.exit(1); }
  console.log('All books cleared.');

  // Insert new books
  const insertData = INITIAL_BOOKS.map(b => ({
    id: b.id,
    title: b.title,
    author: b.author,
    category: b.category,
    publisher: b.publisher,
    isbn: b.isbn,
    description: b.description,
    year: b.year,
    rating: b.rating,
    status: b.status,
    stock: b.stock,
    cover_color: b.coverColor,
    cover_url: b.coverUrl || null,         // Gambar sampul (URL foto)
    is_ai_generated: b.isAiGenerated || false
  }));

  console.log(`Inserting ${insertData.length} books...`);
  const { error: insertError } = await supabase.from('books').insert(insertData);
  if (insertError) { console.error('Insert error:', insertError.message); process.exit(1); }

  console.log(`✅ Done! ${insertData.length} books synced to Supabase.`);
}

main().catch(console.error);
