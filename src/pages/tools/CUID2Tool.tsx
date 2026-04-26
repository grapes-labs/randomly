import React, { useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export function CUID2Tool() {
  const tool = ALL_TOOLS.find(t => t.id === "cuid2")!;
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const ids = Array.from({ length: Math.min(count, 100) }).map(() => createId());
    setOutput(ids.join("\n"));
  };

  return (
    <ToolPage tool={tool} output={output} onAction={handleGenerate}>
      <div className="space-y-4 max-w-sm">
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
    </ToolPage>
  );
}
