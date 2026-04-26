import React, { useEffect } from "react";
import { Tool } from "@/src/types";
import { SEOSection } from "./SEOSection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Copy, Shield } from "lucide-react";
import { useToast } from "./ui/toast";
import { motion } from "motion/react";

interface ToolPageProps {
  tool: Tool;
  children: React.ReactNode;
  onCopy?: () => void;
  output?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function ToolPage({ 
  tool, 
  children, 
  onCopy, 
  output, 
  onAction, 
  actionLabel = "Generate" 
}: ToolPageProps) {
  const { toast } = useToast();

  useEffect(() => {
    document.title = `${tool.seoTitle} | Randomly`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", tool.seoDescription);
  }, [tool]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast("Copied to clipboard!");
      if (onCopy) onCopy();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground leading-none">{tool.name}</h1>
        <p className="text-muted-foreground">{tool.description}</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-muted/10 border-border">
          <CardContent className="p-6 space-y-6">
            {children}
            
            {onAction && (
              <Button size="lg" className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </CardContent>
        </Card>

        {output !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Output</Label>
              {output && (
                <span className="text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-widest">{output.length} chars</span>
              )}
            </div>
            <div className="relative group">
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <Button variant="secondary" size="sm" className="h-8 bg-muted hover:bg-secondary border-none px-2 text-muted-foreground" onClick={handleCopy} disabled={!output}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <textarea
                readOnly
                className="w-full min-h-[280px] bg-muted/20 border border-border rounded-xl p-4 font-mono text-sm text-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none custom-scrollbar"
                value={output || ""}
                placeholder="No output yet..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-8 mt-4 grid gap-8 md:grid-cols-1">
        <SEOSection tool={tool} />
      </div>
    </motion.div>
  );
}
