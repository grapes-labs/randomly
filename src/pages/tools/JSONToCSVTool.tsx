import React, { useState, useEffect } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { FileJson, Settings2, Table, Download } from "lucide-react";
import { useToast } from "@/src/components/ui/toast";

export function JSONToCSVTool() {
  const tool = ALL_TOOLS.find((t) => t.id === "json-csv")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const { toast } = useToast();

  useEffect(() => {
    convert();
  }, [input, delimiter]);

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      let data = JSON.parse(input);
      
      // Handle non-array inputs (single object)
      if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
          data = [data];
        } else {
          throw new Error("JSON must be an array of objects or a single object.");
        }
      }

      if (data.length === 0) {
        setOutput("");
        return;
      }

      // Collect all keys from all objects (to handle sparse data)
      const keysSet = new Set<string>();
      data.forEach((obj: any) => {
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => keysSet.add(key));
        }
      });
      const keys = Array.from(keysSet);

      if (keys.length === 0) {
        throw new Error("No properties found in JSON objects.");
      }

      const csvRows = [];
      
      // Header row
      csvRows.push(keys.join(delimiter));

      // Data rows
      data.forEach((obj: any) => {
        const values = keys.map(key => {
          let val = obj[key] ?? "";
          
          // Stringify objects/arrays
          if (typeof val === 'object') {
            val = JSON.stringify(val);
          }
          
          const escaped = String(val).replace(/"/g, '""');
          if (escaped.includes(delimiter) || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r')) {
            return `"${escaped}"`;
          }
          return escaped;
        });
        csvRows.push(values.join(delimiter));
      });

      setOutput(csvRows.join("\n"));
    } catch (e) {
      setOutput("Error: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast("File downloaded");
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <FileJson className="w-4 h-4 text-primary" />
                JSON Input
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">{input.length} chars</span>
              </div>
            </div>
            <Textarea
              placeholder="Paste your JSON array or object here...&#10;[&#10;  { &quot;name&quot;: &quot;John&quot;, &quot;age&quot;: 30 },&#10;  { &quot;name&quot;: &quot;Jane&quot;, &quot;age&quot;: 25 }&#10;]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm bg-muted/50 text-foreground"
            />
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  Parser Options
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Delimiter</Label>
                    <div className="flex gap-2">
                      {[" , ", " ; ", " \\t "].map((d) => {
                        const val = d.trim() === "\\t" ? "\t" : d.trim();
                        return (
                          <Button
                            key={d}
                            variant={delimiter === val ? "default" : "outline"}
                            size="sm"
                            className="flex-1 h-8 text-xs bg-muted/50 text-foreground hover:bg-muted"
                            onClick={() => setDelimiter(val)}
                          >
                            {d.trim() === "\t" ? "Tab" : d.trim() === "," ? "Comma" : "Semicolon"}
                          </Button>
                        );
                      })}
                      <Input
                        placeholder="Other"
                        value={delimiter === "\t" ? "\\t" : delimiter}
                        onChange={(e) => setDelimiter(e.target.value === "\\t" ? "\t" : e.target.value)}
                        className="w-16 h-8 text-xs bg-muted/50 text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-bold flex items-center gap-2">
                  <Table className="w-4 h-4 text-primary" />
                  CSV Output
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={handleDownload}
                    disabled={!output || output.startsWith("Error:")}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download .csv
                  </Button>
                  <span className="text-[10px] text-muted-foreground font-mono">{output.length} chars</span>
                </div>
              </div>
              <Textarea
                readOnly
                value={output}
                className="min-h-[280px] font-mono text-sm bg-muted/50 text-primary border-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-xl border border-border overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
