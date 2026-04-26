import React, { useState, useEffect } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/toast";
import { ArrowLeftRight, Binary, Hash, Copy, Check } from "lucide-react";

export function BinaryHexTool() {
  const tool = ALL_TOOLS.find(t => t.id === "binary-hex")!;
  const { toast } = useToast();
  const [mode, setMode] = useState<"bin2hex" | "hex2bin">("bin2hex");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convert();
    setCopied(false);
  }, [input, mode]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const convert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "bin2hex") {
        // Specifically look for invalid characters
        const invalidChars = Array.from(new Set(input.replace(/[\s01]/g, "").split("")));
        if (invalidChars.length > 0) {
          throw new Error(`Invalid characters in binary: ${invalidChars.join(", ")}. Only 0s and 1s allowed.`);
        }

        const cleanBinary = input.replace(/\s+/g, "");
        if (cleanBinary.length === 0) {
          setOutput("");
          return;
        }

        // Pad binary to multiple of 4 for clean hex conversion
        const paddedBinary = cleanBinary.padStart(Math.ceil(cleanBinary.length / 4) * 4, '0');
        
        let hex = "";
        for (let i = 0; i < paddedBinary.length; i += 4) {
          const chunk = paddedBinary.substring(i, i + 4);
          hex += parseInt(chunk, 2).toString(16).toUpperCase();
        }
        
        // Add spaces every 2 chars for readability if needed
        setOutput(hex.match(/.{1,2}/g)?.join(" ") || hex);
      } else {
        // Hex to Binary
        // Specifically look for invalid characters
        const invalidChars = Array.from(new Set(input.replace(/[\s:0-9A-Fa-f]/g, "").split("")));
        if (invalidChars.length > 0) {
          throw new Error(`Invalid characters in hex: ${invalidChars.join(", ")}. Only 0-9 and A-F allowed.`);
        }

        const cleanHex = input.replace(/[\s\:]/g, "");
        if (cleanHex.length === 0) {
          setOutput("");
          return;
        }

        let bin = "";
        for (let i = 0; i < cleanHex.length; i++) {
          const char = cleanHex[i];
          bin += parseInt(char, 16).toString(2).padStart(4, '0');
        }

        // Add spaces every 4 or 8 bits for readability
        setOutput(bin.match(/.{1,8}/g)?.join(" ") || bin);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error");
      setOutput("");
    }
  };

  return (
    <ToolPage tool={tool}>
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="bin2hex" className="flex items-center gap-2">
              <Binary className="w-4 h-4" />
              Binary to Hex
            </TabsTrigger>
            <TabsTrigger value="hex2bin" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hex to Binary
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label className="text-foreground font-bold flex items-center gap-2">
              {mode === "bin2hex" ? <Binary className="w-4 h-4 text-primary" /> : <Hash className="w-4 h-4 text-primary" />}
              {mode === "bin2hex" ? "Binary Input" : "Hexadecimal Input"}
            </Label>
            <Textarea
              placeholder={mode === "bin2hex" ? "e.g. 01001000 01101001" : "e.g. 48 69"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`bg-muted/50 min-h-[200px] font-mono transition-all text-foreground ${error ? 'border-red-500/50' : 'focus:border-primary/50'}`}
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mode === "bin2hex" ? <Hash className="w-4 h-4 text-primary" /> : <Binary className="w-4 h-4 text-primary" />}
                {mode === "bin2hex" ? "Hexadecimal Result" : "Binary Result"}
              </div>
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 px-2 text-xs hover:bg-muted"
                >
                  {copied ? (
                    <Check className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </Label>
            <div className="relative group">
              <Textarea
                readOnly
                value={output}
                placeholder="Result will appear here..."
                className="bg-muted/30 min-h-[200px] font-mono border-border text-foreground"
              />
              <div className="absolute inset-0 pointer-events-none bg-primary/0 group-hover:bg-primary/[0.02] transition-colors rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
          <ArrowLeftRight className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="font-bold text-foreground mb-1">Quick Reference</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 font-mono">
              <span>0 (0000)</span>
              <span>4 (0100)</span>
              <span>8 (1000)</span>
              <span>C (1100)</span>
              <span>1 (0001)</span>
              <span>5 (0101)</span>
              <span>9 (1001)</span>
              <span>D (1101)</span>
              <span>2 (0010)</span>
              <span>6 (0110)</span>
              <span>A (1010)</span>
              <span>E (1110)</span>
              <span>3 (0011)</span>
              <span>7 (0111)</span>
              <span>B (1011)</span>
              <span>F (1111)</span>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
