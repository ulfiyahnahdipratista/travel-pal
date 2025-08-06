import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router';

// User type
interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  initials: string;
}
// Tipe AuthContext
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      handleUser(session?.user || null);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user || null);
    });

    fetchSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
      } else {
        return parts[0][0].toUpperCase();
      }
    } else if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const handleUser = (supabaseUser: SupabaseUser | null) => {
    if (supabaseUser) {
      // console.log('supabaseUser ', supabaseUser);

      const name = supabaseUser.user_metadata?.full_name || '';
      const email = supabaseUser.email || '';
      const initials = getInitials(name, email);

      setUser({
        id: supabaseUser.id,
        email,
        name,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || '',
        initials,
      });
    } else {
      setUser(null);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login'); // Assuming you have a Navigate function to redirect
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};