import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { ToastContext, type ToastKind } from "./toast-context";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const TOAST_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => setItems((prev) => prev.filter((t) => t.id !== id)), []);
  const show = useCallback(
    (kind: ToastKind, message: string) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => dismiss(id), TOAST_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              role={t.kind === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className={`toast toast-${t.kind} pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl`}
            >
              {t.kind === "success" ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden /> : <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />}
              <p className="flex-1 text-sm">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Hinweis schließen" className="opacity-70 hover:opacity-100">
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
