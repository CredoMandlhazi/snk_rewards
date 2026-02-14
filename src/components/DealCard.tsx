import { motion } from "framer-motion";

interface DealCardProps {
  image: string;
  title: string;
  discount: string;
  brand: string;
  expiresIn?: string;
}

const DealCard = ({ image, title, discount, brand, expiresIn }: DealCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="min-w-[260px] snap-start rounded-xl overflow-hidden bg-card border border-border group cursor-pointer"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 loyalty-gradient px-3 py-1 rounded-full">
          <span className="text-xs font-bold text-primary-foreground">{discount}</span>
        </div>
        {expiresIn && (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-[10px] text-muted-foreground">{expiresIn}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{brand}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{title}</p>
      </div>
    </motion.div>
  );
};

export default DealCard;
