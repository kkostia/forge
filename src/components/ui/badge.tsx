import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-edge-bright bg-forge-800 text-ash-300",
        ember: "border-ember/40 bg-ember/10 text-ember-bright",
        bronze: "border-bronze/40 bg-bronze/10 text-bronze",
        silver: "border-silver/40 bg-silver/10 text-silver",
        gold: "border-gold/40 bg-gold/10 text-gold",
        platinum: "border-platinum/40 bg-platinum/10 text-platinum",
        outline: "border-edge-bright text-ash-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
