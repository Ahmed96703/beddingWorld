import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/api";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// --- Demo (no-Supabase) admin session ---------------------------------------
const DEMO_KEY = "linea-demo-admin";
const demoSession = (email: string) =>
  ({
    user: { id: "demo-admin", email, app_metadata: {}, user_metadata: {} },
  }) as unknown as Session;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const resolveRole = useCallback(async (uid: string | undefined) => {
    if (!uid || !isSupabaseConfigured) {
      setIsAdmin(false);
      return;
    }
    try {
      setIsAdmin(await checkIsAdmin(uid));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (localStorage.getItem(DEMO_KEY)) {
        setSession(demoSession("demo@linea.local"));
        setIsAdmin(true);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      resolveRole(data.session?.user?.id).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Defer the role lookup to avoid deadlocking the auth callback.
      setTimeout(() => resolveRole(next?.user?.id), 0);
    });

    return () => sub.subscription.unsubscribe();
  }, [resolveRole]);

  const enterDemo = useCallback((email: string) => {
    localStorage.setItem(DEMO_KEY, "1");
    setSession(demoSession(email || "demo@linea.local"));
    setIsAdmin(true);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) return enterDemo(email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    [enterDemo],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) return enterDemo(email);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },
    [enterDemo],
  );

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_KEY);
      setSession(null);
      setIsAdmin(false);
      return;
    }
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  const refreshRole = useCallback(
    () => resolveRole(session?.user?.id),
    [resolveRole, session],
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
