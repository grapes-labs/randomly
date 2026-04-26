import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border" id="theme-toggle">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-1.5 rounded-md transition-all",
          theme === "light" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        title="Light Mode"
        id="theme-light"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-1.5 rounded-md transition-all",
          theme === "dark" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        title="Dark Mode"
        id="theme-dark"
      >
        <Moon size={14} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-1.5 rounded-md transition-all",
          theme === "system" 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        title="System Preference"
        id="theme-system"
      >
        <Monitor size={14} />
      </button>
    </div>
  );
}
