import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: "◫" },
  { path: "/parcelles", label: "Parcelles", icon: "▦" },
  { path: "/irrigation", label: "Irrigation", icon: "◈" },
  { path: "/historique", label: "Historique", icon: "▤" },
  { path: "/alertes", label: "Alertes", icon: "△" },
  { path: "/settings", label: "Settings", icon: "⚙" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r-grid border-sidebar-border flex flex-col shrink-0">
      <div className="p-6 border-b-grid border-sidebar-border">
        <h1 className="font-data text-xl font-bold text-sidebar-foreground tracking-wider uppercase">
          Irri<span className="text-sidebar-accent-foreground/60">gate</span>
        </h1>
        <p className="text-xs text-sidebar-foreground/50 font-ui mt-1">Système de Ri Intelligent</p>
      </div>
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-3 font-data text-sm tracking-wide transition-colors border-l-4",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border-transparent"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t-grid border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/40 font-ui">
          v1.0 — Système Actif
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
