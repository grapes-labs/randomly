import React, { useState, useRef, useEffect } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Image as ImageIcon, Download, Code, Palette, Settings2 } from "lucide-react";
import { useToast } from "@/src/components/ui/toast";
import { Input } from "@/src/components/ui/input";

export function SVGToPNGTool() {
  const tool = ALL_TOOLS.find((t) => t.id === "svg-png")!;
  const [input, setInput] = useState("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n  <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n  <path d=\"M8 14s1.5 2 4 2 4-2 4-2\"></path>\n  <line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line>\n  <line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line>\n</svg>");
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [scale, setScale] = useState<number>(2);
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    convert();
  }, [input, scale]);

  const convert = () => {
    setError("");
    if (!input.trim()) {
      setOutputUrl("");
      return;
    }

    try {
      const svgContent = input.trim();
      if (!svgContent.toLowerCase().includes("<svg")) {
        throw new Error("Invalid SVG content");
      }

      const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const urlObj = window.URL || window.webkitURL;
      const blobURL = urlObj.createObjectURL(blob);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasWidth = img.width * scale;
        const canvasHeight = img.height * scale;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        try {
          const pngUrl = canvas.toDataURL("image/png");
          setOutputUrl(pngUrl);
        } catch (err) {
          setError("Drawing to canvas failed. Complex SVGs might need simpler conversion methods.");
        }
        urlObj.revokeObjectURL(blobURL);
      };

      img.onerror = () => {
        setError("Failed to parse SVG. The SVG might be invalid or missing required attributes like width/height.");
        urlObj.revokeObjectURL(blobURL);
      };

      img.src = blobURL;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error parsing SVG");
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "converted-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("Image downloaded");
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                SVG Input
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">{input.length} chars</span>
              </div>
            </div>
            <Textarea
              placeholder="Paste your SVG code here..."
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
                  Conversion Options
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Scale multiplier</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
                        className="w-24 h-8 text-xs bg-muted/50 text-foreground"
                      />
                      <span className="text-xs text-muted-foreground">x size</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  PNG Output
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={handleDownload}
                    disabled={!outputUrl || !!error}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download .png
                  </Button>
                </div>
              </div>

              <div className="min-h-[280px] bg-muted/50 border border-input rounded-md flex items-center justify-center p-4 overflow-auto">
                <canvas ref={canvasRef} className="hidden" />
                {error ? (
                  <p className="text-destructive text-sm p-4 text-center">{error}</p>
                ) : outputUrl ? (
                  <img src={outputUrl} alt="Converted PNG preview" className="max-w-full drop-shadow-md rounded checkerboard-bg" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                ) : (
                  <p className="text-muted-foreground text-sm">PNG preview will appear here</p>
                )}
              </div>
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
