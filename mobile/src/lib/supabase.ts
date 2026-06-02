import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL  = 'https://xvltrvxudrmcleaafscc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bHRydnh1ZHJtY2xlYWFmc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjY5OTAsImV4cCI6MjA5NDgwMjk5MH0.DMcHnPlEDppgZdVYfpOh4GxCjqsx-QHXmuf6YC5VNww';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // NOTE: flowType 'pkce' removed — Hermes (React Native JS engine) does NOT
    // support WebCrypto, so PKCE can't generate a SHA256 challenge.
    // Implicit flow sends tokens directly in the URL fragment (#access_token=...).
  },
});

export default supabase;
