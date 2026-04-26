import React, { useState, useEffect } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { FileJson, Settings2, Table } from "lucide-react";

export function CSVToJSONTool() {
  const tool = ALL_TOOLS.find((t) => t.id === "csv-json")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);
  const [prettyPrint, setPrettyPrint] = useState(true);

  useEffect(() => {
    convert();
  }, [input, delimiter, hasHeaders, inferTypes, prettyPrint]);

  const parseCSVLine = (line: string, delim: string) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i+1] === '"') {
            cur += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === delim && !inQuotes) {
            result.push(cur);
            cur = "";
        } else {
            cur += char;
        }
    }
    result.push(cur);
    return result;
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      const lines = input.trim().split(/\r?\n/);
      if (lines.length === 0) return;

      const delim = delimiter || ",";
      const rows = lines.map(line => parseCSVLine(line, delim));

      let result: any[] = [];

      if (hasHeaders && rows.length > 0) {
        const headers = rows[0].map(h => h.trim());
        const dataRows = rows.slice(1);

        result = dataRows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            let val = row[index] !== undefined ? row[index].trim() : "";
            
            if (inferTypes) {
              if (val.toLowerCase() === "true") val = true as any;
              else if (val.toLowerCase() === "false") val = false as any;
              else if (val === "null") val = null as any;
              else if (!isNaN(Number(val)) && val !== "") val = Number(val) as any;
            }
            
            obj[header || `column${index + 1}`] = val;
          });
          return obj;
        });
      } else {
        result = rows.map(row => {
          return row.map(val => {
            val = val.trim();
            if (inferTypes) {
              if (val.toLowerCase() === "true") return true;
              if (val.toLowerCase() === "false") return false;
              if (val === "null") return null;
              if (!isNaN(Number(val)) && val !== "") return Number(val);
            }
            return val;
          });
        });
      }

      setOutput(JSON.stringify(result, null, prettyPrint ? 2 : 0));
    } catch (e) {
      setOutput("Error parsing CSV: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Table className="w-4 h-4 text-primary" />
                CSV Input
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">{input.length} chars</span>
              </div>
            </div>
            <Textarea
              placeholder="Paste your CSV data here...&#10;name,age,city&#10;John,30,New York&#10;Jane,25,London"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm bg-muted/50 text-foreground"
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
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value)}
                        className="w-16 h-8 text-xs bg-muted/50 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="grid gap-1.5 leading-none">
                      <label 
                        htmlFor="headers" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                      >
                        Has Headers
                      </label>
                      <p className="text-xs text-muted-foreground">First row will be used as keys</p>
                    </div>
                    <input 
                      type="checkbox"
                      id="headers" 
                      className="w-4 h-4 rounded border-border bg-muted/50 text-primary accent-primary cursor-pointer"
                      checked={hasHeaders} 
                      onChange={(e) => setHasHeaders(e.target.checked)} 
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="grid gap-1.5 leading-none">
                      <label 
                        htmlFor="infer" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                      >
                        Infer Types
                      </label>
                      <p className="text-xs text-muted-foreground">Auto-convert numbers and booleans</p>
                    </div>
                    <input 
                      type="checkbox"
                      id="infer" 
                      className="w-4 h-4 rounded border-border bg-muted/50 text-primary accent-primary cursor-pointer"
                      checked={inferTypes} 
                      onChange={(e) => setInferTypes(e.target.checked)} 
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="grid gap-1.5 leading-none">
                      <label 
                        htmlFor="pretty" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                      >
                        Pretty Print
                      </label>
                      <p className="text-xs text-muted-foreground">Format JSON for readability</p>
                    </div>
                    <input 
                      type="checkbox"
                      id="pretty" 
                      className="w-4 h-4 rounded border-border bg-muted/50 text-primary accent-primary cursor-pointer"
                      checked={prettyPrint} 
                      onChange={(e) => setPrettyPrint(e.target.checked)} 
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-bold flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-primary" />
                  JSON Output
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono">{output.length} chars</span>
                </div>
              </div>
              <Textarea
                readOnly
                value={output}
                className="min-h-[220px] font-mono text-sm bg-muted/50 text-primary border-primary/20"
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
