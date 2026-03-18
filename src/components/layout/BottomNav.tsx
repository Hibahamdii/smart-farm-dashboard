import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Map, Droplets, BarChart3, Bell, Settings, LogOut, CloudSun, Shield
} from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const { role, signOut } = useAuth();

  const adminItems = [
    { path: "/admin", icon: Shield, label: "Admin" },
    { path: "/parcelles", icon: Map, label: "Parcelles" },
    { path: "/meteo", icon: CloudSun, label: "Météo" },
    { path: "/alertes", icon: Bell, label: "Alertes" },
    { path: "/settings", icon: Settings, label: "Config" },
  ];

  const farmerItems = [
    { path: "/dashboard", icon: Home, label: "Accueil" },
    { path: "/parcelles", icon: Map, label: "Parcelles" },
    { path: "/irrigation", icon: Droplets, label: "Irrigation" },
    { path: "/meteo", icon: CloudSun, label: "Météo" },
    { path: "/historique", icon: BarChart3, label: "Stats" },
    { path: "/alertes", icon: Bell, label: "Alertes" },
  ];

  const navItems = role === "admin" ? adminItems : farmerItems;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-lg border border-border px-2 py-2 flex items-center justify-between gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-xl min-w-[48px] transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-semibold mt-0.5">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="flex flex-col items-center justify-center px-3 py-2 rounded-xl min-w-[48px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-0.5">Sortir</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
