import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AddParcelleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (parcelle: {
    name: string;
    surface: string;
    type: string;
    humidity: number;
    temp: number;
    lat: number;
    lng: number;
  }) => void;
}

const AddParcelleDialog = ({ open, onOpenChange, onAdd }: AddParcelleDialogProps) => {
  const [name, setName] = useState("");
  const [surface, setSurface] = useState("");
  const [type, setType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [36.725, 3.05],
      zoom: 13,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="width:36px;height:36px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:16px;">+</span>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      }
    });

    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 400);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(initMap, 200);
    }
    return () => {
      if (!open && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, initMap]);

  const handleSubmit = () => {
    if (!name || !surface || !type || !selectedLocation) return;
    onAdd({
      name,
      surface: surface + " ha",
      type,
      humidity: Math.floor(Math.random() * 40) + 40,
      temp: Math.floor(Math.random() * 10) + 28,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });
    // Reset
    setName("");
    setSurface("");
    setType("");
    setSelectedLocation(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-data text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Ajouter une Parcelle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Map for location picking */}
          <div>
            <Label className="text-sm font-ui text-muted-foreground mb-2 block">
              Cliquez sur la carte pour choisir l'emplacement
            </Label>
            <div
              ref={mapRef}
              className="w-full rounded-xl border border-border overflow-hidden"
              style={{ height: 280 }}
            />
            {selectedLocation && (
              <p className="text-xs text-primary mt-1.5 font-data">
                📍 {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-sm font-ui">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Parcelle Sud"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="surface" className="text-sm font-ui">Surface (ha)</Label>
              <Input
                id="surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                placeholder="Ex: 3.5"
                type="number"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-ui">Type de culture</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maraîchage">Maraîchage</SelectItem>
                <SelectItem value="Oliviers">Oliviers</SelectItem>
                <SelectItem value="Blé dur">Blé dur</SelectItem>
                <SelectItem value="Légumes">Légumes</SelectItem>
                <SelectItem value="Agrumes">Agrumes</SelectItem>
                <SelectItem value="Vignes">Vignes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!name || !surface || !type || !selectedLocation}
          >
            Ajouter la Parcelle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddParcelleDialog;
