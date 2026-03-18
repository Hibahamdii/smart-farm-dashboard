import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search, MapPin, Droplets, Sprout, Bell, Thermometer,
  Users, Eye, LogOut, Shield, TrendingUp, Activity,
  ChevronDown, User, Trash2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell, Tooltip
} from "recharts";

type UserWithParcelles = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  parcelles: Array<{
    id: string; name: string; surface: string; type: string;
    humidity: number; temp: number; lat: number; lng: number; status: string;
  }>;
};

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [users, setUsers] = useState<UserWithParcelles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");
    const { data: parcelles } = await supabase.from("parcelles").select("*");

    if (profiles) {
      const usersMap: UserWithParcelles[] = profiles.map((p) => {
        const userRole = roles?.find((r) => r.user_id === p.user_id);
        const userParcelles = parcelles?.filter((pa) => pa.user_id === p.user_id) || [];
        return {
          user_id: p.user_id,
          full_name: p.full_name || "Sans nom",
          email: p.email,
          phone: p.phone || "",
          role: userRole?.role || "agriculteur",
          parcelles: userParcelles.map((pa) => ({
            id: pa.id,
            name: pa.name,
            surface: pa.surface,
            type: pa.type,
            humidity: Number(pa.humidity) || 50,
            temp: Number(pa.temp) || 30,
            lat: Number(pa.lat) || 36.725,
            lng: Number(pa.lng) || 3.05,
            status: pa.status || "ok",
          })),
        };
      });
      setUsers(usersMap);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalParcelles = users.reduce((s, u) => s + u.parcelles.length, 0);
  const totalFarmers = users.filter((u) => u.role === "agriculteur").length;
  const allParcelles = users.flatMap((u) => u.parcelles);
  const avgHumidity = allParcelles.length
    ? Math.round(allParcelles.reduce((s, p) => s + p.humidity, 0) / allParcelles.length)
    : 0;

  // Map
  const initMap = useCallback((node: HTMLDivElement | null) => {
    if (!node || mapInstanceRef.current) return;
    const map = L.map(node, { center: [36.725, 3.05], zoom: 12, zoomControl: true });
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap", maxZoom: 19,
    }).addTo(map);
    setTimeout(() => map.invalidateSize(), 200);
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const parcellesList = selectedUser
      ? users.find((u) => u.user_id === selectedUser)?.parcelles || []
      : allParcelles;

    parcellesList.forEach((p) => {
      const isLow = p.humidity < 50;
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${isLow ? "hsl(0 72% 51%)" : "hsl(142 60% 40%)"};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:10px;font-weight:bold;">P</span></div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.bindPopup(`<strong>${p.name}</strong><br/>${p.type} · ${p.surface}<br/>💧 ${p.humidity}% 🌡 ${p.temp}°C`);
      markersRef.current.push(marker);
    });

    if (parcellesList.length > 0) {
      const bounds = L.latLngBounds(parcellesList.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [users, selectedUser]);

  useEffect(() => {
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  const handleDeleteUser = async (userId: string) => {
    // Admin can't delete via client - just remove from UI for now
    toast.info("La suppression d'utilisateur nécessite un accès admin serveur.");
  };

  const parcellesPerUser = users.map((u) => ({
    name: u.full_name.split(" ")[0],
    count: u.parcelles.length,
  }));

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Dashboard Admin</h1>
            <p className="text-xs text-muted-foreground">
              Bienvenue, {profile?.full_name || "Admin"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center glass-card rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground w-40"
            />
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="rounded-xl gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Utilisateurs", value: users.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "Agriculteurs", value: totalFarmers, icon: User, color: "text-accent-foreground", bg: "bg-accent" },
          { label: "Parcelles", value: totalParcelles, icon: Sprout, color: "text-primary", bg: "bg-primary/10" },
          { label: "Humidité Moy.", value: `${avgHumidity}%`, icon: Droplets, color: avgHumidity < 50 ? "text-destructive" : "text-primary", bg: avgHumidity < 50 ? "bg-destructive/10" : "bg-primary/10" },
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

      {/* Map + Chart */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">
              Carte — {selectedUser ? users.find((u) => u.user_id === selectedUser)?.full_name : "Toutes les parcelles"}
            </h3>
            <select
              value={selectedUser || ""}
              onChange={(e) => setSelectedUser(e.target.value || null)}
              className="text-xs rounded-lg px-3 py-1.5 border border-border bg-card text-foreground outline-none"
            >
              <option value="">Tous les utilisateurs</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>{u.full_name}</option>
              ))}
            </select>
          </div>
          <div ref={initMap} style={{ height: 300, width: "100%", borderRadius: 12, zIndex: 1 }} />
        </div>

        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-bold text-sm text-foreground mb-3">Parcelles par utilisateur</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={parcellesPerUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {parcellesPerUser.map((_, i) => (
                  <Cell key={i} fill={`hsl(142 ${50 + i * 10}% ${35 + i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users list */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Liste des Utilisateurs ({filteredUsers.length})
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div key={u.user_id} className="bg-accent/30 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
                      {u.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                      u.role === "admin" ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"
                    }`}>
                      {u.role}
                    </span>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => setSelectedUser(selectedUser === u.user_id ? null : u.user_id)}
                      className="rounded-lg text-xs gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {selectedUser === u.user_id ? "Masquer" : "Voir parcelles"}
                    </Button>
                  </div>
                </div>

                {/* Parcelles */}
                {selectedUser === u.user_id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    {u.parcelles.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2">Aucune parcelle</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {u.parcelles.map((p) => (
                          <div key={p.id} className="bg-card rounded-lg p-3 border border-border">
                            <p className="text-xs font-bold text-foreground">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">{p.type} · {p.surface}</p>
                            <div className="flex gap-3 mt-1">
                              <span className={`text-[10px] font-semibold ${p.humidity < 50 ? "text-destructive" : "text-primary"}`}>
                                💧 {p.humidity}%
                              </span>
                              <span className={`text-[10px] font-semibold ${p.temp > 35 ? "text-destructive" : "text-foreground"}`}>
                                🌡 {p.temp}°C
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
