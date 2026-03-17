import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import AddParcelleDialog from "@/components/parcelles/AddParcelleDialog";
import parcelle1 from "@/assets/parcelle-1.jpg";
import parcelle2 from "@/assets/parcelle-2.jpg";
import parcelle3 from "@/assets/parcelle-3.jpg";
import parcelle4 from "@/assets/parcelle-4.jpg";

const defaultImages = [parcelle1, parcelle2, parcelle3, parcelle4];

type ParcelleData = {
  id: number;
  name: string;
  surface: string;
  type: string;
  humidity: number;
  temp: number;
  image?: string;
};

const initialParcelles: ParcelleData[] = [
  { id: 1, name: "Parcelle Nord", surface: "2.5 ha", type: "Maraîchage", humidity: 65, temp: 32 },
  { id: 2, name: "Oliveraie Est", surface: "4.0 ha", type: "Oliviers", humidity: 38, temp: 35 },
  { id: 3, name: "Champ de Blé", surface: "6.2 ha", type: "Blé dur", humidity: 42, temp: 37 },
  { id: 4, name: "Jardin Légumes", surface: "1.8 ha", type: "Légumes", humidity: 78, temp: 30 },
];

const Parcelles = () => {
  const [parcelles, setParcelles] = useState<ParcelleData[]>(initialParcelles);
  const [addOpen, setAddOpen] = useState(false);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleDelete = (id: number) => {
    setParcelles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = (data: { name: string; surface: string; type: string; humidity: number; temp: number; image?: string }) => {
    const newId = Math.max(...parcelles.map((p) => p.id), 0) + 1;
    setParcelles((prev) => [...prev, { ...data, id: newId }]);
  };

  const handleImageUpdate = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setParcelles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, image: ev.target?.result as string } : p))
      );
    };
    reader.readAsDataURL(file);
  };

  const getImage = (p: ParcelleData, index: number) => {
    return p.image || defaultImages[index % defaultImages.length];
  };

  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6 flex items-center justify-between">
        <div>
          <h1 className="font-data text-2xl font-bold tracking-wide uppercase">Parcelles</h1>
          <p className="font-ui text-sm text-muted-foreground mt-1">Gestion des terres agricoles</p>
        </div>
        <Button variant="default" onClick={() => setAddOpen(true)}>+ Ajouter Parcelle</Button>
      </div>

      <AddParcelleDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />

      <div className="grid grid-cols-2">
        {parcelles.map((p, i) => (
          <div key={p.id} className="border-grid border-border relative overflow-hidden" style={{ minHeight: 320 }}>
            {/* Background image */}
            <img
              src={getImage(p, i)}
              alt={p.name}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
            />
            {/* Image upload button */}
            <input
              ref={(el) => { fileInputRefs.current[p.id] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpdate(p.id, file);
              }}
            />
            <button
              onClick={() => fileInputRefs.current[p.id]?.click()}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              title="Changer l'image"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
            {/* Data overlay */}
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <div className="bg-background/90 border-grid border-border p-5">
                <h3 className="font-data text-lg font-bold">{p.name}</h3>
                <p className="font-ui text-xs text-muted-foreground uppercase tracking-wider mb-3">{p.type}</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-xs font-ui text-muted-foreground block">Surface</span>
                    <span className="font-data text-lg font-semibold">{p.surface}</span>
                  </div>
                  <div>
                    <span className="text-xs font-ui text-muted-foreground block">Humidité</span>
                    <span className={`font-data text-lg font-semibold ${p.humidity < 50 ? 'text-destructive' : 'text-accent'}`}>
                      {p.humidity}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-ui text-muted-foreground block">Température</span>
                    <span className={`font-data text-lg font-semibold ${p.temp > 35 ? 'text-destructive' : 'text-foreground'}`}>
                      {p.temp}°C
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/parcelles/${p.id}`}>
                    <Button variant="outline" size="sm">Voir Détails</Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => fileInputRefs.current[p.id]?.click()}>
                    Changer Photo
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>Supprimer</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Parcelles;
