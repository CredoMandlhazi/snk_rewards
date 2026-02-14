import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, ShoppingBag, Bell, Settings, ChevronRight, LogOut, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/logo.png";

interface Purchase {
  id: string;
  total_amount: number;
  points_earned: number;
  created_at: string;
  store_id: string | null;
}

interface Store {
  id: string;
  name: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile, tier, signOut, refreshProfile } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stores, setStores] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", surname: "", phone: "" });

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, surname: profile.surname, phone: profile.phone });
    }
  }, [profile]);

  useEffect(() => {
    supabase.from("purchases").select("*").order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => { if (data) setPurchases(data as Purchase[]); });
    supabase.from("stores").select("id, name")
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          (data as Store[]).forEach(s => { map[s.id] = s.name; });
          setStores(map);
        }
      });
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    const { error } = await supabase.from("profiles").update({
      name: form.name,
      surname: form.surname,
      phone: form.phone,
    } as any).eq("user_id", profile.user_id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
      await refreshProfile();
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !profile) return;
    const file = e.target.files[0];
    const filePath = `${profile.user_id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file);
    if (uploadError) { toast.error("Upload failed"); return; }
    const { data: { publicUrl } } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    await supabase.from("profiles").update({ profile_picture_url: publicUrl } as any).eq("user_id", profile.user_id);
    await refreshProfile();
    toast.success("Profile picture updated");
  };

  const displayName = profile ? `${profile.name} ${profile.surname}`.trim() || "Member" : "Member";
  const inputClass = "w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-6 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center overflow-hidden">
              {profile?.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-muted-foreground" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center cursor-pointer">
              <Camera size={12} className="text-primary-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicture} />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{displayName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-accent">{tier?.name || "Bronze"} Member</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{(profile?.points_balance ?? 0).toLocaleString()} pts</span>
            </div>
          </div>
          <img src={logo} alt="SNK" className="h-5 brightness-0 invert opacity-40" />
        </div>
      </motion.div>

      {/* User Info */}
      <div className="px-4 mb-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className={inputClass} />
                <input value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} placeholder="Surname" className={inputClass} />
              </div>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={inputClass} />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 loyalty-gradient text-primary-foreground text-sm font-medium py-2 rounded-lg">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-secondary text-foreground text-sm font-medium py-2 rounded-lg">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="text-sm text-foreground">{profile?.email || "—"}</p>
                  </div>
                </div>
                <button onClick={() => setEditing(true)} className="text-xs text-primary font-medium">Edit</button>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-foreground">{profile?.phone || "—"}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mb-4">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <button onClick={() => navigate("/settings")} className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Settings</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Purchase History */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag size={16} className="text-foreground" />
          <h2 className="text-base font-bold text-foreground">Purchase History</h2>
        </div>
        <div className="space-y-2">
          {purchases.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground">No purchases yet</p>
            </div>
          ) : purchases.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{p.store_id ? stores[p.store_id] || "SNK Store" : "SNK Store"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleDateString()} • R {Number(p.total_amount).toLocaleString()}</p>
              </div>
              <span className="text-sm font-bold text-accent">+{p.points_earned}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 text-sm font-medium text-primary hover:bg-secondary transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
