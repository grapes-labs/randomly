import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { CATEGORIES } from "@/src/config/tools";
import { ChevronDown, ChevronRight, LayoutGrid, ShieldCheck } from "lucide-react";
import { useSearch } from "@/src/contexts/SearchContext";
import { SearchInput } from "../ui/SearchInput";
import { ThemeToggle } from "../ThemeToggle";

export function Sidebar() {
  const location = useLocation();
  const { searchQuery } = useSearch();
  const [openCategories, setOpenCategories] = useState<string[]>(
    CATEGORIES.map(c => c.name)
  );

  // Automatically expand categories that have matching tools when searching
  React.useEffect(() => {
    if (searchQuery) {
      const matching = CATEGORIES.filter(category => 
        category.tools.some(tool => 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      ).map(c => c.name);
      setOpenCategories(matching);
    } else {
      setOpenCategories(CATEGORIES.map(c => c.name));
    }
  }, [searchQuery]);

  const filteredCategories = CATEGORIES.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.tools.length > 0);

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-background border-r border-border transition-colors duration-300">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary-foreground" />
        </div>
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          Randomly
        </Link>
      </div>

      <div className="px-4 mb-6">
        <SearchInput />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-6 pb-8 custom-scrollbar">
        <div>
          <Link 
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors mb-1",
              location.pathname === "/" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Home
          </Link>
        </div>

        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.name} className="space-y-1">
              <p className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                {category.name}
              </p>
              <div className="space-y-0.5">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
                      location.pathname === tool.path
                        ? "bg-primary/10 text-primary font-medium border border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-muted-foreground italic">No tools found</p>
          </div>
        )}
      </nav>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] items-center text-muted-foreground uppercase tracking-widest font-bold">Theme</span>
          <ThemeToggle />
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Data never leaves your browser
          </p>
        </div>
      </div>
    </aside>
  );
}
