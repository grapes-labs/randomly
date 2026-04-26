import React from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "@/src/contexts/SearchContext";
import { cn } from "@/src/lib/utils";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
}

export function SearchInput({ className, placeholder = "Search tools..." }: SearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className={cn("relative group", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-10 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
