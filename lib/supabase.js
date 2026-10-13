
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  'https://kdpqbdytfvnbtiwnaafo.supabase.co';

const SUPABASE_ANON_KEY =
  'PASTE_YOUR_REAL_ANON_OR_PUBLISHABLE_KEY_HERE';

if (
  SUPABASE_URL.includes('YOUR_PROJECT') ||
  SUPABASE_ANON_KEY.includes('PASTE_YOUR')
) {
  throw new Error('Supabase configuration is incomplete.');
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
