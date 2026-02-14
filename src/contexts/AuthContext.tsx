import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  profile_picture_url: string | null;
  tier_id: string | null;
  points_balance: number;
  total_points_earned: number;
  barcode: string | null;
  created_at: string;
  updated_at: string;
}

interface Tier {
  id: string;
  name: string;
  min_points: number;
  discount_percentage: number;
  benefits: string[] | null;
  sort_order: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  tier: Tier | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileData) {
      setProfile(profileData as Profile);
      if (profileData.tier_id) {
        const { data: tierData } = await supabase
          .from("tiers")
          .select("*")
          .eq("id", profileData.tier_id)
          .single();
        if (tierData) setTier(tierData as Tier);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 500);
        } else {
          setProfile(null);
          setTier(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setTier(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, tier, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
