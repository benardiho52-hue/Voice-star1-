import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kdpqbdytfvnbtiwnaafo.supabase.co";

// Replace this with your Supabase publishable key
// or your project's legacy anon public key.
// Never use the service_role or secret key in the app.
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";

export const supabase = createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

export default supabase;