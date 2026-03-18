import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Sprout, Droplets, Thermometer, Activity, LogOut, MapPin, Plus,
  CloudSun, Cloud, CloudRain, Sun, Wind, Gauge, Eye, Play, Square,
  AlertTriangle, CheckCircle2, ImagePlus, X
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from "recharts";

type Parcelle = {
  id: string; name: string; surface: string; type: string;
  humidity: number; temp: number; lat: number; lng: number; status: string; image_url: string;
};

const forecast = [
  { day: "SAM", temp: 10, icon: CloudSun },
  { day: "DIM", temp: 15, icon: Cloud },
  { day: "LUN", temp: 11, icon: CloudRain },
  { day: "MAR", temp: 10, icon: CloudRain },
  { day: "MER", temp: 12, icon: CloudSun },
];

const FarmerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [irrigatingId, setIrrigatingId] = useState<string | null>(null);
  const [newP, setNewP] = useState({ name: "", surface: "", type: "" });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchParcelles = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("parcelles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setParcelles(data.map((p) => ({
        id: p.id, name: p.name, surface: p.surface, type: p.type,
        humidity: Number(p.humidity) || 50, temp: Number(p.temp) || 30,
        lat: Number(p.lat) || 36.725, lng: Number(p.lng) || 3.05,
        status: p.status || "ok", image_url: p.image_url || "",
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchParcelles(); }, [user]);

  const handleAddParcelle = async () => {
    if (!user || !newP.name || !newP.surface || !newP.type) {
      toast.error("Remplissez tous les champs"); return;
    }
    const { error } = await supabase.from("parcelles").insert({
      user_id: user.id, name: newP.name, surface: newP.surface, type: newP.type,
      lat: 36.725 + (Math.random() - 0.5) * 0.03,
      lng: 3.05 + (Math.random() - 0.5) * 0.03,
    });
    if (error) { toast.error(error.message); return; }
    setNewP({ name: "", surface: "", type: "" });
    setShowAddForm(false);
    toast.success("Parcelle ajoutée !");
    fetchParcelles();
  };

  const handleDeleteParcelle = async (id: string) => {
    const { error } = await supabase.from("parcelles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Parcelle supprimée");
    fetchParcelles();
  };

  const handleImageUpload = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await supabase.from("parcelles").update({ image_url: dataUrl }).eq("id", id);
      fetchParcelles();
      toast.success("Image mise à jour !");
    };
    reader.readAsDataURL(file);
  };

  const handleQuickIrrigation = (id: string, name: string) => {
    setIrrigatingId(id);
    toast.success(`🚿 Irrigation démarrée — ${name}`);
    setTimeout(() => {
      setIrrigatingId(null);
      toast.info(`✅ Irrigation terminée — ${name}`);
    }, 5000);
  };

  // Map
  const initMap = useCallback((node: HTMLDivElement | null) => {
    if (!node || mapInstanceRef.current) return;
    const map = L.map(node, { center: [36.725, 3.05], zoom: 13, zoomControl: true });
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap", maxZoom: 19,
    }).addTo(map);
    setTimeout(() => map.invalidateSize(), 200);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || parcelles.length === 0) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    parcelles.forEach((p) => {
      const isLow = p.humidity < 50;
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width:30px;height:30px;border-radius:50%;background:${isLow ? "hsl(0 72% 51%)" : "hsl(142 60% 40%)"};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:10px;">🌱</span></div>`,
        iconSize: [30, 30], iconAnchor: [15, 15],
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.bindPopup(`<strong>${p.name}</strong><br/>${p.type} · ${p.surface}`);
      markersRef.current.push(marker);
    });
    const bounds = L.latLngBounds(parcelles.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [parcelles]);

  useEffect(() => {
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  const avgHumidity = parcelles.length ? Math.round(parcelles.reduce((s, p) => s + p.humidity, 0) / parcelles.length) : 0;
  const avgTemp = parcelles.length ? Math.round(parcelles.reduce((s, p) => s + p.temp, 0) / parcelles.length) : 0;

  const humidityData = parcelles.map((p) => ({ name: p.name.split(" ")[0], humidity: p.humidity, temp: p.temp }));

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Mon Exploitation</h1>
            <p className="text-xs text-muted-foreground">
              Bienvenue, {profile?.full_name || "Agriculteur"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/meteo">
            <Button variant="outline" size="sm" className="rounded-xl gap-2">
              <CloudSun className="w-4 h-4" /> Météo
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={signOut} className="rounded-xl gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Mes Parcelles", value: parcelles.length, icon: Sprout, color: "text-primary", bg: "bg-primary/10" },
          { label: "Humidité Moy.", value: `${avgHumidity}%`, icon: Droplets, color: avgHumidity < 50 ? "text-destructive" : "text-primary", bg: avgHumidity < 50 ? "bg-destructive/10" : "bg-primary/10" },
          { label: "Température", value: `${avgTemp}°C`, icon: Thermometer, color: avgTemp > 35 ? "text-destructive" : "text-warning", bg: avgTemp > 35 ? "bg-destructive/10" : "bg-warning/10" },
          { label: "En irrigation", value: irrigatingId ? "1" : "0", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 stat-accent">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Map + Weather */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Mes Parcelles sur la carte</h3>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="rounded-lg text-xs gap-1">
              <Plus className="w-3 h-3" /> Ajouter
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-accent/50 rounded-xl p-3 mb-3 border border-border">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input placeholder="Nom" value={newP.name} onChange={(e) => setNewP({ ...newP, name: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Surface (ex: 3 ha)" value={newP.surface} onChange={(e) => setNewP({ ...newP, surface: e.target.value })}
                  className="text-xs rounded-lg px-2 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary" />
                <input placeholder="Type (ex: Blé)" value={newP.type} onChange={(e) => setNewP({ ...newP, type: e.target.value })}
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

        {/* Weather mini */}
        <Link to="/meteo" className="block glass-card rounded-2xl p-4 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <Sun className="w-4 h-4 text-warning" /> Météo
          </h3>
          <div className="text-center mb-4">
            <p className="text-4xl font-extrabold text-foreground">25°C</p>
            <p className="text-xs text-muted-foreground">Partiellement nuageux</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-accent/50 rounded-lg p-2 text-center">
              <Droplets className="w-3 h-3 text-primary mx-auto mb-1" />
              <p className="text-xs font-bold">74%</p>
              <p className="text-[9px] text-muted-foreground">Humidité</p>
            </div>
            <div className="bg-accent/50 rounded-lg p-2 text-center">
              <Wind className="w-3 h-3 text-primary mx-auto mb-1" />
              <p className="text-xs font-bold">18 km/h</p>
              <p className="text-[9px] text-muted-foreground">Vent</p>
            </div>
          </div>
          <div className="flex gap-1">
            {forecast.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.day} className="flex-1 text-center bg-accent/30 rounded-lg py-2">
                  <p className="text-[9px] font-bold text-muted-foreground">{f.day}</p>
                  <Icon className="w-3 h-3 mx-auto my-1 text-foreground" />
                  <p className="text-[10px] font-bold">{f.temp}°</p>
                </div>
              );
            })}
          </div>
        </Link>
      </div>

      {/* Parcelles + Chart */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 glass-card rounded-2xl p-4">
          <h3 className="font-bold text-sm text-foreground mb-3">Mes Parcelles</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : parcelles.length === 0 ? (
            <div className="text-center py-8">
              <Sprout className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune parcelle. Ajoutez-en une !</p>
            </div>
          ) : (
            <div className="space-y-2">
              {parcelles.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-accent/30 rounded-xl p-3 border border-border">
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sprout className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <input
                      type="file" accept="image/*" className="hidden"
                      id={`img-${p.id}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(p.id, file);
                      }}
                    />
                    <button
                      onClick={() => document.getElementById(`img-${p.id}`)?.click()}
                      className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                    >
                      <ImagePlus className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.type} · {p.surface}</p>
                    <div className="flex gap-3 mt-1">
                      <span className={`text-xs font-semibold ${p.humidity < 50 ? "text-destructive" : "text-primary"}`}>
                        💧 {p.humidity}%
                      </span>
                      <span className={`text-xs font-semibold ${p.temp > 35 ? "text-destructive" : "text-foreground"}`}>
                        🌡 {p.temp}°C
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm" variant={irrigatingId === p.id ? "destructive" : "default"}
                      onClick={() => irrigatingId === p.id ? setIrrigatingId(null) : handleQuickIrrigation(p.id, p.name)}
                      className="rounded-lg h-8 text-[10px] px-2"
                    >
                      {irrigatingId === p.id ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteParcelle(p.id)}
                      className="rounded-lg h-8 text-[10px] px-2">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Humidity chart */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-bold text-sm text-foreground mb-3">Humidité par parcelle</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={humidityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="humidity" stroke="hsl(142, 60%, 40%)" fill="hsl(142, 60%, 40%, 0.2)" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Alerts */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold text-foreground">Alertes</h4>
            {parcelles.filter((p) => p.humidity < 50 || p.temp > 35).length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-primary">
                <CheckCircle2 className="w-3 h-3" /> Tout est normal
              </div>
            ) : (
              parcelles
                .filter((p) => p.humidity < 50 || p.temp > 35)
                .map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-2">
                    <AlertTriangle className="w-3 h-3" />
                    {p.humidity < 50 ? `Humidité basse: ${p.name} (${p.humidity}%)` : `Temp élevée: ${p.name} (${p.temp}°C)`}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
