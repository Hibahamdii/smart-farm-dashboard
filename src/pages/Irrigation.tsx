import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const parcelles = [
  { id: 1, name: "Parcelle Nord", status: "off" as const },
  { id: 2, name: "Oliveraie Est", status: "off" as const },
  { id: 3, name: "Champ de Blé", status: "off" as const },
  { id: 4, name: "Jardin Légumes", status: "off" as const },
];

const schedules = [
  { parcelle: "Parcelle Nord", time: "06:00", duration: "10 min", active: true },
  { parcelle: "Oliveraie Est", time: "07:00", duration: "15 min", active: true },
  { parcelle: "Champ de Blé", time: "06:30", duration: "20 min", active: false },
  { parcelle: "Jardin Légumes", time: "05:30", duration: "12 min", active: true },
];

const Irrigation = () => {
  const [irrigationState, setIrrigationState] = useState(
    parcelles.map((p) => ({ ...p, status: "off" as "off" | "running", timer: 0 }))
  );
  const intervalsRef = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  const startIrrigation = (id: number) => {
    setIrrigationState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "running" as const, timer: 900 } : p))
    );
    intervalsRef.current[id] = setInterval(() => {
      setIrrigationState((prev) =>
        prev.map((p) => {
          if (p.id === id && p.timer > 0) {
            const newTimer = p.timer - 1;
            if (newTimer <= 0) {
              clearInterval(intervalsRef.current[id]);
              return { ...p, status: "off" as const, timer: 0 };
            }
            return { ...p, timer: newTimer };
          }
          return p;
        })
      );
    }, 1000);
  };

  const stopIrrigation = (id: number) => {
    clearInterval(intervalsRef.current[id]);
    setIrrigationState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "off" as const, timer: 0 } : p))
    );
  };

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6">
        <h1 className="font-data text-2xl font-bold tracking-wide uppercase">Contrôle Irrigation</h1>
        <p className="font-ui text-sm text-muted-foreground mt-1">Démarrage manuel et planification automatique</p>
      </div>

      {/* Manual control grid */}
      <div className="grid grid-cols-4 border-b-grid border-border">
        {irrigationState.map((p) => (
          <div key={p.id} className={cn("border-r-grid border-border relative overflow-hidden", p.id === 4 && "border-r-0")}>
            {/* Water fill animation */}
            {p.status === "running" && (
              <div
                className="absolute bottom-0 left-0 right-0 bg-primary/20 water-fill-animation"
                style={{ height: "100%" }}
              />
            )}
            <div className="relative z-10 p-6 text-center min-h-[240px] flex flex-col justify-between">
              <div>
                <h3 className="font-data text-sm font-semibold uppercase tracking-widest">{p.name}</h3>
                <div className={cn(
                  "inline-block mt-2 px-3 py-1 font-data text-xs uppercase tracking-widest",
                  p.status === "running" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border-grid border-border"
                )}>
                  {p.status === "running" ? "EN COURS" : "ARRÊTÉ"}
                </div>
              </div>

              {p.status === "running" && (
                <div className="font-data text-4xl font-bold text-primary my-4">
                  {formatTimer(p.timer)}
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4">
                {p.status === "off" ? (
                  <Button variant="irrigation" onClick={() => startIrrigation(p.id)}>
                    Démarrer
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={() => stopIrrigation(p.id)}>
                    Arrêter
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="p-6">
        <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Planification Automatique</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b-grid border-border">
              <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Parcelle</th>
              <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Heure</th>
              <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Durée</th>
              <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Statut</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s, i) => (
              <tr key={i} className="border-b border-border">
                <td className="font-data text-sm p-3">{s.parcelle}</td>
                <td className="font-data text-sm p-3 font-semibold">{s.time}</td>
                <td className="font-data text-sm p-3">{s.duration}</td>
                <td className="p-3">
                  <span className={cn(
                    "font-data text-xs uppercase tracking-widest px-2 py-1",
                    s.active ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground border-grid border-border"
                  )}>
                    {s.active ? "Actif" : "Inactif"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Irrigation;
