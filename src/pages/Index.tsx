import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Search, MapPin, Droplets, Wind, Gauge, Sun, Cloud, CloudRain, CloudSun,
  Eye, Sprout, Bell, ArrowRight, Zap, TrendingUp, TrendingDown,
  Thermometer, Play, AlertTriangle, CheckCircle2, Activity, Square
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell,
  AreaChart, Area, Tooltip
} from "recharts";
import parcelle1 from "@/assets/parcelle-1.jpg";
import parcelle2 from "@/assets/parcelle-2.jpg";
import parcelle3 from "@/assets/parcelle-3.jpg";
import parcelle4 from "@/assets/parcelle-4.jpg";

const parcellesData = [
  { id: 1, name: "Parcelle Nord", surface: "2.5 ha", type: "Maraîchage", humidity: 65, temp: 32, img: parcelle1, status: "ok" },
  { id: 2, name: "Oliveraie Est", surface: "4.0 ha", type: "Oliviers", humidity: 38, temp: 35, img: parcelle2, status: "warning" },
  { id: 3, name: "Champ de Blé", surface: "6.2 ha", type: "Blé dur", humidity: 42, temp: 37, img: parcelle3, status: "critical" },
  { id: 4, name: "Jardin Légumes", surface: "1.8 ha", type: "Légumes", humidity: 78, temp: 30, img: parcelle4, status: "ok" },
];

const weeklyHumidity = [
  { day: "Lun", p1: 70, p2: 42, p3: 48, p4: 80 },
  { day: "Mar", p1: 68, p2: 40, p3: 45, p4: 78 },
  { day: "Mer", p1: 65, p2: 38, p3: 42, p4: 75 },
  { day: "Jeu", p1: 62, p2: 36, p3: 40, p4: 77 },
  { day: "Ven", p1: 60, p2: 35, p3: 38, p4: 72 },
  { day: "Sam", p1: 58, p2: 33, p3: 42, p4: 78 },
  { day: "Dim", p1: 65, p2: 38, p3: 45, p4: 80 },
];

const waterConsumption = [
  { day: "Lun", value: 320 }, { day: "Mar", value: 280 }, { day: "Mer", value: 450 },
  { day: "Jeu", value: 380 }, { day: "Ven", value: 520 }, { day: "Sam", value: 290 },
  { day: "Dim", value: 180 },
];

const forecast = [
  { day: "SAM", temp: 10, icon: CloudSun },
  { day: "DIM", temp: 15, icon: Cloud },
  { day: "LUN", temp: 11, icon: CloudRain },
  { day: "MAR", temp: 10, icon: CloudRain },
  { day: "MER", temp: 12, icon: CloudSun },
  { day: "JEU", temp: 10, icon: Cloud },
];

const recentAlerts = [
  { id: 1, type: "warning" as const, message: "Humidité faible — Oliveraie Est (38%)", time: "Il y a 2h" },
  { id: 2, type: "critical" as const, message: "Température élevée — Champ de Blé (37°C)", time: "Il y a 3h" },
  { id: 3, type: "info" as const, message: "Irrigation terminée — Jardin Légumes", time: "Il y a 5h" },
];

const alertStyles = {
  warning: { bg: "bg-warning/10", text: "text-warning", icon: AlertTriangle },
  critical: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle },
  info: { bg: "bg-primary/10", text: "text-primary", icon: CheckCircle2 },
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("S");
  const [rateUnit, setRateUnit] = useState<"L" | "m3">("L");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [irrigatingId, setIrrigatingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) toast.info(`Recherche: "${searchQuery}"`);
  };

  const handleQuickIrrigation = (id: number, name: string) => {
    setIrrigatingId(id);
    toast.success(`🚿 Irrigation démarrée — ${name}`);
    setTimeout(() => {
      setIrrigatingId(null);
      toast.info(`✅ Irrigation terminée — ${name}`);
    }, 5000);
  };

  const avgHumidity = Math.round(parcellesData.reduce((s, p) => s + p.humidity, 0) / parcellesData.length);
  const avgTemp = Math.round(parcellesData.reduce((s, p) => s + p.temp, 0) / parcellesData.length);
  const totalWater = waterConsumption.reduce((s, d) => s + d.value, 0);

  const dayName = currentTime.toLocaleDateString("fr-FR", { weekday: "long" });
  const timeStr = currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold">Smart Irrigation</h1>
            <p className="text-xs text-muted-foreground capitalize">{dayName}, {timeStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card rounded-xl px-3 py-2 border border-border max-w-xs">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground w-32"
            />
          </div>
          <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-2 border border-border">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold">Alger</span>
            <Sun className="w-4 h-4 text-warning ml-1" />
            <span className="text-sm font-bold">25°C</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Parcelles", value: `${parcellesData.length}`, icon: Sprout, color: "text-primary", bgColor: "bg-primary/10" },
          { label: "Humidité Moy.", value: `${avgHumidity}%`, icon: Droplets, color: avgHumidity < 50 ? "text-destructive" : "text-primary", bgColor: avgHumidity < 50 ? "bg-destructive/10" : "bg-primary/10" },
          { label: "Température", value: `${avgTemp}°C`, icon: Thermometer, color: avgTemp > 35 ? "text-destructive" : "text-warning", bgColor: avgTemp > 35 ? "bg-destructive/10" : "bg-warning/10" },
          { label: "Eau Totale", value: `${totalWater}L`, icon: Activity, color: "text-primary", bgColor: "bg-primary/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Parcelles + Weather */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Mes Parcelles</h3>
            <Link to="/parcelles">
              <Button variant="ghost" size="sm" className="text-primary rounded-xl text-xs h-7">
                Voir tout <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {parcellesData.map((p) => (
              <Link key={p.id} to={`/parcelles/${p.id}`} className="group">
                <div className="rounded-xl overflow-hidden border border-border/50 card-hover bg-secondary/30">
                  <div className="relative h-20">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ring-2 ring-card ${
                      p.status === "ok" ? "bg-primary" : p.status === "warning" ? "bg-warning" : "bg-destructive"
                    }`} />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] font-bold ${p.humidity < 50 ? "text-destructive" : "text-primary"}`}>
                        💧{p.humidity}%
                      </span>
                      <span className={`text-[10px] font-bold ${p.temp > 35 ? "text-destructive" : "text-muted-foreground"}`}>
                        🌡{p.temp}°
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">Météo</h3>
            <span className="bg-primary/20 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize">
              {dayName}
            </span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-primary">25</span>
                <span className="text-lg text-primary">°</span>
              </div>
              <p className="text-xs text-muted-foreground">H: 33° · L: 19°</p>
            </div>
            <Sun className="w-12 h-12 text-warning" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { icon: Droplets, label: "Humidité", val: "74%" },
              { icon: Wind, label: "Vent", val: "18 km/h" },
              { icon: Gauge, label: "Pression", val: "1019" },
              { icon: Eye, label: "Visibilité", val: "4 km" },
            ].map((w) => {
              const WIcon = w.icon;
              return (
                <div key={w.label} className="bg-secondary/50 rounded-lg p-2 text-center">
                  <WIcon className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" />
                  <p className="text-[10px] text-muted-foreground">{w.label}</p>
                  <p className="text-xs font-bold">{w.val}</p>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-6 gap-1">
            {forecast.map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.day} className="text-center bg-secondary/30 rounded-lg p-1.5">
                  <p className="text-[9px] font-bold text-muted-foreground">{f.day}</p>
                  <FIcon className="w-3 h-3 mx-auto my-0.5 text-muted-foreground" />
                  <p className="text-xs font-bold">{f.temp}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Évolution Humidité</h3>
            <div className="flex gap-1">
              {["S", "M", "6M", "A"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                    timeFilter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyHumidity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 20%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(120 5% 55%)" }} stroke="hsl(150 10% 20%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(120 5% 55%)" }} stroke="hsl(150 10% 20%)" domain={[20, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(150 15% 14%)", border: "1px solid hsl(150 10% 20%)", color: "hsl(120 10% 92%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="p1" stroke="hsl(142 70% 50%)" fill="hsl(142 70% 50% / 0.1)" strokeWidth={2} name="P. Nord" />
              <Area type="monotone" dataKey="p2" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.1)" strokeWidth={2} name="Oliveraie" />
              <Area type="monotone" dataKey="p3" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50% / 0.1)" strokeWidth={2} name="Blé" />
              <Area type="monotone" dataKey="p4" stroke="hsl(210 80% 55%)" fill="hsl(210 80% 55% / 0.1)" strokeWidth={2} name="Légumes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Consommation Eau</h3>
            <div className="flex rounded-lg overflow-hidden border border-border">
              {(["L", "m3"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setRateUnit(u)}
                  className={`px-2.5 py-0.5 text-[10px] font-semibold transition-all ${rateUnit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {u === "L" ? "Litres" : "m³"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={waterConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 20%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(120 5% 55%)" }} stroke="hsl(150 10% 20%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(120 5% 55%)" }} stroke="hsl(150 10% 20%)" />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(150 15% 14%)", border: "1px solid hsl(150 10% 20%)", color: "hsl(120 10% 92%)", fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {waterConsumption.map((entry, i) => (
                  <Cell key={i} fill={entry.value > 400 ? "hsl(38 92% 50%)" : "hsl(142 70% 50%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Irrigation + Alerts + Progress */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Irrigation Rapide</h3>
            <Link to="/irrigation">
              <span className="text-[10px] text-primary font-semibold hover:underline">Contrôle →</span>
            </Link>
          </div>
          <div className="space-y-2">
            {parcellesData.map((p) => (
              <div key={p.id} className={`flex items-center justify-between rounded-xl p-2.5 transition-all ${
                irrigatingId === p.id ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"
              }`}>
                <div className="flex items-center gap-2">
                  <Droplets className={`w-3.5 h-3.5 ${irrigatingId === p.id ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                  <span className="text-xs font-semibold">{p.name}</span>
                </div>
                <button
                  onClick={() => {
                    if (irrigatingId === p.id) {
                      setIrrigatingId(null);
                      toast.warning(`Irrigation arrêtée — ${p.name}`);
                    } else {
                      handleQuickIrrigation(p.id, p.name);
                    }
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    irrigatingId === p.id ? "bg-destructive text-white" : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {irrigatingId === p.id ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Alertes</h3>
            </div>
            <Link to="/alertes">
              <span className="text-[10px] text-primary font-semibold hover:underline">Tout →</span>
            </Link>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((a) => {
              const style = alertStyles[a.type];
              const AIcon = style.icon;
              return (
                <div key={a.id} className={`rounded-xl p-2.5 ${style.bg}`}>
                  <div className="flex items-start gap-2">
                    <AIcon className={`w-3.5 h-3.5 ${style.text} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-[11px] font-semibold leading-tight">{a.message}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="font-bold text-sm mb-3">Progression Culture</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(150 10% 20%)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(142 70% 50%)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${0.65 * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Sprout className="w-4 h-4 text-primary mb-0.5" />
                <p className="text-lg font-extrabold text-primary">65%</p>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {[["Culture", "Blé dur"], ["Phase", "Remplissage"], ["Maturité", "30 jours"], ["Semis", "Sep 15"]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-[11px] border-b border-border/50 pb-1 last:border-0">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Système", status: "Actif", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
          { label: "Capteurs", status: "4/4 OK", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
          { label: "Économie", status: "-32%", icon: TrendingDown, color: "text-primary", bg: "bg-primary/10" },
          { label: "Score", status: "7.5/10", icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
        ].map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <SIcon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="text-sm font-extrabold">{s.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
