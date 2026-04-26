import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { aesEncrypt, aesDecrypt } from "@/src/lib/crypto";
import { Eye, EyeOff } from "lucide-react";

export function AESTool() {
  const tool = ALL_TOOLS.find(t => t.id === "aes")!;
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = async () => {
    if (!password) {
      alert("Please provide a password!");
      return;
    }
    try {
      if (mode === "encode") {
        const result = await aesEncrypt(input, password);
        setOutput(result);
      } else {
        const result = await aesDecrypt(input, password);
        setOutput(result);
      }
    } catch (e) {
      setOutput("Error: Decryption failed. Incorrect password or invalid format.");
    }
  };

  return (
    <ToolPage 
      tool={tool} 
      output={output} 
      onAction={handleAction} 
      actionLabel={mode === "encode" ? "Encrypt Text" : "Decrypt Text"}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="encode">Encrypt</TabsTrigger>
            <TabsTrigger value="decode">Decrypt</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label className="text-foreground font-bold">Password / Secret Key</Label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/50 pr-10 text-foreground"
              placeholder="Strong password required..."
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-bold">Input</Label>
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "Plain text to encrypt..." : "Base64 encrypted string to decrypt..."}
            className="bg-muted/50 min-h-[120px] font-mono text-foreground"
          />
        </div>
      </div>
    </ToolPage>
  );
}
