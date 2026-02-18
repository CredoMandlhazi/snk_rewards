import { Home, Tag, Gift, MapPin, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";


const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/deals", icon: Tag, label: "Deals" },
  { path: "/rewards", icon: Gift, label: "Rewards" },
  { path: "/stores", icon: MapPin, label: "Stores" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3 transition-colors"
            >
              <tab.icon
                size={20}
                fill={isActive ? "hsl(var(--primary))" : "none"}
                className={isActive ? "text-primary-foreground" : "text-muted-foreground"}
                strokeWidth={isActive ? 1.5 : 2}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
