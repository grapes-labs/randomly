import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export function HexTool() {
  const tool = ALL_TOOLS.find(t => t.id === "hex")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = () => {
    try {
      if (mode === "encode") {
        const hex = Array.from(new TextEncoder().encode(input))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(' ');
        setOutput(hex);
      } else {
        const cleanHex = input.replace(/\s+/g, '');
        const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      setOutput("Error: Invalid Hex sequence.");
    }
  };

  return (
    <ToolPage 
      tool={tool} 
      output={output} 
      onAction={handleAction} 
      actionLabel={mode === "encode" ? "To Hex" : "To Text"}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="encode">Text to Hex</TabsTrigger>
            <TabsTrigger value="decode">Hex to Text</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label className="text-foreground font-bold">Input</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "Enter text..." : "Enter hex (e.g. 48 65 6c 6c 6f)"}
            className="bg-muted/50 min-h-[150px] font-mono text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
