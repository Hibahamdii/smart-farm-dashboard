import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [humidityThreshold, setHumidityThreshold] = useState(40);
  const [irrigationDuration, setIrrigationDuration] = useState(15);

  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6">
        <h1 className="font-data text-2xl font-bold tracking-wide uppercase">Paramètres</h1>
        <p className="font-ui text-sm text-muted-foreground mt-1">Configuration du système d'irrigation</p>
      </div>

      <div className="grid grid-cols-2">
        {/* System params */}
        <div className="border-r-grid border-border p-6">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-6">Paramètres Système</h2>

          <div className="space-y-6">
            <div className="border-grid border-border bg-card p-4">
              <label className="font-data text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Seuil Humidité (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={humidityThreshold}
                  onChange={(e) => setHumidityThreshold(Number(e.target.value))}
                  className="flex-1 accent-[hsl(193,100%,24%)]"
                />
                <span className="font-data text-2xl font-bold w-16 text-right">{humidityThreshold}%</span>
              </div>
              <p className="font-ui text-xs text-muted-foreground mt-2">
                L'irrigation se déclenche automatiquement sous ce seuil.
              </p>
            </div>

            <div className="border-grid border-border bg-card p-4">
              <label className="font-data text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Durée Irrigation Automatique (min)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={irrigationDuration}
                  onChange={(e) => setIrrigationDuration(Number(e.target.value))}
                  className="flex-1 accent-[hsl(193,100%,24%)]"
                />
                <span className="font-data text-2xl font-bold w-16 text-right">{irrigationDuration}m</span>
              </div>
            </div>

            <Button variant="default" className="w-full">Sauvegarder les Paramètres</Button>
          </div>
        </div>

        {/* Users */}
        <div className="p-6">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-6">Gestion Utilisateurs</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b-grid border-border">
                <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Nom</th>
                <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Rôle</th>
                <th className="text-left font-data text-xs uppercase tracking-widest p-3 text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Ahmed Ben Ali", role: "Admin" },
                { name: "Fatma Khaldi", role: "Agriculteur" },
                { name: "Mohamed Trabelsi", role: "Agriculteur" },
              ].map((u, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="font-data text-sm p-3 font-semibold">{u.name}</td>
                  <td className="p-3">
                    <span className={`font-data text-xs uppercase tracking-widest px-2 py-1 ${
                      u.role === "Admin" ? "bg-primary text-primary-foreground" : "bg-card border-grid border-border text-foreground"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button variant="outline" size="sm">Modifier</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
