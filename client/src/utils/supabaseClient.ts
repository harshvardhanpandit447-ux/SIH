import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://syguiyerrztsnstybxep.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z3VpeWVycnp0c25zdHlieGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NTgyMzAsImV4cCI6MjEwNDUzNDIzMH0.bJ6T2dsCeKbyf2RgmOtmegbSdEukEkByr7E6fgk6FxQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export default supabase;
