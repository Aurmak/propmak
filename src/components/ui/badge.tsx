import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-slate-900 bg-slate-900 text-white shadow-2xs hover:bg-slate-800",
        secondary:
          "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-rose-300 bg-rose-100 text-rose-950",
        outline:
          "border-slate-300 text-slate-900",
        emerald:
          "border-emerald-300 bg-emerald-100 text-emerald-950",
        amber:
          "border-amber-300 bg-amber-100 text-amber-950",
        blue:
          "border-blue-300 bg-blue-100 text-blue-950",
        purple:
          "border-purple-300 bg-purple-100 text-purple-950",
        teal:
          "border-teal-300 bg-teal-100 text-teal-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
