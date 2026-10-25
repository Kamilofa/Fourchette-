import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://zuvvxbajzhyavuxbamer.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_c6mvdDljAJwpgbh129g2Tg_jEFgjXv0';

function resolveValidUrl(): string {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    try {
      new URL(envUrl);
      return envUrl;
    } catch {
      // invalid URL format, use default
    }
  }
  return DEFAULT_SUPABASE_URL;
}

function resolveValidKey(): string {
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();
  if (envKey && envKey.length > 20 && envKey !== '69') {
    return envKey;
  }
  return DEFAULT_SUPABASE_KEY;
}

const SUPABASE_URL = resolveValidUrl();
const SUPABASE_ANON_KEY = resolveValidKey();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  keyPreview: SUPABASE_ANON_KEY.slice(0, 16) + '...',
  isConnected: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};

// SQL Schema for the user to run in their Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- SCHEMA RESTAURANT 5 FOURCHETTES DOUALA
-- À copier et exécuter dans l'éditeur SQL de votre tableau de bord Supabase

-- 1. Table des Clients (Fichier clients et historique)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT DEFAULT 'Douala',
  total_orders INTEGER DEFAULT 1,
  total_spent NUMERIC DEFAULT 0,
  notes TEXT,
  last_order_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Commandes de Plats
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_mode TEXT NOT NULL, -- 'livraison', 'drive', 'table'
  delivery_address TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'momo', 'om', 'cash_pos'
  payment_reference TEXT NOT NULL,
  payment_status TEXT DEFAULT 'verified', -- 'pending', 'verified', 'failed'
  order_status TEXT DEFAULT 'received', -- 'received', 'preparing', 'delivering', 'completed'
  special_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des Réservations de Tables
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TEXT NOT NULL,
  guest_count INTEGER NOT NULL,
  area TEXT NOT NULL, -- 'terrasse', 'salle', 'vip'
  needs_high_chair BOOLEAN DEFAULT FALSE,
  is_birthday BOOLEAN DEFAULT FALSE,
  special_notes TEXT,
  deposit_amount NUMERIC DEFAULT 0,
  deposit_ref TEXT,
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'seated', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Politiques de Sécurité RLS (Permettre la lecture et l'insertion publique)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public update clients" ON public.clients FOR UPDATE USING (true);

CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public insert reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Allow public update reservations" ON public.reservations FOR UPDATE USING (true);
`;
