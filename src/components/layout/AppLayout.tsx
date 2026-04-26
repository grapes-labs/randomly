import React from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { ShieldCheck } from "lucide-react";
import { SearchProvider } from "@/src/contexts/SearchContext";
import { SearchInput } from "../ui/SearchInput";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Sidebar />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 w-full bg-background/50 backdrop-blur-md border-b border-border lg:hidden">
            <div className="flex h-14 items-center px-4 gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="font-bold tracking-tight flex-1">Randomly</span>
              <SearchInput className="max-w-[180px]" />
            </div>
          </header>

          <main className="flex-1 px-4 py-8 md:px-8 lg:px-12 max-w-5xl mx-auto w-full pb-24 lg:pb-8">
            {children}
          </main>

        <footer className="px-4 py-8 md:px-8 lg:px-12 max-w-5xl mx-auto w-full border-t border-border mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Randomly. Free, Fast & Private.</p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>All operations occur entirely in your browser</span>
            </div>
          </div>
        </footer>
      </div>
      <MobileNav />
    </div>
    </SearchProvider>
  );
}
