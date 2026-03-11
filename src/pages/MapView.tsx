import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Droplets, Thermometer, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const parcelles = [
  { id: 1, name: "Parcelle Nord", surface: "2.5 ha", type: "Maraîchage", humidity: 65, temp: 32, lat: 36.72, lng: 3.05 },
  { id: 2, name: "Oliveraie Est", surface: "4.0 ha", type: "Oliviers", humidity: 38, temp: 35, lat: 36.73, lng: 3.08 },
  { id: 3, name: "Champ de Blé", surface: "6.2 ha", type: "Blé dur", humidity: 42, temp: 37, lat: 36.71, lng: 3.02 },
  { id: 4, name: "Jardin Légumes", surface: "1.8 ha", type: "Légumes", humidity: 78, temp: 30, lat: 36.74, lng: 3.06 },
];

const MapView = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectedParcelle = parcelles.find((p) => p.id === selected);

  const initMap = useCallback((node: HTMLDivElement | null) => {
    if (!node || mapInstanceRef.current) return;
    mapContainerRef.current = node;

    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      if (mapInstanceRef.current) return;

      const map = L.map(node, {
        center: [36.725, 3.05],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      parcelles.forEach((p) => {
        const isLow = p.humidity < 50;
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: 32px; height: 32px; border-radius: 50%;
            background: ${isLow ? "#ef4444" : "#22c55e"};
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
          ">
            <span style="color: white; font-size: 12px; font-weight: bold;">${p.id}</span>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
            <strong>${p.name}</strong><br/>
            <span style="color: #666;">${p.type} · ${p.surface}</span><br/>
            <span style="color: ${isLow ? '#ef4444' : '#22c55e'};">💧 ${p.humidity}%</span>
            &nbsp;
            <span>🌡 ${p.temp}°C</span>
          </div>
        `);
        marker.on("click", () => setSelected(p.id));
      });

      // Multiple invalidateSize calls to ensure proper rendering
      setTimeout(() => map.invalidateSize(), 0);
      setTimeout(() => map.invalidateSize(), 200);
      setTimeout(() => map.invalidateSize(), 500);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 mb-2 flex items-center gap-3">
        <MapPin className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Carte des Parcelles</h1>
          <p className="text-sm text-muted-foreground">Cliquez sur un marqueur pour sélectionner une parcelle</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-4 pb-4">
        {/* Map container - no overflow-hidden, no border-radius on map itself */}
        <div className="col-span-2 rounded-2xl border border-border" style={{ height: 500, position: "relative" }}>
          <div
            ref={initMap}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "16px",
              zIndex: 1,
            }}
          />
        </div>

        <div className="space-y-4">
          {selectedParcelle ? (
            <div className="bg-card rounded-2xl border border-border p-5 animate-in fade-in slide-in-from-right-2">
              <h2 className="text-lg font-bold mb-1">{selectedParcelle.name}</h2>
              <p className="text-xs text-muted-foreground mb-4">{selectedParcelle.type} · {selectedParcelle.surface}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
                  <Droplets className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidité</p>
                    <p className={`text-lg font-bold ${selectedParcelle.humidity < 50 ? "text-destructive" : "text-primary"}`}>
                      {selectedParcelle.humidity}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-accent rounded-xl p-3">
                  <Thermometer className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Température</p>
                    <p className={`text-lg font-bold ${selectedParcelle.temp > 35 ? "text-destructive" : "text-foreground"}`}>
                      {selectedParcelle.temp}°C
                    </p>
                  </div>
                </div>
              </div>
              <Link to={`/parcelles/${selectedParcelle.id}`}>
                <Button className="w-full mt-4 rounded-xl">
                  Voir Détails <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-5 text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Sélectionnez une parcelle sur la carte</p>
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold mb-3">Légende</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Humidité normale (≥50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">Humidité faible (&lt;50%)</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold mb-3">Toutes les parcelles</h3>
            <div className="space-y-2">
              {parcelles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelected(p.id);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([p.lat, p.lng], 15, { animate: true });
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-sm transition-all ${
                    selected === p.id ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"
                  }`}
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-xs ml-2 opacity-75">{p.surface}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MapView;
