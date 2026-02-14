import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const LoyaltyCard = () => {
  const { profile, tier } = useAuth();

  const displayName = profile ? `${profile.name} ${profile.surname}`.trim() || "Member" : "Member";
  const tierName = tier?.name || "Bronze";
  const points = profile?.points_balance ?? 0;
  const barcode = profile?.barcode || "SNK-0000-0000";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-4 rounded-2xl overflow-hidden loyalty-gradient p-[1px]">
      <div className="card-shine rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)" }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <img src={logo} alt="SNK" className="h-8 brightness-0 invert" />
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">{tierName} Member</span>
          </div>
          <div className="bg-foreground/10 rounded-lg p-3 mb-4 flex items-center justify-center">
            <div className="flex gap-[2px]">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="bg-foreground/80 rounded-sm" style={{ width: Math.random() > 0.5 ? 2 : 1, height: 36 }} />
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground tracking-[0.3em] mb-4">{barcode}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Member</p>
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Points</p>
              <p className="text-sm font-semibold text-accent">{points.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoyaltyCard;
