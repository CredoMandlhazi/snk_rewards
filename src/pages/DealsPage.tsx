import { motion } from "framer-motion";
import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import dealGstar from "@/assets/deal-gstar.jpg";
import dealAdidas from "@/assets/deal-adidas.jpg";
import dealNike from "@/assets/deal-nike.jpg";
import dealDiesel from "@/assets/deal-diesel.jpg";
import dealCap from "@/assets/deal-cap.jpg";
import dealBucket from "@/assets/deal-bucket.jpg";
import dealConverse from "@/assets/deal-converse.jpg";
import dealReplay from "@/assets/deal-replay.jpg";
import dealNorthface from "@/assets/deal-northface.jpg";

const allDeals = [
  { image: dealGstar, title: "G-Star RAW Sneakers", discount: "30% OFF", brand: "G-Star", expires: "2 days" },
  { image: dealAdidas, title: "Adidas SL 72 RS", discount: "25% OFF", brand: "Adidas", expires: "5 days" },
  { image: dealNike, title: "Nike Club Fleece", discount: "20% OFF", brand: "Nike", expires: "3 days" },
  { image: dealDiesel, title: "Diesel Bundle", discount: "40% OFF", brand: "Diesel", expires: "1 day" },
  { image: dealCap, title: "Sports Cap Collection", discount: "15% OFF", brand: "Various", expires: "7 days" },
  { image: dealBucket, title: "Adidas Bucket Hat", discount: "20% OFF", brand: "Adidas", expires: "4 days" },
  { image: dealConverse, title: "Converse All Star", discount: "35% OFF", brand: "Converse", expires: "6 days" },
  { image: dealReplay, title: "Replay Attitude Set", discount: "30% OFF", brand: "Replay", expires: "2 days" },
  { image: dealNorthface, title: "North Face Tee Collection", discount: "25% OFF", brand: "The North Face", expires: "3 days" },
];

const DealsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Deals</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Exclusive offers just for you</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search deals..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Deals Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {allDeals.map((deal, i) => (
          <motion.div
            key={deal.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-xl overflow-hidden bg-card border border-border group cursor-pointer"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 loyalty-gradient px-2 py-0.5 rounded-full">
                <span className="text-[10px] font-bold text-primary-foreground">{deal.discount}</span>
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{deal.brand}</p>
              <p className="text-xs font-medium text-foreground mt-0.5 line-clamp-1">{deal.title}</p>
              <p className="text-[10px] text-primary mt-1">Expires in {deal.expires}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default DealsPage;
