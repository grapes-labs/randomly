import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Download, Key, FileJson, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/toast";

export function RSATool() {
  const tool = ALL_TOOLS.find(t => t.id === "rsa")!;
  const { toast } = useToast();
  const [bitLength, setBitLength] = useState<2048 | 4096>(2048);
  const [keys, setKeys] = useState<{
    publicPem: string, 
    privatePem: string,
    publicJwk: string,
    privateJwk: string
  } | null>(null);
  const [generating, setGenerating] = useState(false);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: bitLength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );

      const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      
      const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
      const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

      const formatPem = (label: string, buffer: ArrayBuffer) => {
        const base64 = arrayBufferToBase64(buffer);
        const lines = base64.match(/.{1,64}/g)?.join("\n") || base64;
        return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
      };

      setKeys({
        publicPem: formatPem("PUBLIC KEY", publicKeyBuffer),
        privatePem: formatPem("PRIVATE KEY", privateKeyBuffer),
        publicJwk: JSON.stringify(publicJwk, null, 2),
        privateJwk: JSON.stringify(privateJwk, null, 2)
      });

      toast("Keys Generated");
    } catch (e) {
      toast("Generation Failed", "error");
    } finally {
      setGenerating(false);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPage tool={tool} onAction={handleGenerate} actionLabel={generating ? "Generating..." : "Generate Pair"}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-foreground font-bold">Key Size</Label>
          <div className="flex gap-2">
            <button 
              onClick={() => setBitLength(2048)}
              className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-all ${bitLength === 2048 ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:bg-muted hover:border-foreground'}`}
            >
              2048-bit
            </button>
            <button 
              onClick={() => setBitLength(4096)}
              className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-all ${bitLength === 4096 ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-muted/50 border-input text-muted-foreground hover:bg-muted hover:border-foreground'}`}
            >
              4096-bit
            </button>
          </div>
        </div>

        {keys && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto bg-muted/50 text-foreground" 
                onClick={() => downloadFile(`${keys.publicPem}\n\n${keys.privatePem}`, "rsa_bundle.pem")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Both (.pem)
              </Button>
            </div>

            <Tabs defaultValue="pem" className="w-full">
              <TabsList className="bg-muted/50 border border-border w-full flex">
                <TabsTrigger value="pem" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  PEM Format
                </TabsTrigger>
                <TabsTrigger value="jwk" className="flex-1">
                  <FileJson className="w-4 h-4 mr-2" />
                  JWK Format
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pem" className="space-y-6 mt-4">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-bold text-xs uppercase tracking-widest">Public Key (SPKI)</Label>
                      <Button variant="ghost" size="sm" onClick={() => downloadFile(keys.publicPem, "public_key.pem")} className="text-muted-foreground hover:text-foreground">
                        <Download className="w-3 h-3 mr-2" />
                        .pem
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted/60 rounded-lg border border-border/50 text-[10px] font-mono text-foreground overflow-auto max-h-[150px]">
                      {keys.publicPem}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-bold text-xs uppercase tracking-widest text-red-500 dark:text-red-400">Private Key (PKCS8)</Label>
                      <Button variant="ghost" size="sm" onClick={() => downloadFile(keys.privatePem, "private_key.pem")} className="text-muted-foreground hover:text-foreground">
                        <Download className="w-3 h-3 mr-2" />
                        .pem
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted/60 rounded-lg border border-border/50 text-[10px] font-mono text-foreground overflow-auto max-h-[150px]">
                      {keys.privatePem}
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="jwk" className="space-y-6 mt-4">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-bold text-xs uppercase tracking-widest">Public JWK</Label>
                      <Button variant="ghost" size="sm" onClick={() => downloadFile(keys.publicJwk, "public_key.json")} className="text-muted-foreground hover:text-foreground">
                        <Download className="w-3 h-3 mr-2" />
                        .json
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted/60 rounded-lg border border-border/50 text-[10px] font-mono text-foreground overflow-auto max-h-[150px]">
                      {keys.publicJwk}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-bold text-xs uppercase tracking-widest text-red-500 dark:text-red-400">Private JWK</Label>
                      <Button variant="ghost" size="sm" onClick={() => downloadFile(keys.privateJwk, "private_key.json")} className="text-muted-foreground hover:text-foreground">
                        <Download className="w-3 h-3 mr-2" />
                        .json
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted/60 rounded-lg border border-border/50 text-[10px] font-mono text-foreground overflow-auto max-h-[150px]">
                      {keys.privateJwk}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </ToolPage>
  );
}
