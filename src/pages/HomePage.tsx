import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LoyaltyCard from "@/components/LoyaltyCard";
import DealCard from "@/components/DealCard";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/logo.png";

import dealGstar from "@/assets/deal-gstar.jpg";
import dealAdidas from "@/assets/deal-adidas.jpg";
import dealNike from "@/assets/deal-nike.jpg";
import dealDiesel from "@/assets/deal-diesel.jpg";

const fallbackImages = [dealGstar, dealAdidas, dealNike, dealDiesel];

interface Deal {
  id: string;
  title: string;
  discount: string;
  brand: string | null;
  image_url: string | null;
  end_date: string | null;
}

interface Transaction {
  id: string;
  type: string;
  points: number;
  description: string | null;
  created_at: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { profile, tier } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase.from("deals").select("*").eq("active", true).limit(4)
      .then(({ data }) => { if (data) setDeals(data as Deal[]); });

    supabase.from("point_transactions").select("*").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setTransactions(data as Transaction[]); });

    supabase.from("notifications").select("id", { count: "exact" }).eq("read", false)
      .then(({ count }) => { if (count) setUnreadCount(count); });
  }, []);

  const displayName = profile ? `${profile.name} ${profile.surname}`.trim() || "Member" : "Member";
  const points = profile?.points_balance ?? 0;
  const totalEarned = profile?.total_points_earned ?? 0;
  const redeemed = totalEarned - points;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="text-lg font-bold text-foreground">{displayName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src={logo} alt="SNK" className="h-6 brightness-0 invert opacity-60" />
          <button onClick={() => navigate("/profile")} className="relative p-2 rounded-full bg-card border border-border">
            <Bell size={18} className="text-foreground" />
            {unreadCount > 0 && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />}
          </button>
        </div>
      </div>

      <LoyaltyCard />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 mx-4 mt-4">
        {[
          { label: "Available", value: points.toLocaleString(), color: "text-accent" },
          { label: "Earned", value: totalEarned.toLocaleString(), color: "text-foreground" },
          { label: "Redeemed", value: redeemed.toLocaleString(), color: "text-primary" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Hot Deals</h2>
          <button onClick={() => navigate("/deals")} className="flex items-center gap-1 text-xs text-primary font-medium">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {(deals.length > 0 ? deals : [
            { id: "1", title: "G-Star RAW Sneakers", discount: "30% OFF", brand: "G-Star", image_url: null, end_date: null },
            { id: "2", title: "Adidas SL 72 RS", discount: "25% OFF", brand: "Adidas", image_url: null, end_date: null },
          ]).map((deal, i) => (
            <motion.div key={deal.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
              <DealCard
                image={deal.image_url || fallbackImages[i % fallbackImages.length]}
                title={deal.title}
                discount={deal.discount}
                brand={deal.brand || ""}
                expiresIn={deal.end_date ? `${Math.max(0, Math.ceil((new Date(deal.end_date).getTime() - Date.now()) / 86400000))} days left` : undefined}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 px-4">
        <h2 className="text-base font-bold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {(transactions.length > 0 ? transactions : [
            { id: "1", type: "earn", points: 120, description: "Purchase at SNK Mall", created_at: new Date().toISOString() },
            { id: "2", type: "redeem", points: -500, description: "Reward Redeemed", created_at: new Date(Date.now() - 86400000).toISOString() },
          ]).map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{t.description || t.type}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(t.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-sm font-bold ${t.type === "earn" || t.points > 0 ? "text-accent" : "text-primary"}`}>
                {t.points > 0 ? `+${t.points}` : t.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
