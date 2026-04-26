import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { hashFile, sha256, sha512, sha1, md5, sha3_256_func, sha3_512_func, blake3_func } from "@/src/lib/crypto";

export function HashTool() {
  const tool = ALL_TOOLS.find(t => t.id === "hash")!;
  const [algo, setAlgo] = useState("SHA-256");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = async () => {
    let result = "";
    if (algo === "SHA-256") result = await sha256(input);
    else if (algo === "SHA-512") result = await sha512(input);
    else if (algo === "SHA-1") result = await sha1(input);
    else if (algo === "MD5") result = await md5(input);
    else if (algo === "SHA3-256") result = await sha3_256_func(input);
    else if (algo === "SHA3-512") result = await sha3_512_func(input);
    else if (algo === "BLAKE3") result = await blake3_func(input);
    setOutput(result);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await hashFile(file, algo);
    setOutput(result);
  };

  return (
    <ToolPage tool={tool} output={output} onAction={handleAction} actionLabel={`Calculate ${algo} Hash`}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground font-bold">Algorithm</Label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setAlgo("SHA-256")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'SHA-256' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                SHA-256
              </button>
              <button 
                onClick={() => setAlgo("SHA-512")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'SHA-512' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                SHA-512
              </button>
              <button 
                onClick={() => setAlgo("SHA-1")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'SHA-1' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                SHA-1
              </button>
              <button 
                onClick={() => setAlgo("MD5")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'MD5' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                MD5
              </button>
              <button 
                onClick={() => setAlgo("SHA3-256")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'SHA3-256' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                SHA3-256
              </button>
              <button 
                onClick={() => setAlgo("SHA3-512")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'SHA3-512' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                SHA3-512
              </button>
              <button 
                onClick={() => setAlgo("BLAKE3")}
                className={`flex-1 min-w-[80px] px-3 py-2 rounded-md border text-xs font-medium transition-all ${algo === 'BLAKE3' ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:border-foreground hover:bg-muted'}`}
              >
                BLAKE3
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-bold">File Hash</Label>
            <Input type="file" onChange={handleFileChange} className="bg-muted/50 text-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-bold">Input Text</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="bg-muted/50 min-h-[120px] font-mono text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
