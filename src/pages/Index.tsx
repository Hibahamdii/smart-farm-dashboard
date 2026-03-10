import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import FillBar from "@/components/dashboard/FillBar";
import AlertItem from "@/components/dashboard/AlertItem";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const humidityData = [
  { time: "06:00", value: 72 },
  { time: "08:00", value: 68 },
  { time: "10:00", value: 55 },
  { time: "12:00", value: 42 },
  { time: "14:00", value: 38 },
  { time: "16:00", value: 45 },
  { time: "18:00", value: 58 },
  { time: "20:00", value: 65 },
];

const tempData = [
  { time: "06:00", value: 18 },
  { time: "08:00", value: 22 },
  { time: "10:00", value: 28 },
  { time: "12:00", value: 34 },
  { time: "14:00", value: 37 },
  { time: "16:00", value: 35 },
  { time: "18:00", value: 29 },
  { time: "20:00", value: 24 },
];

const alerts = [
  { type: "warning" as const, message: "Humidité faible", parcelle: "Parcelle 2 — Oliveraie", time: "14:23" },
  { type: "info" as const, message: "Irrigation recommandée", parcelle: "Parcelle 1 — Maraîchage", time: "14:00" },
  { type: "critical" as const, message: "Température élevée", parcelle: "Parcelle 3 — Blé", time: "13:45" },
  { type: "info" as const, message: "Irrigation terminée", parcelle: "Parcelle 4 — Légumes", time: "12:30" },
];

const forecast = [
  { day: "Lun", temp: 34, humidity: 25, icon: "☀" },
  { day: "Mar", temp: 32, humidity: 30, icon: "⛅" },
  { day: "Mer", temp: 28, humidity: 55, icon: "🌧" },
  { day: "Jeu", temp: 30, humidity: 40, icon: "⛅" },
  { day: "Ven", temp: 35, humidity: 20, icon: "☀" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="border-b-grid border-border p-6">
        <h1 className="font-data text-2xl font-bold tracking-wide uppercase">Dashboard</h1>
        <p className="font-ui text-sm text-muted-foreground mt-1">Vue d'ensemble du système — 10 Mars 2026</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 border-b-grid border-border">
        <div className="border-r-grid border-border">
          <StatCard label="Parcelles actives" value={4} />
        </div>
        <div className="border-r-grid border-border">
          <StatCard label="Humidité moyenne" value={52} unit="%" status="warning" />
        </div>
        <div className="border-r-grid border-border">
          <StatCard label="Température" value={34} unit="°C" status="warning" />
        </div>
        <div>
          <StatCard label="Système" value="ON" status="success" />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 border-b-grid border-border">
        <div className="border-r-grid border-border p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Évolution Humidité du Sol</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={humidityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 77%)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <YAxis tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <Area type="stepAfter" dataKey="value" stroke="hsl(193 100% 24%)" fill="hsl(193 100% 24% / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Évolution Température</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 77%)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <YAxis tick={{ fontSize: 11, fontFamily: "Space Grotesk" }} stroke="hsl(40 20% 77%)" />
              <Area type="stepAfter" dataKey="value" stroke="hsl(24 85% 46%)" fill="hsl(24 85% 46% / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: Alerts + Forecast + Fill bars */}
      <div className="grid grid-cols-3">
        <div className="border-r-grid border-border p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Alertes Récentes</h2>
          <div className="flex flex-col gap-2">
            {alerts.map((a, i) => (
              <AlertItem key={i} {...a} />
            ))}
          </div>
        </div>
        <div className="border-r-grid border-border p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Prévision Météo</h2>
          <div className="flex justify-between gap-2">
            {forecast.map((f) => (
              <div key={f.day} className="border-grid border-border bg-card p-3 flex-1 text-center">
                <span className="text-2xl">{f.icon}</span>
                <p className="font-data text-xs font-semibold mt-2">{f.day}</p>
                <p className="font-data text-lg font-bold mt-1">{f.temp}°</p>
                <p className="font-data text-xs text-muted-foreground">{f.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h2 className="font-data text-sm font-semibold uppercase tracking-widest mb-4">Humidité par Parcelle</h2>
          <div className="flex justify-around items-end pt-4">
            <FillBar value={65} label="P1" variant="primary" />
            <FillBar value={38} label="P2" variant="warning" />
            <FillBar value={42} label="P3" variant="warning" />
            <FillBar value={78} label="P4" variant="accent" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
