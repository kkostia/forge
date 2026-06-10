import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "border-edge-bright bg-forge-950/60 text-ash-100 placeholder:text-ash-500 h-11 w-full rounded-md border px-3.5 text-sm",
          "focus-visible:border-ember focus-visible:ring-ember/30 transition-colors focus-visible:ring-2 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
