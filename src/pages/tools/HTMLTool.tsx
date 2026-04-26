import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export function HTMLTool() {
  const tool = ALL_TOOLS.find(t => t.id === "html")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = () => {
    if (mode === "encode") {
      const div = document.createElement("div");
      div.textContent = input;
      setOutput(div.innerHTML);
    } else {
      const div = document.createElement("div");
      div.innerHTML = input;
      setOutput(div.textContent || "");
    }
  };

  return (
    <ToolPage 
      tool={tool} 
      output={output} 
      onAction={handleAction} 
      actionLabel={mode === "encode" ? "Escape" : "Unescape"}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="encode">Encode (Escape)</TabsTrigger>
            <TabsTrigger value="decode">Decode (Unescape)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label className="text-foreground font-bold">HTML Input</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter HTML or text to ${mode}...`}
            className="bg-muted/50 min-h-[150px] font-mono text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
