import React, { useState, useMemo } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck, Key, Lock, AlertTriangle, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import * as jose from "jose";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export function JWTVerifier() {
  const tool = ALL_TOOLS.find(t => t.id === "jwt-verifier")!;
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [secretEncoding, setSecretEncoding] = useState("utf8");
  const [isVerifyExpanded, setIsVerifyExpanded] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ status: 'none' | 'valid' | 'invalid' | 'error', message?: string }>({ status: 'none' });

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT format (expected 3 parts)");
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      return { header, payload, parts };
    } catch (e: any) {
      return { error: e.message };
    }
  }, [token]);

  const verifySignature = async () => {
    if (!decoded || !('parts' in decoded)) return;
    
    try {
      const alg = decoded.header.alg;
      
      if (alg.startsWith('HS')) {
        let key: Uint8Array;
        if (secretEncoding === "utf8") {
          key = new TextEncoder().encode(secret);
        } else if (secretEncoding === "base64") {
          key = jose.base64url.decode(secret);
        } else {
          // hex
          const matches = secret.match(/[0-9a-f]{2}/gi);
          key = new Uint8Array(matches?.map(h => parseInt(h, 16)) || []);
        }

        try {
          await jose.jwtVerify(token, key, { algorithms: [alg] });
          setVerifyResult({ status: 'valid' });
        } catch (e: any) {
          setVerifyResult({ status: 'invalid' });
        }
      } else if (alg.startsWith('RS') || alg.startsWith('ES')) {
        try {
          const publicKey = await jose.importSPKI(secret, alg);
          await jose.jwtVerify(token, publicKey, { algorithms: [alg] });
          setVerifyResult({ status: 'valid' });
        } catch (e: any) {
          setVerifyResult({ status: 'invalid', message: e.message });
        }
      } else {
        setVerifyResult({ status: 'error', message: `Unsupported algorithm: ${alg}` });
      }
    } catch (e: any) {
      setVerifyResult({ status: 'error', message: e.message });
    }
  };

  const getPartOfToken = (partIndex: number) => {
    if (!decoded || !('parts' in decoded)) return null;
    return decoded.parts[partIndex];
  };

  const isExpired = () => {
    if (!decoded || !('payload' in decoded) || !decoded.payload.exp) return false;
    return decoded.payload.exp * 1000 < Date.now();
  };

  const isNotBefore = () => {
    if (!decoded || !('payload' in decoded) || !decoded.payload.nbf) return false;
    return decoded.payload.nbf * 1000 > Date.now();
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts * 1000);
    return date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ToolPage tool={tool}>
      <div className="space-y-8 pb-12">
        {/* Security Warning */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
          <p className="text-[10px] text-orange-500/80 font-medium">
            <span className="font-bold">SECURITY WARNING:</span> Never paste production JWT tokens or secrets here. Use test tokens only. All processing happens locally in your browser.
          </p>
        </div>

        {/* JWT Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              JWT Token
            </Label>
            {decoded && !('error' in decoded) && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {decoded.header.alg}
                </div>
                {verifyResult.status === 'valid' ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Signature Verified
                  </div>
                ) : verifyResult.status === 'invalid' ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                    <ShieldAlert className="w-3 h-3" />
                    Invalid Signature
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                    <ShieldAlert className="w-3 h-3" />
                    Unverified
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative group">
            {/* Color-coded parts display */}
            {token && decoded && !('error' in decoded) && (
              <div className="absolute inset-0 p-4 font-mono text-sm pointer-events-none whitespace-pre-wrap break-all overflow-hidden opacity-50">
                <span className="text-indigo-500 break-all">{getPartOfToken(0)}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-blue-500 break-all">{getPartOfToken(1)}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-pink-500 break-all">{getPartOfToken(2)}</span>
              </div>
            )}
            <textarea
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setVerifyResult({ status: 'none' });
              }}
              placeholder="Paste your JWT token here..."
              className={`w-full min-h-[160px] p-4 bg-muted/30 border-2 rounded-xl font-mono text-sm leading-relaxed transition-all focus:outline-none resize-none custom-scrollbar ${token && decoded && !('error' in decoded) ? 'text-transparent caret-foreground' : 'text-foreground'}`}
              spellCheck={false}
            />
          </div>
          {decoded && 'error' in decoded && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-1">
              <AlertTriangle className="w-3 h-3" />
              {decoded.error}
            </p>
          )}
        </div>

        {/* Decoded Cards */}
        {decoded && !('error' in decoded) && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
            {/* Header */}
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="py-3 px-4 bg-indigo-500/5 border-b border-indigo-500/10">
                <CardTitle className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Header</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-muted/10">
                <pre className="font-mono text-[13px] text-foreground leading-relaxed">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="py-3 px-4 bg-blue-500/5 border-b border-blue-500/10 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-blue-500 uppercase tracking-widest">Payload</CardTitle>
                <div className="flex gap-2">
                  {isExpired() && (
                    <span className="text-[9px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">Expired</span>
                  )}
                  {isNotBefore() && (
                    <span className="text-[9px] font-bold bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase">Not Before</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 bg-muted/10">
                <div className="space-y-4">
                  <pre className="font-mono text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                  
                  {/* Human readable dates if claims exist */}
                  <div className="pt-4 border-t border-border/50 grid gap-2">
                    {decoded.payload.exp && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground uppercase font-bold tracking-tight">Exp (Expiry)</span>
                        <span className={`font-medium ${isExpired() ? 'text-red-500' : 'text-foreground'}`}>{formatDate(decoded.payload.exp)}</span>
                      </div>
                    )}
                    {decoded.payload.iat && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground uppercase font-bold tracking-tight">Iat (Issued At)</span>
                        <span className="text-foreground font-medium">{formatDate(decoded.payload.iat)}</span>
                      </div>
                    )}
                    {decoded.payload.nbf && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground uppercase font-bold tracking-tight">Nbf (Not Before)</span>
                        <span className={`font-medium ${isNotBefore() ? 'text-yellow-500' : 'text-foreground'}`}>{formatDate(decoded.payload.nbf)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verification Panel */}
        <Card className="bg-card border-border overflow-hidden">
          <button 
            onClick={() => setIsVerifyExpanded(!isVerifyExpanded)}
            className="w-full p-4 bg-muted/5 border-b border-border flex items-center justify-between hover:bg-muted/10 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock className="w-4 h-4 text-primary" />
              Signature Verification
            </div>
            {isVerifyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isVerifyExpanded && (
            <CardContent className="p-6 space-y-6 animate-in fade-in duration-300">
              <div className="grid gap-6">
                {/* Dynamic UI based on Alg */}
                {decoded && !('error' in decoded) ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground font-bold uppercase tracking-widest">Algorithm Detected:</span>
                      <code className="bg-primary/10 text-primary px-2 py-1 rounded font-bold font-mono">{decoded.header.alg}</code>
                    </div>

                    {decoded.header.alg?.startsWith('HS') ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground font-bold">HMAC Secret</Label>
                            <Tabs value={secretEncoding} onValueChange={setSecretEncoding} className="h-7">
                              <TabsList className="bg-muted/50 border border-border h-7">
                                <TabsTrigger value="utf8" className="text-[10px] px-2">UTF-8</TabsTrigger>
                                <TabsTrigger value="base64" className="text-[10px] px-2">Base64</TabsTrigger>
                                <TabsTrigger value="hex" className="text-[10px] px-2">Hex</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </div>
                          <div className="relative">
                            <Input 
                              type={showSecret ? "text" : "password"}
                              value={secret}
                              onChange={(e) => setSecret(e.target.value)}
                              placeholder="Enter your secret key..."
                              className="bg-muted/30 border-border pr-10"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowSecret(!showSecret)}
                              className="absolute top-1 right-1 h-7 w-7 p-0 flex items-center justify-center hover:bg-muted"
                            >
                              {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label className="text-foreground font-bold">Public Key (PEM format)</Label>
                        <textarea 
                          value={secret}
                          onChange={(e) => setSecret(e.target.value)}
                          placeholder="-----BEGIN PUBLIC KEY-----..."
                          className="w-full min-h-[120px] bg-muted/30 border-border border-2 rounded-xl p-3 font-mono text-xs focus:ring-1 focus:ring-primary/30 outline-none"
                        />
                      </div>
                    )}

                    <div className="pt-2">
                      <Button 
                        size="lg" 
                        onClick={verifySignature} 
                        className="w-full font-bold h-11"
                        disabled={!secret || !token}
                      >
                        Verify Signature
                      </Button>
                    </div>

                    {verifyResult.status !== 'none' && (
                      <div className={`p-4 rounded-lg flex items-start gap-4 animate-in zoom-in-95 duration-200 ${
                        verifyResult.status === 'valid' ? 'bg-green-500/10 border border-green-500/20' : 
                        verifyResult.status === 'invalid' ? 'bg-red-500/10 border border-red-500/20' : 
                        'bg-orange-500/10 border border-orange-500/20'
                      }`}>
                        {verifyResult.status === 'valid' ? (
                          <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className={`font-bold ${verifyResult.status === 'valid' ? 'text-green-500' : 'text-red-500'}`}>
                            {verifyResult.status === 'valid' ? 'Signature is valid — token is authentic' : 
                             verifyResult.status === 'invalid' ? 'Signature is invalid — token may be tampered' : 
                             'Verification failed'}
                          </p>
                          {verifyResult.message && <p className="text-xs opacity-70 italic">{verifyResult.message}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground italic text-sm">
                    Paste a JWT token above to configure verification.
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </ToolPage>
  );
}
