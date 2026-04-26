import React, { useState } from "react";
import { nanoid } from "nanoid";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { customAlphabet } from "nanoid";

export function NanoIDTool() {
  const tool = ALL_TOOLS.find(t => t.id === "nanoid")!;
  const [length, setLength] = useState(21);
  const [alphabet, setAlphabet] = useState("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    try {
      const generate = customAlphabet(alphabet, length);
      setOutput(generate());
    } catch (e) {
      setOutput("Error: Invalid alphabet or length");
    }
  };

  return (
    <ToolPage tool={tool} output={output} onAction={handleGenerate}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label className="text-foreground font-bold">Length</Label>
          <Input 
            type="number" 
            min={1} 
            max={1024} 
            value={length} 
            onChange={(e) => setLength(parseInt(e.target.value) || 1)}
            className="bg-muted/50 text-foreground"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-foreground font-bold">Alphabet</Label>
          <Input 
            value={alphabet} 
            onChange={(e) => setAlphabet(e.target.value)}
            className="bg-muted/50 font-mono text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
