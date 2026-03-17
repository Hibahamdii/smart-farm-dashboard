import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Parcelles from "./pages/Parcelles.tsx";
import ParcelleDetails from "./pages/ParcelleDetails.tsx";
import Irrigation from "./pages/Irrigation.tsx";
import Historique from "./pages/Historique.tsx";
import Alertes from "./pages/Alertes.tsx";
import Settings from "./pages/Settings.tsx";
import MapView from "./pages/MapView.tsx";
import Login from "./pages/Login.tsx";
import Meteo from "./pages/Meteo.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/parcelles" element={<Parcelles />} />
          <Route path="/parcelles/:id" element={<ParcelleDetails />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/carte" element={<MapView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/meteo" element={<Meteo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
