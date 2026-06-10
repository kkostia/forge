import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("brushed border-edge rounded-xl border p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-ash-500 text-xs font-semibold tracking-wider uppercase">{label}</p>
        {Icon && <Icon className="text-ember size-4" />}
      </div>
      <p className="nums text-ash-100 font-display mt-2 text-4xl tracking-wide">
        {value}
        {unit && <span className="text-ash-500 ml-1 text-lg font-normal">{unit}</span>}
      </p>
    </div>
  );
}
