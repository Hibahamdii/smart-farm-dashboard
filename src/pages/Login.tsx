import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sprout, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("L'authentification nécessite Lovable Cloud. Activez-le pour continuer!");
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Connexion ${provider} nécessite Lovable Cloud. Activez-le pour continuer!`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 glow-primary">
            <Sprout className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold">Smart Irrigation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Créer un nouveau compte" : "Connectez-vous à votre dashboard"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl border border-border p-6">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl px-4 py-3 text-sm font-semibold transition-colors border border-border"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>

            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuer avec Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">ou par email</span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-xl bg-secondary border-border h-11"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 rounded-xl bg-secondary border-border h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button type="button" className="text-xs text-primary hover:underline">
                  Mot de passe oublié?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl h-11" disabled={loading}>
              {loading ? "Chargement..." : isSignUp ? "Créer un compte" : "Se connecter"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignUp ? "Déjà un compte?" : "Pas encore de compte?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
              {isSignUp ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>

        {/* Back to dashboard */}
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
