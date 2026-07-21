import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import IconButton from "./IconButton";
import { cn } from "../../lib/cn";
import { useI18n } from "../../i18n/context";

interface AppDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Tailwind max-width class for the panel. Defaults to a compact dialog. */
  maxWidthClassName?: string;
  /** Optional icon rendered to the left of the title. */
  titleIcon?: React.ReactNode;
  /** Skip the built-in title/close header row — the caller owns its own header/close affordance. `title` is still used for the a11y label. */
  hideHeader?: boolean;
  /** Extra classes for the panel itself (background, padding, height…). Later utilities win over the defaults. */
  panelClassName?: string;
  /** Skip the default `.glass` surface so panelClassName can fully own the background/shadow. */
  disableGlass?: boolean;
}

/**
 * Accessible modal: backdrop, focus trapped inside, Escape to close,
 * and focus returned to the trigger on close.
 */
export default function AppDialog({
  open,
  title,
  onClose,
  children,
  maxWidthClassName = "max-w-sm",
  titleIcon,
  hideHeader = false,
  panelClassName,
  disableGlass = false,
}: AppDialogProps) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    // Move focus into the dialog
    const node = panelRef.current;
    node?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    node?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const focusables = node.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      (triggerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  // Portaled to <body>: a `position: fixed` descendant is contained by the
  // nearest ancestor with a transform/filter/backdrop-filter, not the
  // viewport. Callers routinely mount dialogs inside `.glass` surfaces
  // (backdrop-filter), which would otherwise trap this at that ancestor's
  // box instead of centering on screen.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              !disableGlass && "glass",
              "relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-lg p-6 outline-none",
              maxWidthClassName,
              panelClassName,
            )}
          >
            {!hideHeader && (
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-fg">
                  {titleIcon}
                  {title}
                </h2>
                <IconButton label={t("dialog.close")} onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </IconButton>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
