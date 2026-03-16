import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search, MapPin, Droplets, Wind, Gauge, Sun, Cloud, CloudRain, CloudSun,
  Eye, Sprout, Bell, ArrowRight, Zap, TrendingUp, TrendingDown,
  Thermometer, Play, AlertTriangle, CheckCircle2, Activity, Square,
  Plus, Globe, ChevronDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell,
  AreaChart, Area, Tooltip
} from "recharts";

type Parcelle = {
  id: number; name: string; surface: string; type: string;
  humidity: number; temp: number; lat: number; lng: number; status: string;
};

const defaultParcelles: Parcelle[] = [
  { id: 1, name: "Parcelle Nord", surface: "2.5 ha", type: "Maraîchage", humidity: 65, temp: 32, lat: 36.72, lng: 3.05, status: "ok" },
  { id: 2, name: "Oliveraie Est", surface: "4.0 ha", type: "Oliviers", humidity: 38, temp: 35, lat: 36.73, lng: 3.08, status: "warning" },
  { id: 3, name: "Champ de Blé", surface: "6.2 ha", type: "Blé dur", humidity: 42, temp: 37, lat: 36.71, lng: 3.02, status: "critical" },
  { id: 4, name: "Jardin Légumes", surface: "1.8 ha", type: "Légumes", humidity: 78, temp: 30, lat: 36.74, lng: 3.06, status: "ok" },
];

const countriesData: Record<string, { lat: number; lng: number; temp: number; humidity: number; wind: string; pressure: string; visibility: string }> = {
  "Algérie": { lat: 36.725, lng: 3.05, temp: 25, humidity: 74, wind: "18 km/h", pressure: "1019", visibility: "4 km" },
  "Tunisie": { lat: 36.8, lng: 10.18, temp: 28, humidity: 65, wind: "12 km/h", pressure: "1015", visibility: "6 km" },
  "Maroc": { lat: 33.97, lng: -6.85, temp: 22, humidity: 70, wind: "15 km/h", pressure: "1020", visibility: "5 km" },
  "France": { lat: 48.85, lng: 2.35, temp: 14, humidity: 82, wind: "22 km/h", pressure: "1013", visibility: "8 km" },
  "Egypte": { lat: 30.04, lng: 31.24, temp: 33, humidity: 40, wind: "10 km/h", pressure: "1012", visibility: "7 km" },
  "Espagne": { lat: 40.42, lng: -3.7, temp: 19, humidity: 55, wind: "14 km/h", pressure: "1018", visibility: "10 km" },
};

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
  const [parcelles, setParcelles] = useState<Parcelle[]>(defaultParcelles);
  const [parcelleFilter, setParcelleFilter] = useState<string>("Toutes");
  const [selectedCountry, setSelectedCountry] = useState("Algérie");
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParcelle, setNewParcelle] = useState({ name: "", surface: "", type: "", lat: "", lng: "" });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const countryInfo = countriesData[selectedCountry];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredParcelles = parcelleFilter === "Toutes"
    ? parcelles
    : parcelles.filter((p) => `P${p.id}` === parcelleFilter);

  // Map init
  const initMap = useCallback((node: HTMLDivElement | null) => {
    if (!node || mapInstanceRef.current) return;
    mapContainerRef.current = node;
    requestAnimationFrame(() => {
      if (mapInstanceRef.current) return;
      const map = L.map(node, {
        center: [countryInfo.lat, countryInfo.lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 400);
    });
  }, []);

  // Update markers when parcelles or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    filteredParcelles.forEach((p) => {
      const isLow = p.humidity < 50;
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width:30px;height:30px;border-radius:50%;
          background:${isLow ? "hsl(0 72% 51%)" : "hsl(142 60% 40%)"};
          border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15);
          display:flex;align-items:center;justify-content:center;
        "><span style="color:white;font-size:11px;font-weight:bold;">${p.id}</span></div>`,
        iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -18],
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:2px;">
        <strong>${p.name}</strong><br/><span style="color:#666;">${p.type} · ${p.surface}</span><br/>
        <span style="color:${isLow ? '#ef4444' : '#16a34a'};">💧 ${p.humidity}%</span> 🌡 ${p.temp}°C
      </div>`);
      markersRef.current.push(marker);
    });
  }, [filteredParcelles]);

  // Pan map when country changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([countryInfo.lat, countryInfo.lng], 14, { animate: true });
    }
  }, [selectedCountry, countryInfo]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
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

  const handleAddParcelle = () => {
    if (!newParcelle.name || !newParcelle.surface || !newParcelle.type) {
      toast.error("Remplissez tous les champs");
      return;
    }
    const id = parcelles.length > 0 ? Math.max(...parcelles.map((p) => p.id)) + 1 : 1;
    const np: Parcelle = {
      id,
      name: newParcelle.name,
      surface: newParcelle.surface,
      type: newParcelle.type,
      humidity: Math.round(40 + Math.random() * 40),
      temp: Math.round(25 + Math.random() * 12),
      lat: parseFloat(newParcelle.lat) || countryInfo.lat + (Math.random() - 0.5) * 0.03,
      lng: parseFloat(newParcelle.lng) || countryInfo.lng + (Math.random() - 0.5) * 0.03,
      status: "ok",
    };
    setParcelles((prev) => [...prev, np]);
    setNewParcelle({ name: "", surface: "", type: "", lat: "", lng: "" });
    setShowAddForm(false);
    toast.success(`Parcelle "${np.name}" ajoutée !`);
  };

  const avgHumidity = Math.round(filteredParcelles.reduce((s, p) => s + p.humidity, 0) / (filteredParcelles.length || 1));
  const avgTemp = Math.round(filteredParcelles.reduce((s, p) => s + p.temp, 0) / (filteredParcelles.length || 1));
  const totalWater = waterConsumption.reduce((s, d) => s + d.value, 0);

  const dayName = currentTime.toLocaleDateString("fr-FR", { weekday: "long" });
  const timeStr = currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Smart Irrigation</h1>
            <p className="text-xs text-muted-foreground capitalize">{dayName}, {timeStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card rounded-xl px-3 py-2 border border-border max-w-xs shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground w-32"
            />
          </div>
          {/* Country selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-2 bg-card rounded-xl px-3 py-2 border border-border shadow-sm hover:shadow transition-shadow"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold">{selectedCountry}</span>
              <Sun className="w-4 h-4 text-warning ml-1" />
              <span className="text-sm font-bold">{countryInfo.temp}°C</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            {showCountryMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 py-1 min-w-[160px]">
                {Object.keys(countriesData).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCountry(c); setShowCountryMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                      c === selectedCountry ? "text-primary font-bold bg-accent" : "text-foreground"
                    }`}
                  >
                    {c} — {countriesData[c].temp}°C
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Parcelles", value: `${filteredParcelles.length}`, icon: Sprout, color: "text-primary", bgColor: "bg-primary/10" },
          { label: "Humidité Moy.", value: `${avgHumidity}%`, icon: Droplets, color: avgHumidity < 50 ? "text-destructive" : "text-primary", bgColor: avgHumidity < 50 ? "bg-destructive/10" : "bg-primary/10" },
          { label: "Température", value: `${avgTemp}°C`, icon: Thermometer, color: avgTemp > 35 ? "text-destructive" : "text-warning", bgColor: avgTemp > 35 ? "bg-destructive/10" : "bg-warning/10" },
          { label: "Eau Totale", value: `${totalWater}L`, icon: Activity, color: "text-primary", bgColor: "bg-primary/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-4 stat-accent">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Map + Weather */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Carte des Parcelles</h3>
            <div className="flex items-center gap-1">
              {["Toutes", ...parcelles.map((p) => `P${p.id}`)].map((f) => (
                <button
                  key={f}
                  onClick={() => setParcelleFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    parcelleFilter === f
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="ml-2 w-7 h-7 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Parcelle form */}
          {showAddForm && (
            <div className="bg-accent/50 rounded-xl p-3 mb-3 border border-border">
              <p className="text-xs font-bold mb-2 text-foreground">Ajouter une parcelle</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input placeholder="Nom" value={newParcelle.name} onChange={(e) => setNewParcelle({ ...newParcelle, name: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Surface (ex: 3 ha)" value={newParcelle.surface} onChange={(e) => setNewParcelle({ ...newParcelle, surface: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Type (ex: Blé)" value={newParcelle.type} onChange={(e) => setNewParcelle({ ...newParcelle, type: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input placeholder="Latitude (optionnel)" value={newParcelle.lat} onChange={(e) => setNewParcelle({ ...newParcelle, lat: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Longitude (optionnel)" value={newParcelle.lng} onChange={(e) => setNewParcelle({ ...newParcelle, lng: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddParcelle} className="text-xs rounded-lg h-7">Ajouter</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="text-xs rounded-lg h-7">Annuler</Button>
              </div>
            </div>
          )}

          <div ref={initMap} style={{ height: 280, width: "100%", borderRadius: 12, zIndex: 1 }} />
        </div>

        {/* Weather */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-foreground">Météo — {selectedCountry}</h3>
            <span className="bg-primary/15 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize">
              {dayName}
            </span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-primary">{countryInfo.temp}</span>
                <span className="text-lg text-primary">°</span>
              </div>
              <p className="text-xs text-muted-foreground">H: {countryInfo.temp + 8}° · L: {countryInfo.temp - 6}°</p>
            </div>
            <Sun className="w-12 h-12 text-warning" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { icon: Droplets, label: "Humidité", val: `${countryInfo.humidity}%` },
              { icon: Wind, label: "Vent", val: countryInfo.wind },
              { icon: Gauge, label: "Pression", val: countryInfo.pressure },
              { icon: Eye, label: "Visibilité", val: countryInfo.visibility },
            ].map((w) => {
              const WIcon = w.icon;
              return (
                <div key={w.label} className="bg-accent/50 rounded-lg p-2 text-center">
                  <WIcon className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" />
                  <p className="text-[10px] text-muted-foreground">{w.label}</p>
                  <p className="text-xs font-bold text-foreground">{w.val}</p>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-6 gap-1">
            {forecast.map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.day} className="text-center bg-accent/30 rounded-lg p-1.5">
                  <p className="text-[9px] font-bold text-muted-foreground">{f.day}</p>
                  <FIcon className="w-3 h-3 mx-auto my-0.5 text-muted-foreground" />
                  <p className="text-xs font-bold text-foreground">{f.temp}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Évolution Humidité</h3>
            <div className="flex gap-1">
              {["S", "M", "6M", "A"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                    timeFilter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyHumidity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" domain={[20, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(0 0% 100%)", border: "1px solid hsl(150 10% 88%)", color: "hsl(150 20% 15%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="p1" stroke="hsl(142 60% 40%)" fill="hsl(142 60% 40% / 0.08)" strokeWidth={2} name="P. Nord" />
              <Area type="monotone" dataKey="p2" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.08)" strokeWidth={2} name="Oliveraie" />
              <Area type="monotone" dataKey="p3" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50% / 0.08)" strokeWidth={2} name="Blé" />
              <Area type="monotone" dataKey="p4" stroke="hsl(210 80% 55%)" fill="hsl(210 80% 55% / 0.08)" strokeWidth={2} name="Légumes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Consommation Eau</h3>
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(0 0% 100%)", border: "1px solid hsl(150 10% 88%)", color: "hsl(150 20% 15%)", fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {waterConsumption.map((entry, i) => (
                  <Cell key={i} fill={entry.value > 400 ? "hsl(38 92% 50%)" : "hsl(142 60% 40%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Irrigation + Alerts + Progress */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Irrigation Rapide</h3>
            <Link to="/irrigation">
              <span className="text-[10px] text-primary font-semibold hover:underline">Contrôle →</span>
            </Link>
          </div>
          <div className="space-y-2">
            {parcelles.map((p) => (
              <div key={p.id} className={`flex items-center justify-between rounded-xl p-2.5 transition-all ${
                irrigatingId === p.id ? "bg-primary/10 border border-primary/30" : "bg-accent/50"
              }`}>
                <div className="flex items-center gap-2">
                  <Droplets className={`w-3.5 h-3.5 ${irrigatingId === p.id ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                  <span className="text-xs font-semibold text-foreground">{p.name}</span>
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
                    irrigatingId === p.id ? "bg-destructive text-primary-foreground" : "bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {irrigatingId === p.id ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Alertes</h3>
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
                      <p className="text-[11px] font-semibold leading-tight text-foreground">{a.message}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-sm mb-3 text-foreground">Progression Culture</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(150 10% 88%)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(142 60% 40%)" strokeWidth="10" strokeLinecap="round"
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
                <div key={l} className="flex justify-between text-[11px] border-b border-border pb-1 last:border-0">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-bold text-foreground">{v}</span>
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
            <div key={s.label} className="bg-card rounded-2xl border border-border p-3 flex items-center gap-3 shadow-sm">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <SIcon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="text-sm font-extrabold text-foreground">{s.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
