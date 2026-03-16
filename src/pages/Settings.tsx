import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, X, Pencil } from "lucide-react";

type User = { name: string; role: string };

const Settings = () => {
  const [humidityThreshold, setHumidityThreshold] = useState(40);
  const [irrigationDuration, setIrrigationDuration] = useState(15);
  const [users, setUsers] = useState<User[]>([
    { name: "Ahmed Ben Ali", role: "Admin" },
    { name: "Fatma Khaldi", role: "Agriculteur" },
    { name: "Mohamed Trabelsi", role: "Agriculteur" },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<User>({ name: "", role: "" });

  const handleSaveParams = () => {
    toast.success(`Paramètres sauvegardés ! Seuil: ${humidityThreshold}%, Durée: ${irrigationDuration}min`);
  };

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditForm({ ...users[i] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    if (!editForm.name.trim()) { toast.error("Le nom est requis"); return; }
    const updated = [...users];
    updated[editingIndex] = { ...editForm };
    setUsers(updated);
    setEditingIndex(null);
    toast.success(`Utilisateur "${editForm.name}" modifié`);
  };

  const cancelEdit = () => setEditingIndex(null);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Configuration du système d'irrigation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System params */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Paramètres Système</h2>

          <div className="space-y-6">
            <div className="bg-accent/30 rounded-xl p-4 border border-border">
              <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-3 font-semibold">
                Seuil Humidité (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="10" max="80"
                  value={humidityThreshold}
                  onChange={(e) => setHumidityThreshold(Number(e.target.value))}
                  className="flex-1 accent-[hsl(142,60%,40%)] h-2"
                />
                <span className="text-2xl font-extrabold w-16 text-right text-primary">{humidityThreshold}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                L'irrigation se déclenche automatiquement sous ce seuil.
              </p>
            </div>

            <div className="bg-accent/30 rounded-xl p-4 border border-border">
              <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-3 font-semibold">
                Durée Irrigation Automatique (min)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="5" max="60"
                  value={irrigationDuration}
                  onChange={(e) => setIrrigationDuration(Number(e.target.value))}
                  className="flex-1 accent-[hsl(142,60%,40%)] h-2"
                />
                <span className="text-2xl font-extrabold w-16 text-right text-primary">{irrigationDuration}m</span>
              </div>
            </div>

            <Button onClick={handleSaveParams} className="w-full rounded-xl h-11">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder les Paramètres
            </Button>
          </div>
        </div>

        {/* Users */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Gestion Utilisateurs</h2>

          <div className="space-y-3">
            {users.map((u, i) => (
              <div key={i} className="flex items-center justify-between bg-accent/30 rounded-xl p-4 border border-border">
                {editingIndex === i ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-sm rounded-lg px-3 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary flex-1"
                      placeholder="Nom"
                    />
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="text-sm rounded-lg px-3 py-1.5 border border-border bg-card text-foreground outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Agriculteur">Agriculteur</option>
                    </select>
                    <Button size="sm" onClick={saveEdit} className="rounded-lg h-8 px-3">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="rounded-lg h-8 px-3">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{u.name}</p>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                          u.role === "Admin" ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => startEdit(i)} className="rounded-lg">
                      <Pencil className="w-3 h-3 mr-1" /> Modifier
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
