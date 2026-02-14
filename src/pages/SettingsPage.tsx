import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Phone, Tag, Star, Zap, Shield, Trash2, ChevronLeft, FileText, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Settings {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  deals_alerts: boolean;
  points_alerts: boolean;
  tier_alerts: boolean;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
    whatsapp_enabled: false,
    deals_alerts: true,
    points_alerts: true,
    tier_alerts: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("user_settings").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) setSettings(data as unknown as Settings);
      });
  }, [user]);

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  }, [lightMode]);

  const updateSetting = async (key: keyof Settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (!user) return;
    await supabase.from("user_settings").update({ [key]: value } as any).eq("user_id", user.id);
    toast.success("Setting updated");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to delete your account.");
        setDeleteLoading(false);
        return;
      }

      const response = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error) {
        toast.error("Failed to delete account. Please try again.");
        setDeleteLoading(false);
        return;
      }

      await signOut();
      toast.success("Your account and all data have been permanently deleted.");
      navigate("/");
    } catch {
      toast.error("An error occurred. Please try again.");
    }
    setDeleteLoading(false);
    setShowFinalConfirm(false);
    setShowDeleteConfirm(false);
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? "loyalty-gradient" : "bg-muted"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${enabled ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );

  const channels = [
    { key: "push_enabled" as const, icon: Bell, label: "Push Notifications" },
    { key: "email_enabled" as const, icon: Mail, label: "Email" },
    { key: "sms_enabled" as const, icon: Phone, label: "SMS" },
    { key: "whatsapp_enabled" as const, icon: MessageSquare, label: "WhatsApp" },
  ];

  const alerts = [
    { key: "deals_alerts" as const, icon: Tag, label: "Deals & Promotions" },
    { key: "points_alerts" as const, icon: Zap, label: "Points Activity" },
    { key: "tier_alerts" as const, icon: Star, label: "Tier Updates" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => navigate("/profile")} className="p-1"><ChevronLeft size={22} className="text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Appearance */}
      <div className="px-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Appearance</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {lightMode ? <Sun size={18} className="text-muted-foreground" /> : <Moon size={18} className="text-muted-foreground" />}
              <span className="text-sm font-medium text-foreground">Light Mode</span>
            </div>
            <Toggle enabled={lightMode} onToggle={() => setLightMode(!lightMode)} />
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="px-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Notification Channels</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {channels.map((ch, i) => (
            <div key={ch.key} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <ch.icon size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{ch.label}</span>
              </div>
              <Toggle enabled={settings[ch.key]} onToggle={() => updateSetting(ch.key, !settings[ch.key])} />
            </div>
          ))}
        </div>
      </div>

      {/* Alert Types */}
      <div className="px-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Alert Types</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {alerts.map((al, i) => (
            <div key={al.key} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <al.icon size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{al.label}</span>
              </div>
              <Toggle enabled={settings[al.key]} onToggle={() => updateSetting(al.key, !settings[al.key])} />
            </div>
          ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="px-4 mb-4">
        <button onClick={() => navigate("/terms")} className="w-full flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Terms & Conditions</span>
          </div>
          <ChevronLeft size={16} className="text-muted-foreground rotate-180" />
        </button>
      </div>

      {/* Account Security */}
      <div className="px-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Account Security</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 border-b border-border hover:bg-secondary transition-colors">
            <Shield size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Change Password</span>
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center gap-3 p-4 hover:bg-destructive/10 transition-colors">
            <Trash2 size={18} className="text-destructive" />
            <span className="text-sm font-medium text-destructive">Delete Account</span>
          </button>
        </div>
      </div>

      {/* First confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, including all points, rewards, purchase history, and personal data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-secondary text-foreground font-medium py-3 rounded-xl hover:bg-muted transition-colors">
              Cancel
            </button>
            <button onClick={() => { setShowDeleteConfirm(false); setShowFinalConfirm(true); }} className="flex-1 bg-destructive text-destructive-foreground font-medium py-3 rounded-xl hover:opacity-90 transition-colors">
              Yes, Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second (final) confirmation dialog */}
      <Dialog open={showFinalConfirm} onOpenChange={setShowFinalConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This is your last chance. Once deleted, your account and all associated data will be permanently erased and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <button onClick={() => setShowFinalConfirm(false)} className="flex-1 bg-secondary text-foreground font-medium py-3 rounded-xl hover:bg-muted transition-colors">
              Go Back
            </button>
            <button onClick={handleDeleteAccount} disabled={deleteLoading} className="flex-1 bg-destructive text-destructive-foreground font-medium py-3 rounded-xl hover:opacity-90 transition-colors disabled:opacity-50">
              {deleteLoading ? "Deleting..." : "Delete Forever"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
