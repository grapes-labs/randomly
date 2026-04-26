import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, ALL_TOOLS } from "@/src/config/tools";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ShieldCheck, ArrowRight, Zap, Lock, Globe, Search } from "lucide-react";
import { motion } from "motion/react";
import { useSearch } from "@/src/contexts/SearchContext";
import { SearchInput } from "../components/ui/SearchInput";

export function Home() {
  const { searchQuery, setSearchQuery } = useSearch();

  const filteredCategories = CATEGORIES.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.tools.length > 0);

  return (
    <div className="space-y-16 py-8">
      <section className="text-center space-y-8 max-w-3xl mx-auto">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Safe & Private • Browser Only
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight text-balance max-w-5xl mx-auto"
          >
            Generate, encode, and encrypt — randomly.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-4xl mx-auto text-pretty"
          >
            All the developer tools you reach for, in one place. Your data never leaves your browser.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="max-w-xl mx-auto"
        >
          <SearchInput 
            placeholder="Search for tools (e.g. 'jwt', 'hash', 'uuid')..." 
            className="h-14 shadow-2xl scale-110 md:scale-125"
          />
        </motion.div>
      </section>

      {!searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center gap-3 text-center p-6 rounded-xl border border-border bg-muted/20">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Instant</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">High-performance algorithms running at native speed.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center p-6 rounded-xl border border-border bg-muted/20">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Private</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">No tracking, no telemetry, no backend processing.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center p-6 rounded-xl border border-border bg-muted/20">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Local</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Works offline once loaded. Your tools, your browser.</p>
          </div>
        </motion.div>
      )}

      {filteredCategories.length > 0 ? (
        filteredCategories.map((category, idx) => (
          <section key={category.name} className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <category.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{category.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {category.tools.map((tool) => (
                <Link key={tool.id} to={tool.path} className="group">
                  <Card className="h-full bg-muted/5 border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <CardHeader className="flex flex-row items-start gap-5 p-6">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary transition-colors">
                        <tool.icon className="w-6 h-6 text-foreground group-hover:text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                        <CardDescription className="line-clamp-2 md:line-clamp-none leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No tools found</h3>
          <p className="text-muted-foreground">We couldn't find any tools matching "{searchQuery}"</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}

      <section className="bg-primary/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-3xl font-black text-foreground">Miss a tool?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Randomly is constantly expanding. All our tools are optimized for developer workflows 
          and privacy. Suggest a new tool on our GitHub.
        </p>
        <Link to="/tools/uuid">
          <Button size="lg" className="rounded-full px-10 font-bold mt-4">
            Explore All Tools
          </Button>
        </Link>
      </section>
    </div>
  );
}
