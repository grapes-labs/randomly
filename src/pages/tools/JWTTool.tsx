import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";

export function JWTTool() {
  const tool = ALL_TOOLS.find(t => t.id === "jwt")!;
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<{header: any, payload: any} | null>(null);

  const handleAction = () => {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT format (must have 3 parts)");
      
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setDecoded({ header, payload });
    } catch (e) {
      setDecoded(null);
      alert("Invalid JWT token provided.");
    }
  };

  return (
    <ToolPage 
      tool={tool} 
      onAction={handleAction} 
      actionLabel="Decode Token"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-foreground font-bold">JWT Token</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="bg-muted/50 min-h-[120px] font-mono break-all text-foreground"
          />
        </div>

        {decoded && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Header</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <pre className="text-xs font-mono text-foreground overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400">Payload</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <pre className="text-xs font-mono text-foreground overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolPage>
  );
}
