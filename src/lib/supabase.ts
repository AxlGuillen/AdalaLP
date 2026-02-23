import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Browser client — uses Publishable key, safe with RLS enabled
export const supabase = createClient(supabaseUrl, publishableKey);
