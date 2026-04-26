import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { CATEGORIES } from "@/src/config/tools";
import { LayoutGrid, Fingerprint, Code, Search, Lock, ArrowLeftRight, Bug } from "lucide-react";

const mobileIconMap: Record<string, any> = {
  "Generators": Fingerprint,
  "Testing": Bug,
  "Converters": ArrowLeftRight,
  "Encoders / Decoders": Code,
  "Hashing": Search,
  "Encryption": Lock
};

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border flex justify-around items-center px-2 py-3 transition-colors duration-300">
      <Link 
        to="/" 
        className={cn(
          "flex flex-col items-center gap-1 min-w-[60px]",
          location.pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] font-medium">Tools</span>
      </Link>

      {CATEGORIES.map(category => (
        <Link 
          key={category.name}
          to={category.tools[0].path}
          className={cn(
            "flex flex-col items-center gap-1 min-w-[60px]",
            location.pathname.startsWith(`/tools/${category.name.toLowerCase().split(' ')[0]}`) 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          {React.createElement(mobileIconMap[category.name] || LayoutGrid, { className: "w-5 h-5" })}
          <span className="text-[10px] font-medium truncate max-w-[64px]">
            {category.name.split(' ')[0]}
          </span>
        </Link>
      ))}
    </nav>
  );
}
