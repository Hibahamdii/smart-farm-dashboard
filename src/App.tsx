import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
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

const HomeRedirect = () => {
  const { user, role, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="agriculteur"><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/parcelles" element={<ProtectedRoute><Parcelles /></ProtectedRoute>} />
            <Route path="/parcelles/:id" element={<ProtectedRoute><ParcelleDetails /></ProtectedRoute>} />
            <Route path="/irrigation" element={<ProtectedRoute><Irrigation /></ProtectedRoute>} />
            <Route path="/historique" element={<ProtectedRoute><Historique /></ProtectedRoute>} />
            <Route path="/alertes" element={<ProtectedRoute><Alertes /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
            <Route path="/carte" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
            <Route path="/meteo" element={<ProtectedRoute><Meteo /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
