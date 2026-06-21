import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, active, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg border border-transparent",
        "text-fg-soft transition-all duration-150 ease-out",
        "hover:border-border hover:bg-surface-hover hover:text-fg",
        "active:scale-[0.92]",
        active && "border-border-strong bg-surface-elevated text-fg",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";

export default IconButton;
