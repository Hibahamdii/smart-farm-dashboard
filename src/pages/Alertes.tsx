import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import AlertAIChatDialog from "@/components/alertes/AlertAIChatDialog";

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
  const [chatAlert, setChatAlert] = useState<typeof alertsData[0] | null>(null);

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
            <th className="text-center font-data text-xs uppercase tracking-widest p-4 text-muted-foreground">IA</th>
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
              <td className="p-4 text-center">
                <button
                  onClick={() => setChatAlert(a)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  title="Demander conseil à l'IA"
                >
                  <Bot className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {chatAlert && (
        <AlertAIChatDialog
          open={!!chatAlert}
          onOpenChange={(open) => !open && setChatAlert(null)}
          alertMessage={chatAlert.message}
          parcelle={chatAlert.parcelle}
          type={chatAlert.type}
        />
      )}
    </DashboardLayout>
  );
};

export default Alertes;
