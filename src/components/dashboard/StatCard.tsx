import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "normal" | "warning" | "success";
}

const StatCard = ({ label, value, unit, status = "normal" }: StatCardProps) => {
  return (
    <div className="border-grid border-border bg-card p-5">
      <p className="text-xs font-ui uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "font-data text-3xl font-bold",
          status === "warning" && "text-destructive",
          status === "success" && "text-accent",
          status === "normal" && "text-foreground"
        )}>
          {value}
        </span>
        {unit && <span className="font-data text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};

export default StatCard;
