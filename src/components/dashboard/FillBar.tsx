import { cn } from "@/lib/utils";

interface FillBarProps {
  value: number;
  max?: number;
  label?: string;
  height?: string;
  variant?: "primary" | "accent" | "warning";
}

const FillBar = ({ value, max = 100, label, height = "h-32", variant = "primary" }: FillBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("w-10 border-grid border-border bg-card relative", height)}>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-1000",
            variant === "primary" && "bg-primary",
            variant === "accent" && "bg-accent",
            variant === "warning" && "bg-destructive"
          )}
          style={{ height: `${percentage}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center font-data text-xs font-bold text-foreground mix-blend-difference">
          {value}%
        </span>
      </div>
      {label && <span className="text-xs font-ui text-muted-foreground text-center">{label}</span>}
    </div>
  );
};

export default FillBar;
