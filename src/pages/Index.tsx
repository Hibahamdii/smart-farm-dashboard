import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, X, MapPin, Droplets, Wind, Gauge, Sun, Cloud, CloudRain, CloudSun, Eye, ThermometerSun, Sprout } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import parcelle1 from "@/assets/parcelle-1.jpg";
import parcelle2 from "@/assets/parcelle-2.jpg";

const smartScoreData = [
  { day: "15 Sep", v: 0.12 }, { day: "", v: 0.08 }, { day: "", v: 0.15 },
  { day: "", v: 0.1 }, { day: "", v: 0.18 }, { day: "", v: 0.22 },
  { day: "", v: 0.14 }, { day: "", v: 0.09 }, { day: "", v: 0.25 },
  { day: "", v: 0.3 }, { day: "1 Oct", v: 0.28 }, { day: "", v: 0.2 },
  { day: "", v: 0.15 }, { day: "", v: 0.35 }, { day: "", v: 0.4 },
  { day: "", v: 0.38 }, { day: "", v: 0.32 }, { day: "", v: 0.25 },
  { day: "", v: 0.2 }, { day: "", v: 0.3 }, { day: "1 Nov", v: 0.28 },
  { day: "", v: 0.22 }, { day: "", v: 0.18 }, { day: "", v: 0.25 },
];

const forecast = [
  { day: "SAM", temp: 10, icon: CloudSun },
  { day: "DIM", temp: 15, icon: Cloud },
  { day: "LUN", temp: 11, icon: CloudRain },
  { day: "MAR", temp: 10, icon: CloudRain },
  { day: "MER", temp: 12, icon: CloudSun },
  { day: "JEU", temp: 10, icon: Cloud },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Search Bar + Location */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center bg-card rounded-full px-4 py-2.5 border border-border flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input
            placeholder="Rechercher..."
            className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
          />
          <X className="w-4 h-4 text-muted-foreground cursor-pointer" />
          <button className="ml-3 bg-primary text-primary-foreground rounded-full px-5 py-1.5 text-sm font-semibold">
            Chercher
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">Alger, Mitidja</p>
            <p className="text-xs text-muted-foreground">27°C min · 10°C max · 💧 99%</p>
          </div>
          <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 border border-border">
            <Sun className="w-5 h-5 text-warning" />
            <span className="text-lg font-bold">25 °C</span>
            <span className="text-xs text-muted-foreground">· Maintenant</span>
          </div>
        </div>
      </div>

      {/* Row 1: Field cards + Weather + Standard Rate */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Field Images */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="card-hover cursor-pointer">
              <img src={parcelle1} alt="Champ de blé" className="w-full h-24 object-cover rounded-xl" />
              <p className="text-sm font-semibold mt-2">Champ de Blé</p>
              <p className="text-xs text-muted-foreground">18 ha</p>
            </div>
            <div className="card-hover cursor-pointer">
              <img src={parcelle2} alt="Rizières" className="w-full h-24 object-cover rounded-xl" />
              <p className="text-sm font-semibold mt-2">Rizières</p>
              <p className="text-xs text-muted-foreground">12 ha</p>
            </div>
          </div>
        </div>

        {/* Weather Detail */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3 text-destructive" />
            <span>Alger, Mitidja</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-bold text-primary">+25</span>
            <span className="text-lg text-primary">°C</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">H : +33 °C &nbsp; L : +19 °C</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <Droplets className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Humidité</p>
              <p className="text-sm font-bold">74%</p>
            </div>
            <div>
              <CloudRain className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Précip.</p>
              <p className="text-sm font-bold">5 mm</p>
            </div>
            <div>
              <Gauge className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Pression</p>
              <p className="text-sm font-bold">1019</p>
            </div>
            <div>
              <Wind className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-xs text-muted-foreground">Vent</p>
              <p className="text-sm font-bold">18 km/h</p>
            </div>
          </div>
        </div>

        {/* Standard Rate */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h3 className="font-bold text-sm mb-3">Taux Standard</h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-background rounded-lg px-4 py-2 border border-border text-lg font-bold flex-1 text-center">
              100
            </div>
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button className="px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold">kg/ha</button>
              <button className="px-3 py-2 bg-card text-muted-foreground text-sm">L/ha</button>
            </div>
          </div>
          <h3 className="font-bold text-sm mb-2">Taux par Zone</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-accent rounded-lg p-2.5 text-center">
              <p className="text-xs text-accent-foreground font-semibold">Très élevé</p>
              <p className="text-xs text-muted-foreground">80 kg/ha · 1.5 ha</p>
            </div>
            <div className="bg-accent rounded-lg p-2.5 text-center">
              <p className="text-xs text-accent-foreground font-semibold">Élevé</p>
              <p className="text-xs text-muted-foreground">80 kg/ha · 1.5 ha</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Crop Progress + Smart Score */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Crop Progress */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base">Champ de Blé</h3>
              <p className="text-xs text-muted-foreground">18 ha</p>
            </div>
            <div className="flex gap-2 text-xs">
              {["S", "M", "6M", "A"].map((t, i) => (
                <button
                  key={t}
                  className={`px-2.5 py-1 rounded-full ${i === 1 ? "bg-foreground text-card font-semibold" : "text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(90 10% 90%)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="hsl(142 55% 45%)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${0.65 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                />
                <circle cx="60" cy="8" r="5" fill="hsl(142 55% 45%)" className="rotate-[234deg] origin-center" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Sprout className="w-7 h-7 text-warning mb-1" />
                <p className="text-sm font-bold text-primary">Remplissage</p>
                <p className="text-xs text-muted-foreground">30 jours avant<br />maturité</p>
              </div>
            </div>
            {/* Info Table */}
            <div className="flex-1">
              <div className="space-y-2.5">
                {[
                  ["Culture", "Blé"],
                  ["Surface", "46 ha"],
                  ["Phase", "Remplissage"],
                  ["Date semis", "Sep 15"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Score */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base">Smart Score</h3>
            <div className="flex gap-2 text-xs">
              {["S", "M", "6M", "A"].map((t, i) => (
                <button
                  key={t}
                  className={`px-2.5 py-1 rounded-full ${i === 1 ? "bg-foreground text-card font-semibold" : "text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <p className="text-4xl font-extrabold mb-4">0.25</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={smartScoreData} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(90 10% 90%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(90 10% 88%)" />
              <YAxis hide />
              <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                {smartScoreData.map((_, i) => (
                  <Cell key={i} fill={i % 3 === 0 ? "hsl(142 55% 45%)" : "hsl(38 92% 50% / 0.6)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Forecast + Wind/UV/Humidity/Visibility */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Today weather */}
        <div className="col-span-2 bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold">
              Vendredi 11:45
            </div>
          </div>
          <div className="flex items-start gap-4 mb-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">25</span>
                <span className="text-xl">°</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ressenti 18°</p>
              <p className="text-xs text-muted-foreground">Vent N-E: 6-7km/h</p>
              <p className="text-xs text-muted-foreground">Pression 1009MB</p>
              <p className="text-xs text-muted-foreground">Humidité 51%</p>
            </div>
            <Sun className="w-16 h-16 text-warning" />
          </div>
          {/* Forecast days */}
          <div className="grid grid-cols-6 gap-1">
            {forecast.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.day} className="text-center bg-background rounded-xl p-2">
                  <p className="text-[10px] font-semibold text-muted-foreground">{f.day}</p>
                  <Icon className="w-4 h-4 mx-auto my-1 text-muted-foreground" />
                  <p className="text-sm font-bold">{f.temp}°</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather details grid */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {/* Wind */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h4 className="font-bold text-sm mb-2">Statut du Vent</h4>
            <div className="flex items-end gap-1 h-12 mb-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
                    backgroundColor: `hsl(${200 + i * 3} 60% 60%)`,
                  }}
                />
              ))}
            </div>
            <p className="text-lg font-bold">7.50 km/h</p>
            <p className="text-xs text-muted-foreground">6:20 AM</p>
          </div>

          {/* UV Index */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h4 className="font-bold text-sm mb-2">Indice UV</h4>
            <div className="flex items-center justify-center my-3">
              <div className="relative w-24 h-12">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="hsl(90 10% 90%)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 45 A 40 40 0 0 1 60 10" fill="none" stroke="hsl(210 80% 55%)" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-bold text-center">5.50 UV</p>
          </div>

          {/* Humidity */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h4 className="font-bold text-sm mb-1">Humidité</h4>
            <div className="flex items-center gap-3 mt-2">
              <Droplets className="w-10 h-10 text-primary" />
              <div>
                <p className="text-2xl font-extrabold">84%</p>
                <p className="text-xs text-muted-foreground">Le point de rosée est 27°<br />en ce moment</p>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h4 className="font-bold text-sm mb-1">Visibilité</h4>
            <div className="flex items-center gap-3 mt-2">
              <Eye className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="text-2xl font-extrabold">04 km</p>
                <p className="text-xs text-muted-foreground">La brume affecte<br />la visibilité</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
