import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

const springy = { type: "spring" as const, stiffness: 400, damping: 20 };

const base =
  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-45";

const variants = {
  primary:
    "bg-linear-to-b from-accent to-accent-soft px-6 py-3 text-[#0c1020] shadow-[0_6px_24px_var(--accent-glow)] hover:shadow-[0_8px_28px_var(--accent-glow)]",
  secondary: "bg-white/4 px-5 py-2.5 text-fg-soft hover:bg-white/6 hover:text-fg",
};

/** Shared button primitive — primary (solid accent pill) and secondary (translucent, borderless) variants, both with a spring hover/tap. */
export default function Button({ variant = "primary", className, disabled, children, ...rest }: ButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={springy}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
