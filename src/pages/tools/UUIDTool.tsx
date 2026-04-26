import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
// uuid v7 is coming in v10, but we can implement it or use a utility if v9 doesn't have it.
// Many uuid packages have v7 now. Let's check or implement a basic one if needed.
// Actually uuid v10 is out but I'll check my package.json.
// If uuid doesn't support v7, I'll use a standard implementation.
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

// Basic UUID v7 implementation if not in the lib
function uuidv7() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const ts = Date.now();
  
  // Timestamp: 48 bits
  bytes[0] = (ts / 0x10000000000) & 0xff;
  bytes[1] = (ts / 0x100000000) & 0xff;
  bytes[2] = (ts / 0x1000000) & 0xff;
  bytes[3] = (ts / 0x10000) & 0xff;
  bytes[4] = (ts / 0x100) & 0xff;
  bytes[5] = ts & 0xff;
  
  // Version 7: bits 4-7 of 6th byte
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant 1: bits 6-7 of 8th byte
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

export function UUIDTool() {
  const tool = ALL_TOOLS.find(t => t.id === "uuid")!;
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const ids = Array.from({ length: Math.min(count, 100) }).map(() => 
      version === "v4" ? uuidv4() : uuidv7()
    );
    setOutput(ids.join("\n"));
  };

  return (
    <ToolPage tool={tool} output={output} onAction={handleGenerate}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label className="text-foreground font-bold">UUID Version</Label>
          <Tabs value={version} onValueChange={(v: any) => setVersion(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
              <TabsTrigger value="v4">Version 4 (Random)</TabsTrigger>
              <TabsTrigger value="v7">Version 7 (Time-based)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-4">
          <Label className="text-foreground font-bold">Quantity (1-100)</Label>
          <Input 
            type="number" 
            min={1} 
            max={100} 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="bg-muted/50 text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
