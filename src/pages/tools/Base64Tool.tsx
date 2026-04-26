import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Upload, File } from "lucide-react";

export function Base64Tool() {
  const tool = ALL_TOOLS.find(t => t.id === "base64")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");

  const handleAction = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput("Error: Invalid Base64 or non-standard characters during encoding.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        // For files, we usually want to encode the binary data to base64
        const base64 = content.split(",")[1] || content;
        setOutput(base64);
        setMode("encode");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolPage 
      tool={tool} 
      output={output} 
      onAction={handleAction} 
      actionLabel={mode === "encode" ? "Encode" : "Decode"}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label className="text-foreground font-bold">Input Text</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter text to ${mode}...`}
            className="bg-muted/50 min-h-[150px] font-mono text-foreground"
          />
        </div>

        <div className="relative group">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {fileName ? `File: ${fileName}` : "Drag & drop file here to encode"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-foreground/60">Supports any file type. Encodes directly to Base64.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
