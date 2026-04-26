import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 lg:bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl pointer-events-auto min-w-[200px] max-w-sm",
                t.type === "success" && "bg-card border-border text-foreground dark:bg-zinc-900",
                t.type === "error" && "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/20 dark:border-red-500/50 dark:text-red-400",
                t.type === "info" && "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-500/50 dark:text-blue-400"
              )}
            >
              {t.type === "success" && <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />}
              {t.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
              {t.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
