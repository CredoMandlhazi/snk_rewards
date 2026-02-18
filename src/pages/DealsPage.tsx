import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

import dealGstar from "@/assets/deal-gstar.jpg";

interface Deal {
  id: string;
  title: string;
  discount: string;
  brand: string | null;
  image_url: string | null;
  end_date: string | null;
  description: string | null;
}

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("deals").select("*").eq("active", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setDeals(data as Deal[]); });
  }, []);

  const filtered = deals.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.brand || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Deals</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Exclusive offers just for you</p>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {filtered.map((deal, i) => {
          const imgSrc = deal.image_url && deal.image_url.startsWith("http") ? deal.image_url : dealGstar;
          const daysLeft = deal.end_date ? Math.max(0, Math.ceil((new Date(deal.end_date).getTime() - Date.now()) / 86400000)) : null;
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-xl overflow-hidden bg-card border border-border group cursor-pointer"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={imgSrc}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = dealGstar; }}
                />
                <div className="absolute top-2 left-2 loyalty-gradient px-2 py-0.5 rounded-full">
                  <span className="text-[10px] font-bold text-primary-foreground">{deal.discount}</span>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{deal.brand}</p>
                <p className="text-xs font-medium text-foreground mt-0.5 line-clamp-1">{deal.title}</p>
                {daysLeft !== null && <p className="text-[10px] text-primary mt-1">Expires in {daysLeft} days</p>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default DealsPage;
