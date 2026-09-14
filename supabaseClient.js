import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Manquent les variables SUPABASE_URL ou SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
