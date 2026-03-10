import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FillBar from "@/components/dashboard/FillBar";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const parcellesData: Record<string, { name: string; surface: string; type: string; humidity: number; temp: number }> = {
  "1": { name: "Parcelle Nord", surface: "2.5 ha", type: "Maraîchage", humidity: 65, temp: 32 },
  "2": { name: "Oliveraie Est", surface: "4.0 ha", type: "Oliviers", humidity: 38, temp: 35 },
  "3": { name: "Champ de Blé", surface: "6.2 ha", type: "Blé dur", humidity: 42, temp: 37 },
  "4": { name: "Jardin Légumes", surface: "1.8 ha", type: "Légumes", humidity: 78, temp: 30 },
};

const humidityHistory = [
  { date: "05/03", value: 70 },
  { date: "06/03", value: 65 },
  { date: "07/03", value: 58 },
  { date: "08/03", value: 50 },
  { date: "09/03", value: 45 },
  { date: "10/03", value: 42 },
];

const tempHistory = [
  { date: "05/03", value: 28 },
  { date: "06/03", value: 30 },
  { date: "07/03", value: 32 },
  { date: "08/03", value: 35 },
  { date: "09/03", value: 34 },
  { date: "10/03", value: 37 },
];

const irrigationHistory = [
  { date: "10/03/2026", duree: "15 min", eau: "120 L" },
  { date: "09/03/2026", duree: "20 min", eau: "160 L" },
  { date: "08/03/2026", duree: "10 min", eau: "80 L" },
  { date: "07/03/2026", duree: "15 min", eau: "120 L" },
  { date: "05/03/2026", duree: "25 min", eau: "200 L" },
];

const ParcelleDetails = () => {
  const { id } = useParams();
  const parcelle = parcellesData[id || "1"];

  if (!parcelle) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="font-data">Parcelle non trouvée.</p>
          <Link to="/parcelles"><Button variant="outline" className="mt-4">Retour</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6 flex items-center justify-between">
        <div>
          <Link to="/parcelles" className="font-ui text-xs text-muted-foreground hover:text-foreground uppercase tracking-widest">
            ← Parcelles
          </Link>
          <h1 className="font-data text-2xl font-bold tracking-wide uppercase mt-1">{parcelle.name}</h1>
        </div>
        <Button variant="irrigation">Démarrer Irrigation</Button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-4 border-b-grid border-border">
        <div className="border-r-grid border-border p-5">
          <span className="text-xs font-ui text-muted-foreground block uppercase tracking-widest">Surface</span>
          <span className="font-data text-2xl font-bold mt-1 block">{parcelle.surface}</span>
        </div>
        <div className="border-r-grid border-border p-5">
          <span className="text-xs font-ui text-muted-foreground block uppercase tracking-widest">Type</span>
          <span className="font-data text-2xl font-bold mt-1 block">{parcelle.type}</span>
        </div>
        <div className="border-r-grid border-border p-5">
          <span className="text-xs font-ui text-muted-foreground block uppercase tracking-widest">Humidité</span>
          <span className={`font-data text-2xl font-bold mt-1 block ${parcelle.humidity < 50 ? 'text-destructive' : 'text-accent'}`}>{parcelle.humidity}%</span>
        </div>
        <div className="p-5">
          <span className="text-xs font-ui text-muted-foreground block uppercase tracking-widest">Température</span>
          <span className={`font-data text-2xl font-bold mt-1 block ${parcelle.temp > 35 ? 'text-destructive' : 'text-foreground'}`}>{parcelle.temp}°C</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 border-b-grid border-border">
        <div className="border-r-grid border-border p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Évolution Humidité</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={humidityHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 77%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <YAxis tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <Area type="stepAfter" dataKey="value" stroke="hsl(193 100% 24%)" fill="hsl(193 100% 24% / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Évolution Température</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={tempHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 77%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <YAxis tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <Area type="stepAfter" dataKey="value" stroke="hsl(24 85% 46%)" fill="hsl(24 85% 46% / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: table + AI rec */}
      <div className="grid grid-cols-3">
        <div className="col-span-2 border-r-grid border-border p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Historique Irrigation</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b-grid border-border">
                <th className="text-left font-data text-xs uppercase tracking-widest p-2 text-muted-foreground">Date</th>
                <th className="text-left font-data text-xs uppercase tracking-widest p-2 text-muted-foreground">Durée</th>
                <th className="text-left font-data text-xs uppercase tracking-widest p-2 text-muted-foreground">Eau Utilisée</th>
              </tr>
            </thead>
            <tbody>
              {irrigationHistory.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="font-data text-sm p-2">{row.date}</td>
                  <td className="font-data text-sm p-2">{row.duree}</td>
                  <td className="font-data text-sm p-2">{row.eau}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Recommandation IA</h2>
          <div className="border-grid border-primary bg-primary/5 p-4">
            <p className="font-data text-sm text-primary font-semibold mb-2">🤖 Analyse Intelligente</p>
            <p className="font-ui text-sm text-foreground leading-relaxed">
              Arrosage recommandé : <span className="font-data font-bold text-primary">15 minutes</span>
            </p>
            <p className="font-ui text-xs text-muted-foreground mt-2">
              Basé sur le taux d'humidité actuel ({parcelle.humidity}%) et la prévision météo des prochaines 24h.
            </p>
          </div>
          <div className="mt-6">
            <h3 className="font-data text-xs uppercase tracking-widest text-muted-foreground mb-3">Niveau Humidité</h3>
            <div className="flex justify-center">
              <FillBar value={parcelle.humidity} height="h-40" variant={parcelle.humidity < 50 ? "warning" : "accent"} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParcelleDetails;
