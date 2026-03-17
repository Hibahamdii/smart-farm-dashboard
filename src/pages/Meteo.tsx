import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Sun, Cloud, CloudRain, CloudSun, CloudSnow, Droplets, Wind, Gauge, Eye,
  Thermometer, Sunrise, Sunset, MapPin, ArrowLeft, CloudLightning, CloudDrizzle,
  TrendingUp, TrendingDown, Calendar
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from "recharts";

const WEATHER_VIDEO_URL = "https://cdn.pixabay.com/video/2020/05/25/39609-424930080_large.mp4";

const countriesData: Record<string, {
  lat: number; lng: number; temp: number; humidity: number; wind: string;
  pressure: string; visibility: string; feelsLike: number; uv: number;
  dewPoint: number; sunrise: string; sunset: string; description: string;
}> = {
  "Algérie": { lat: 36.725, lng: 3.05, temp: 25, humidity: 74, wind: "18 km/h", pressure: "1019", visibility: "4 km", feelsLike: 27, uv: 7, dewPoint: 18, sunrise: "06:32", sunset: "19:45", description: "Partiellement nuageux" },
  "Tunisie": { lat: 36.8, lng: 10.18, temp: 28, humidity: 65, wind: "12 km/h", pressure: "1015", visibility: "6 km", feelsLike: 30, uv: 8, dewPoint: 20, sunrise: "06:15", sunset: "19:30", description: "Ensoleillé" },
  "Maroc": { lat: 33.97, lng: -6.85, temp: 22, humidity: 70, wind: "15 km/h", pressure: "1020", visibility: "5 km", feelsLike: 23, uv: 6, dewPoint: 16, sunrise: "06:45", sunset: "19:50", description: "Nuageux" },
  "France": { lat: 48.85, lng: 2.35, temp: 14, humidity: 82, wind: "22 km/h", pressure: "1013", visibility: "8 km", feelsLike: 11, uv: 3, dewPoint: 10, sunrise: "07:15", sunset: "19:20", description: "Pluie légère" },
  "Egypte": { lat: 30.04, lng: 31.24, temp: 33, humidity: 40, wind: "10 km/h", pressure: "1012", visibility: "7 km", feelsLike: 36, uv: 10, dewPoint: 15, sunrise: "05:50", sunset: "18:30", description: "Ensoleillé" },
  "Espagne": { lat: 40.42, lng: -3.7, temp: 19, humidity: 55, wind: "14 km/h", pressure: "1018", visibility: "10 km", feelsLike: 18, uv: 5, dewPoint: 12, sunrise: "07:00", sunset: "20:10", description: "Clair" },
};

const hourlyData = [
  { hour: "06h", temp: 18, hum: 80 }, { hour: "08h", temp: 20, hum: 75 },
  { hour: "10h", temp: 23, hum: 65 }, { hour: "12h", temp: 26, hum: 55 },
  { hour: "14h", temp: 28, hum: 50 }, { hour: "16h", temp: 27, hum: 52 },
  { hour: "18h", temp: 24, hum: 60 }, { hour: "20h", temp: 21, hum: 70 },
  { hour: "22h", temp: 19, hum: 78 },
];

const weekForecast = [
  { day: "Lun", high: 28, low: 18, icon: Sun, rain: 0, desc: "Ensoleillé" },
  { day: "Mar", high: 26, low: 17, icon: CloudSun, rain: 10, desc: "Partiellement nuageux" },
  { day: "Mer", high: 24, low: 16, icon: Cloud, rain: 30, desc: "Nuageux" },
  { day: "Jeu", high: 22, low: 15, icon: CloudRain, rain: 70, desc: "Pluie" },
  { day: "Ven", high: 20, low: 14, icon: CloudDrizzle, rain: 50, desc: "Bruine" },
  { day: "Sam", high: 23, low: 15, icon: CloudSun, rain: 15, desc: "Éclaircies" },
  { day: "Dim", high: 25, low: 16, icon: Sun, rain: 5, desc: "Ensoleillé" },
];

const rainfallData = [
  { month: "Jan", val: 65 }, { month: "Fév", val: 55 }, { month: "Mar", val: 45 },
  { month: "Avr", val: 35 }, { month: "Mai", val: 20 }, { month: "Jun", val: 5 },
  { month: "Jul", val: 2 }, { month: "Aoû", val: 5 }, { month: "Sep", val: 25 },
  { month: "Oct", val: 45 }, { month: "Nov", val: 60 }, { month: "Déc", val: 70 },
];

const Meteo = () => {
  const [selectedCountry, setSelectedCountry] = useState("Algérie");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const info = countriesData[selectedCountry];
  const dayName = currentTime.toLocaleDateString("fr-FR", { weekday: "long" });
  const dateStr = currentTime.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      {/* Hero Weather with Video */}
      <div className="rounded-2xl overflow-hidden relative mb-6" style={{ minHeight: 340 }}>
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={WEATHER_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/75" />

        <div className="relative z-10 p-6 h-full flex flex-col justify-between" style={{ minHeight: 340 }}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 text-white text-sm hover:bg-white/25 transition-all border border-white/10">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
            <div className="flex gap-2 flex-wrap justify-end">
              {Object.keys(countriesData).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    c === selectedCountry
                      ? "bg-white/25 text-white border-white/30 backdrop-blur-md"
                      : "bg-white/8 text-white/60 border-white/10 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">{selectedCountry}</span>
              <span className="text-white/50 text-xs">• {info.description}</span>
            </div>
            <div className="flex items-end gap-6">
              <div>
                <div className="flex items-baseline">
                  <span className="text-7xl font-extrabold text-white drop-shadow-lg">{info.temp}</span>
                  <span className="text-3xl text-white/70 ml-1">°C</span>
                </div>
                <p className="text-white/50 text-sm mt-1 capitalize">{dayName}, {dateStr}</p>
              </div>
              <div className="flex gap-3 mb-2">
                <div className="text-center">
                  <p className="text-white/50 text-[10px]">Ressenti</p>
                  <p className="text-white font-bold text-sm">{info.feelsLike}°</p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-[10px]">UV</p>
                  <p className="text-white font-bold text-sm">{info.uv}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-[10px]">Rosée</p>
                  <p className="text-white font-bold text-sm">{info.dewPoint}°</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { icon: Droplets, label: "Humidité", value: `${info.humidity}%`, color: "text-primary", bg: "bg-primary/10" },
          { icon: Wind, label: "Vent", value: info.wind, color: "text-primary", bg: "bg-primary/10" },
          { icon: Gauge, label: "Pression", value: `${info.pressure} hPa`, color: "text-primary", bg: "bg-primary/10" },
          { icon: Eye, label: "Visibilité", value: info.visibility, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-xl font-extrabold text-foreground">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sunrise/Sunset + Thermometer */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Soleil</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <Sunrise className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Lever</p>
                <p className="text-lg font-bold text-foreground">{info.sunrise}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <Sunset className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Coucher</p>
                <p className="text-lg font-bold text-foreground">{info.sunset}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly temperature chart */}
        <div className="col-span-2 glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Température Horaire</h3>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(0 0% 100%)", border: "1px solid hsl(150 10% 88%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="temp" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50% / 0.1)" strokeWidth={2.5} name="Temp °C" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Prévisions 7 Jours</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekForecast.map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.day} className="bg-accent/40 rounded-xl p-3 text-center hover:bg-accent/70 transition-all">
                <p className="text-xs font-bold text-muted-foreground mb-2">{f.day}</p>
                <FIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-extrabold text-foreground">{f.high}°</p>
                <p className="text-xs text-muted-foreground">{f.low}°</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">{f.rain}%</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rainfall + Humidity hourly */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Précipitations Mensuelles (mm)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(0 0% 100%)", border: "1px solid hsl(150 10% 88%)", fontSize: 12 }} />
              <Bar dataKey="val" radius={[6, 6, 0, 0]} name="Pluie (mm)">
                {rainfallData.map((_, i) => (
                  <Cell key={i} fill="hsl(210 80% 55%)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Humidité Horaire (%)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 10% 88%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(150 10% 45%)" }} stroke="hsl(150 10% 88%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, background: "hsl(0 0% 100%)", border: "1px solid hsl(150 10% 88%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="hum" stroke="hsl(142 60% 40%)" fill="hsl(142 60% 40% / 0.1)" strokeWidth={2.5} name="Humidité %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agriculture tips */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-bold text-foreground mb-3">🌾 Conseils Agricoles du Jour</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: "Irrigation", tip: info.temp > 30 ? "Arrosez tôt le matin ou tard le soir pour minimiser l'évaporation" : "Conditions idéales pour l'irrigation régulière", trend: info.temp > 30 ? "warning" : "success" },
            { title: "Récolte", tip: info.humidity > 70 ? "Risque d'humidité élevée, retarder la récolte de céréales" : "Bonnes conditions pour la récolte", trend: info.humidity > 70 ? "warning" : "success" },
            { title: "Protection", tip: info.uv > 7 ? "Fort indice UV — protéger les cultures sensibles" : "Conditions normales pour les cultures", trend: info.uv > 7 ? "warning" : "success" },
          ].map((c) => (
            <div key={c.title} className={`rounded-xl p-3 ${c.trend === "warning" ? "bg-warning/10" : "bg-primary/10"}`}>
              <div className="flex items-center gap-2 mb-1">
                {c.trend === "warning" ? <TrendingUp className="w-3.5 h-3.5 text-warning" /> : <TrendingDown className="w-3.5 h-3.5 text-primary" />}
                <span className={`text-xs font-bold ${c.trend === "warning" ? "text-warning" : "text-primary"}`}>{c.title}</span>
              </div>
              <p className="text-[11px] text-foreground leading-relaxed">{c.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meteo;
