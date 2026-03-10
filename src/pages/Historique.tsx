import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Bar, BarChart } from "recharts";

const waterData = [
  { month: "Jan", value: 1200 },
  { month: "Fév", value: 980 },
  { month: "Mar", value: 1500 },
  { month: "Avr", value: 2200 },
  { month: "Mai", value: 3100 },
  { month: "Jun", value: 3800 },
  { month: "Jul", value: 4200 },
  { month: "Aoû", value: 3900 },
  { month: "Sep", value: 2800 },
  { month: "Oct", value: 1600 },
];

const humidityHistory = [
  { date: "01/03", p1: 70, p2: 45, p3: 50, p4: 80 },
  { date: "03/03", p1: 68, p2: 42, p3: 48, p4: 78 },
  { date: "05/03", p1: 65, p2: 40, p3: 45, p4: 75 },
  { date: "07/03", p1: 60, p2: 38, p3: 42, p4: 72 },
  { date: "09/03", p1: 55, p2: 35, p3: 40, p4: 70 },
  { date: "10/03", p1: 52, p2: 33, p3: 38, p4: 78 },
];

const Historique = () => {
  const [filter, setFilter] = useState("all");

  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6 flex items-center justify-between">
        <div>
          <h1 className="font-data text-2xl font-bold tracking-wide uppercase">Historique & Data</h1>
          <p className="font-ui text-sm text-muted-foreground mt-1">Données de consommation et tendances</p>
        </div>
        <div className="flex gap-2">
          {["all", "P1", "P2", "P3", "P4"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Toutes" : f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 border-b-grid border-border">
        <div className="border-r-grid border-border p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Consommation Eau (Litres)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 77%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <YAxis tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <Bar dataKey="value" fill="hsl(193 100% 24%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Évolution Humidité — Toutes Parcelles</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={humidityHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 77%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <YAxis tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <Area type="stepAfter" dataKey="p1" stroke="hsl(193 100% 24%)" fill="hsl(193 100% 24% / 0.1)" strokeWidth={2} name="P1" />
              <Area type="stepAfter" dataKey="p2" stroke="hsl(24 85% 46%)" fill="hsl(24 85% 46% / 0.1)" strokeWidth={2} name="P2" />
              <Area type="stepAfter" dataKey="p3" stroke="hsl(127 19% 36%)" fill="hsl(127 19% 36% / 0.1)" strokeWidth={2} name="P3" />
              <Area type="stepAfter" dataKey="p4" stroke="hsl(30 8% 35%)" fill="hsl(30 8% 35% / 0.1)" strokeWidth={2} name="P4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4">
        {[
          { label: "Eau totale ce mois", value: "4,200 L" },
          { label: "Moyenne journalière", value: "420 L" },
          { label: "Économies vs manuel", value: "-32%" },
          { label: "Sessions irrigation", value: "28" },
        ].map((s) => (
          <div key={s.label} className="border-r-grid border-border last:border-r-0 p-5">
            <span className="text-xs font-ui text-muted-foreground block uppercase tracking-widest">{s.label}</span>
            <span className="font-data text-2xl font-bold mt-1 block">{s.value}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Historique;
