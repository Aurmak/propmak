import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#1B2559] text-white hover:bg-[#232f6e]",
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200",
        destructive:
          "bg-rose-600 text-white",
        outline:
          "border border-slate-300 text-slate-700",
        emerald:
          "bg-emerald-600 text-white",
        amber:
          "bg-amber-600 text-white",
        blue:
          "bg-blue-600 text-white",
        purple:
          "bg-indigo-600 text-white",
        teal:
          "bg-teal-600 text-white",
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
