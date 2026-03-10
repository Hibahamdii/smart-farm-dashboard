import { cn } from "@/lib/utils";

interface AlertItemProps {
  type: "warning" | "info" | "critical";
  message: string;
  parcelle?: string;
  time?: string;
}

const AlertItem = ({ type, message, parcelle, time }: AlertItemProps) => {
  return (
    <div className={cn(
      "border-l-4 p-3 bg-card border-grid border-border",
      type === "warning" && "border-l-destructive",
      type === "critical" && "border-l-destructive",
      type === "info" && "border-l-primary"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-data text-sm font-medium">{message}</p>
          {parcelle && <p className="text-xs font-ui text-muted-foreground mt-0.5">{parcelle}</p>}
        </div>
        {time && <span className="text-xs font-data text-muted-foreground shrink-0">{time}</span>}
      </div>
    </div>
  );
};

export default AlertItem;
