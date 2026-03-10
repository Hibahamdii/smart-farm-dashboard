import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Map, Droplets, BarChart3, Bell, Settings, Sprout, Sun, Tractor, Thermometer, CloudRain, Leaf } from "lucide-react";

const navItems = [
  { path: "/", icon: Sprout, label: "Cultures" },
  { path: "/parcelles", icon: Map, label: "Parcelles" },
  { path: "/irrigation", icon: Droplets, label: "Irrigation" },
  { path: "/", icon: Tractor, label: "Machines" },
  { path: "/", icon: CloudRain, label: "Météo" },
  { path: "/", icon: Leaf, label: "Sol", active: true },
  { path: "/historique", icon: BarChart3, label: "Stats" },
  { path: "/", icon: Sun, label: "Solaire" },
  { path: "/", icon: Thermometer, label: "Capteurs" },
  { path: "/alertes", icon: Bell, label: "Alertes" },
  { path: "/settings", icon: Settings, label: "Config" },
  { path: "/", icon: Home, label: "Accueil" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-card rounded-2xl shadow-lg border border-border px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && item.path !== "/" 
            ? true 
            : item.active && location.pathname === "/";
          return (
            <Link
              key={i}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl min-w-[52px] transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
