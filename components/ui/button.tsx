import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-gold-bright to-gold text-[#151107] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(201,161,90,0.55)] hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_10px_32px_-6px_rgba(201,161,90,0.7)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-surface text-foreground border border-border hover:border-border-hover hover:bg-surface-hover",
        outline:
          "border border-gold/40 text-gold-bright hover:bg-gold/10 hover:border-gold",
        ghost: "text-muted hover:text-foreground hover:bg-surface",
        destructive:
          "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
        link: "text-gold-bright underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
