import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

const alertsData = [
  { date: "10/03/2026 14:23", parcelle: "Parcelle 2", type: "warning", message: "Humidité faible — 38%" },
  { date: "10/03/2026 13:45", parcelle: "Parcelle 3", type: "critical", message: "Température élevée — 37°C" },
  { date: "10/03/2026 14:00", parcelle: "Parcelle 1", type: "info", message: "Irrigation recommandée" },
  { date: "09/03/2026 18:30", parcelle: "Parcelle 4", type: "info", message: "Irrigation terminée avec succès" },
  { date: "09/03/2026 12:15", parcelle: "Parcelle 2", type: "warning", message: "Humidité faible — 40%" },
  { date: "08/03/2026 15:00", parcelle: "Parcelle 3", type: "critical", message: "Température élevée — 38°C" },
  { date: "08/03/2026 07:00", parcelle: "Parcelle 1", type: "info", message: "Irrigation automatique démarrée" },
  { date: "07/03/2026 16:45", parcelle: "Parcelle 2", type: "warning", message: "Capteur humidité — signal faible" },
];

const Alertes = () => {
  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6">
        <h1 className="font-data text-2xl font-bold tracking-wide uppercase">Alertes</h1>
        <p className="font-ui text-sm text-muted-foreground mt-1">Historique des notifications et avertissements</p>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b-grid border-border bg-card">
            <th className="text-left font-data text-xs uppercase tracking-widest p-4 text-muted-foreground">Date</th>
            <th className="text-left font-data text-xs uppercase tracking-widest p-4 text-muted-foreground">Parcelle</th>
            <th className="text-left font-data text-xs uppercase tracking-widest p-4 text-muted-foreground">Type</th>
            <th className="text-left font-data text-xs uppercase tracking-widest p-4 text-muted-foreground">Message</th>
          </tr>
        </thead>
        <tbody>
          {alertsData.map((a, i) => (
            <tr key={i} className="border-b border-border hover:bg-card/50 transition-colors">
              <td className="font-data text-sm p-4">{a.date}</td>
              <td className="font-data text-sm p-4 font-semibold">{a.parcelle}</td>
              <td className="p-4">
                <span className={cn(
                  "font-data text-xs uppercase tracking-widest px-2 py-1 inline-block",
                  a.type === "warning" && "bg-destructive/10 text-destructive border-grid border-destructive/30",
                  a.type === "critical" && "bg-destructive text-destructive-foreground",
                  a.type === "info" && "bg-primary/10 text-primary border-grid border-primary/30"
                )}>
                  {a.type === "warning" ? "Avertissement" : a.type === "critical" ? "Critique" : "Info"}
                </span>
              </td>
              <td className="font-ui text-sm p-4">{a.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default Alertes;
