import React, { useState, useEffect } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Globe, Link2, Settings2, Hash } from "lucide-react";

export function URLTool() {
  const tool = ALL_TOOLS.find(t => t.id === "url")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [scope, setScope] = useState<"component" | "uri">("component");
  const [spaceMode, setSpaceMode] = useState<"percent" | "plus">("percent");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    handleAction();
  }, [input, mode, scope, spaceMode]);

  const handleAction = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        let result = "";
        if (scope === "uri") {
          result = encodeURI(input);
        } else {
          result = encodeURIComponent(input);
        }

        if (spaceMode === "plus") {
          result = result.replace(/%20/g, "+");
        }
        setOutput(result);
      } else {
        let processedInput = input;
        if (spaceMode === "plus") {
          processedInput = input.replace(/\+/g, " ");
        }
        
        if (scope === "uri") {
          setOutput(decodeURI(processedInput));
        } else {
          setOutput(decodeURIComponent(processedInput));
        }
      }
    } catch (e) {
      setOutput("Error: Invalid input for chosen operation.");
    }
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-sm">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1 h-10">
              <Button
                variant={scope === "component" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => setScope("component")}
                title="Strictly encodes syntax characters (?, &, /, etc)"
              >
                <Link2 className="w-3 h-3 mr-1" />
                Component
              </Button>
              <Button
                variant={scope === "uri" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => setScope("uri")}
                title="Preserves URI syntax characters"
              >
                <Globe className="w-3 h-3 mr-1" />
                Full URI
              </Button>
            </div>

            <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1 h-10">
              <Button
                variant={spaceMode === "percent" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs px-3 font-mono"
                onClick={() => setSpaceMode("percent")}
                title="Spaces as %20 (RFC 3986)"
              >
                %20
              </Button>
              <Button
                variant={spaceMode === "plus" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs px-3 font-mono"
                onClick={() => setSpaceMode("plus")}
                title="Spaces as + (application/x-www-form-urlencoded)"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                Input
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">{input.length} chars</span>
            </div>
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text or URL to encode..." : "Enter encoded URL component..."}
              className="bg-muted/50 min-h-[300px] font-mono text-foreground"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Result
              </Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-[10px] text-muted-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                  }}
                  disabled={!output}
                >
                  Copy Result
                </Button>
                <span className="text-[10px] text-muted-foreground font-mono">{output.length} chars</span>
              </div>
            </div>
            <Textarea 
              value={output} 
              readOnly
              className="bg-muted/50 min-h-[300px] font-mono text-primary border-primary/20"
            />
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
