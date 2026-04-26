import React, { useState, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Download, Share2, AlertCircle, Image as ImageIcon, FileCode } from "lucide-react";

export function QRCodeTool() {
  const tool = ALL_TOOLS.find(t => t.id === "qrcode")!;
  const [value, setValue] = useState("https://google.com");
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("L");
  const [renderType, setRenderType] = useState<"canvas" | "svg">("canvas");
  const qrRef = useRef<HTMLDivElement>(null);

  const isEmpty = !value.trim();

  const downloadQRCode = (format: "png" | "svg") => {
    if (isEmpty) return;
    
    if (format === "png") {
      const canvas = qrRef.current?.querySelector("canvas");
      if (!canvas) {
        // If current render is SVG, we can't easily get canvas unless we draw SVG to canvas
        // For convenience, we'll suggest switching to Canvas mode if they want PNG
        alert("Please switch to 'Canvas' mode to download PNG.");
        return;
      }
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = url;
      link.click();
    } else {
      const svg = qrRef.current?.querySelector("svg");
      if (!svg) {
        alert("Please switch to 'SVG' mode to download SVG.");
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode-${Date.now()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground font-bold">Content (URL or Text)</Label>
            <Input 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com"
              className={`bg-muted/50 text-foreground transition-all ${isEmpty ? 'border-red-500/50 focus-visible:ring-red-500/20' : ''}`}
            />
            {isEmpty && (
              <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />
                Please enter some content to generate a QR code.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-bold">Foreground Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-muted/50 border-border cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-muted/50 font-mono text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground font-bold">Background Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-muted/50 border-border cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-muted/50 font-mono text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-bold">Error Correction Level</Label>
            <Tabs value={level} onValueChange={(v: any) => setLevel(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
                <TabsTrigger value="L">L (7%)</TabsTrigger>
                <TabsTrigger value="M">M (15%)</TabsTrigger>
                <TabsTrigger value="Q">Q (25%)</TabsTrigger>
                <TabsTrigger value="H">H (30%)</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-[10px] text-muted-foreground mt-1">
              Higher levels allow the QR code to be readable even if partially covered or damaged.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-bold">Size ({size}px)</Label>
            <Input 
              type="range" 
              min={128} 
              max={512} 
              step={16}
              value={size} 
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-bold">Render Mode</Label>
            <Tabs value={renderType} onValueChange={(v: any) => setRenderType(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
                <TabsTrigger value="canvas" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Canvas
                </TabsTrigger>
                <TabsTrigger value="svg" className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  SVG (Vector)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div 
            ref={qrRef}
            className="p-8 bg-white rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]"
          >
            {renderType === "canvas" ? (
              <QRCodeCanvas
                value={value || " "}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                includeMargin={false}
              />
            ) : (
              <QRCodeSVG
                value={value || " "}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                includeMargin={false}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <Button 
              onClick={() => downloadQRCode("png")} 
              className="flex-1"
              disabled={isEmpty}
              variant={renderType === "canvas" ? "default" : "outline"}
            >
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>
            <Button 
              onClick={() => downloadQRCode("svg")} 
              className="flex-1"
              disabled={isEmpty}
              variant={renderType === "svg" ? "default" : "outline"}
            >
              <Download className="w-4 h-4 mr-2" />
              SVG
            </Button>
            <Button 
              variant="outline" 
              className="col-span-2"
              onClick={() => {
                if (navigator.share) {
                  const canvas = qrRef.current?.querySelector("canvas");
                  if (canvas) {
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const file = new File([blob], "qrcode.png", { type: "image/png" });
                        navigator.share({
                          files: [file],
                          title: 'QR Code',
                          text: 'Shared QR Code from DevToolbox',
                        }).catch(() => {});
                      }
                    });
                  } else {
                    alert("Sharing currently only supports the Canvas render mode.");
                  }
                } else {
                  alert("Sharing not supported in this browser.");
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
