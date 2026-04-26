import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export function BinaryTool() {
  const tool = ALL_TOOLS.find(t => t.id === "binary")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = () => {
    try {
      if (mode === "encode") {
        // Text to Binary
        const bytes = new TextEncoder().encode(input);
        const binary = Array.from(bytes)
          .map(byte => byte.toString(2).padStart(8, '0'))
          .join(' ');
        setOutput(binary);
      } else {
        // Binary to Text
        const cleanBinary = input.replace(/[^01]/g, '');
        if (cleanBinary.length % 8 !== 0) {
          throw new Error("Invalid binary length. Must be a multiple of 8 bits.");
        }
        
        const bytes = new Uint8Array(
          cleanBinary.match(/.{1,8}/g)?.map(byte => parseInt(byte, 2)) || []
        );
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      setOutput(`Error: ${e instanceof Error ? e.message : "Invalid binary sequence."}`);
    }
  };

  return (
    <ToolPage 
      tool={tool} 
      output={output} 
      onAction={handleAction} 
      actionLabel={mode === "encode" ? "To Binary" : "To Text"}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="encode">Text to Binary</TabsTrigger>
            <TabsTrigger value="decode">Binary to Text</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-bold">Input</Label>
            <span className="text-[10px] text-muted-foreground font-mono font-medium">{input.length} chars</span>
          </div>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "Enter text..." : "Enter binary (e.g. 01001000 01100101 01101100 01101100 01101111)"}
            className="bg-muted/50 min-h-[150px] font-mono text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
