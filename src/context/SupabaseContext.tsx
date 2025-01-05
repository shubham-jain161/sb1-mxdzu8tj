import { createContext } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseContext = createContext({ supabase });

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}