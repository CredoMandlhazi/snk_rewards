import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Lock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface Tier {
  id: string;
  name: string;
  min_points: number;
  discount_percentage: number;
  benefits: string[] | null;
  sort_order: number;
}

interface Reward {
  id: string;
  title: string;
  description: string | null;
  points_required: number;
  tier_required: string | null;
  active: boolean;
}

const RewardsPage = () => {
  const { profile, tier: currentTier } = useAuth();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    supabase.from("tiers").select("*").order("sort_order")
      .then(({ data }) => { if (data) setTiers(data as Tier[]); });
    supabase.from("rewards").select("*").eq("active", true).order("points_required")
      .then(({ data }) => { if (data) setRewards(data as Reward[]); });
  }, []);

  const currentPoints = profile?.points_balance ?? 0;
  const currentTierOrder = currentTier?.sort_order ?? 1;
  const nextTier = tiers.find(t => t.sort_order === currentTierOrder + 1);
  const nextTierPoints = nextTier?.min_points ?? 5000;
  const progress = Math.min(100, (currentPoints / nextTierPoints) * 100);

  const handleRedeem = async (reward: Reward) => {
    if (currentPoints < reward.points_required) {
      toast.error("Not enough points");
      return;
    }
    toast.success(`Redeemed: ${reward.title}! Visit a store to claim.`);
  };

  // Fallback rewards if none in DB
  const displayRewards = rewards.length > 0 ? rewards : [
    { id: "1", title: "10% Off Next Purchase", points_required: 500, tier_required: null, active: true, description: null },
    { id: "2", title: "Free Shipping", points_required: 750, tier_required: null, active: true, description: null },
    { id: "3", title: "Early Access to Sales", points_required: 1000, tier_required: null, active: true, description: null },
    { id: "4", title: "Birthday Double Points", points_required: 1500, tier_required: null, active: true, description: null },
    { id: "5", title: "Exclusive VIP Event", points_required: 3000, tier_required: null, active: true, description: null },
    { id: "6", title: "Personal Stylist Session", points_required: 5000, tier_required: null, active: true, description: null },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Rewards</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your loyalty benefits</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="mx-4 bg-card border border-border rounded-2xl p-6 text-center mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Available Points</p>
        <p className="text-4xl font-bold text-accent mt-1">{currentPoints.toLocaleString()}</p>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>{currentTier?.name || "Bronze"}</span>
            <span>{currentPoints.toLocaleString()} / {nextTierPoints.toLocaleString()}</span>
            <span>{nextTier?.name || "VIP"}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full gold-gradient rounded-full" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {Math.max(0, nextTierPoints - currentPoints).toLocaleString()} points to {nextTier?.name || "VIP"}
          </p>
        </div>
      </motion.div>

      <div className="flex gap-2 px-4 mb-6">
        {tiers.map((t) => {
          const isActive = currentTier?.id === t.id;
          return (
            <div key={t.id} className={`flex-1 rounded-xl py-2.5 text-center border ${isActive ? "border-accent" : "border-border"} bg-card`}>
              <Star size={16} className={`mx-auto mb-1 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
              <p className={`text-[10px] font-semibold ${isActive ? "text-accent" : "text-muted-foreground"}`}>{t.name}</p>
            </div>
          );
        })}
      </div>

      <div className="px-4">
        <h2 className="text-base font-bold text-foreground mb-3">Available Rewards</h2>
        <div className="space-y-2">
          {displayRewards.map((reward, i) => {
            const unlocked = currentPoints >= reward.points_required;
            return (
              <motion.div key={reward.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className={`flex items-center justify-between bg-card border border-border rounded-xl p-4 ${!unlocked ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${unlocked ? "bg-accent/20" : "bg-muted"}`}>
                    {unlocked ? <Check size={14} className="text-accent" /> : <Lock size={14} className="text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{reward.title}</p>
                    <p className="text-[10px] text-muted-foreground">{reward.points_required.toLocaleString()} points</p>
                  </div>
                </div>
                {unlocked && (
                  <button onClick={() => handleRedeem(reward)} className="loyalty-gradient text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-full">
                    Redeem
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RewardsPage;
