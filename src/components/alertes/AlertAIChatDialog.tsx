import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";

interface AlertAIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertMessage: string;
  parcelle: string;
  type: string;
}

const suggestions: Record<string, string[]> = {
  warning: [
    "Comment augmenter l'humidité du sol ?",
    "Quel est le meilleur moment pour irriguer ?",
    "Comment vérifier le capteur d'humidité ?",
  ],
  critical: [
    "Comment protéger les cultures de la chaleur ?",
    "Faut-il irriguer immédiatement ?",
    "Quelles mesures d'urgence prendre ?",
  ],
  info: [
    "Quelle quantité d'eau recommander ?",
    "Comment optimiser l'irrigation ?",
    "Quel programme d'irrigation adopter ?",
  ],
};

const getAIResponse = (question: string, alertMsg: string, parcelle: string): string => {
  if (question.toLowerCase().includes("humidité") || alertMsg.toLowerCase().includes("humidité")) {
    return `Pour ${parcelle}, je recommande d'augmenter la fréquence d'irrigation à 2 fois par jour pendant les heures fraîches (6h-8h et 18h-20h). Utilisez un paillage organique pour retenir l'humidité du sol. Vérifiez également que le système de goutte-à-goutte fonctionne correctement.`;
  }
  if (question.toLowerCase().includes("température") || question.toLowerCase().includes("chaleur") || alertMsg.toLowerCase().includes("température")) {
    return `La température élevée sur ${parcelle} nécessite des mesures urgentes : installez des filets d'ombrage (30-40%), augmentez l'irrigation tôt le matin, et évitez tout travail du sol pendant les heures chaudes. Envisagez une brumisation si disponible.`;
  }
  if (question.toLowerCase().includes("irrigation") || alertMsg.toLowerCase().includes("irrigation")) {
    return `Pour ${parcelle}, je conseille un programme d'irrigation adapté : 30 min matin et 20 min soir en période chaude. Surveillez l'humidité du sol avec les capteurs et ajustez selon les besoins. L'irrigation goutte-à-goutte est la plus efficace pour économiser l'eau.`;
  }
  return `Concernant "${alertMsg}" sur ${parcelle} : je vous recommande de surveiller de près les paramètres environnementaux et d'ajuster vos pratiques agricoles en conséquence. N'hésitez pas à me poser des questions plus spécifiques pour des conseils détaillés.`;
};

const AlertAIChatDialog = ({ open, onOpenChange, alertMessage, parcelle, type }: AlertAIChatDialogProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Bonjour ! Je suis votre assistant agricole IA. Je vois une alerte sur **${parcelle}** : "${alertMessage}". Comment puis-je vous aider ?`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg = { role: "user" as const, content: msg };
    const aiResponse = getAIResponse(msg, alertMessage, parcelle);
    const aiMsg = { role: "assistant" as const, content: aiResponse };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-data text-base">
            <Bot className="w-5 h-5 text-primary" />
            Conseiller IA — {parcelle}
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 min-h-[200px] max-h-[400px]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`rounded-xl px-3 py-2 text-sm max-w-[80%] ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {(suggestions[type] || suggestions.info).map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question..."
            className="flex-1"
          />
          <Button size="icon" onClick={() => handleSend()} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertAIChatDialog;
