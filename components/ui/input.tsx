import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-background-elevated px-4 text-sm text-foreground placeholder:text-muted/70 transition-colors outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 disabled:opacity-40",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-border bg-background-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 disabled:opacity-40 resize-none",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Input, Textarea };
