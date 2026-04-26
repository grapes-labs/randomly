import React, { useState, useCallback, useEffect } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { 
  RefreshCw, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Palette, 
  Eye, 
  Layout, 
  Zap,
  Code,
  FileJson
} from "lucide-react";
import chroma from "chroma-js";
import { useToast } from "@/src/components/ui/toast";
import { Input } from "@/src/components/ui/input";

interface ColorItem {
  hex: string;
  locked: boolean;
}

type HarmonyType = "random" | "complementary" | "analogous" | "triadic" | "split-complementary" | "monochromatic";

export function ColorPaletteTool() {
  const tool = ALL_TOOLS.find(t => t.id === "color-palette")!;
  const { toast } = useToast();
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [harmony, setHarmony] = useState<HarmonyType>("random");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePalette = useCallback((type: HarmonyType = harmony, explicitBase: string = baseColor) => {
    let newColors: string[] = [];
    
    if (type === "random") {
      newColors = Array.from({ length: 5 }, () => chroma.random().hex());
    } else {
      const base = chroma(explicitBase);
      switch (type) {
        case "complementary":
          newColors = [
            base.hex(),
            base.set('hsl.h', '+180').hex(),
            base.brighten(0.5).hex(),
            base.darken(0.5).hex(),
            base.desaturate(0.5).hex()
          ];
          break;
        case "analogous":
          newColors = [
            base.set('hsl.h', '-30').hex(),
            base.set('hsl.h', '-15').hex(),
            base.hex(),
            base.set('hsl.h', '+15').hex(),
            base.set('hsl.h', '+30').hex()
          ];
          break;
        case "triadic":
          newColors = [
            base.hex(),
            base.set('hsl.h', '+120').hex(),
            base.set('hsl.h', '+240').hex(),
            base.brighten(0.5).hex(),
            base.darken(0.5).hex()
          ];
          break;
        case "split-complementary":
          newColors = [
            base.hex(),
            base.set('hsl.h', '+150').hex(),
            base.set('hsl.h', '+210').hex(),
            base.darken(0.3).hex(),
            base.brighten(0.3).hex()
          ];
          break;
        case "monochromatic":
          newColors = [
            base.brighten(1.5).hex(),
            base.brighten(0.8).hex(),
            base.hex(),
            base.darken(0.8).hex(),
            base.darken(1.5).hex()
          ];
          break;
      }
    }

    setColors(prev => {
      if (prev.length === 0) return newColors.map(hex => ({ hex, locked: false }));
      return prev.map((item, idx) => {
        if (item.locked) return item;
        return { hex: newColors[idx] || chroma.random().hex(), locked: false };
      });
    });
  }, [harmony, baseColor]);

  // Initial palette
  useEffect(() => {
    generatePalette("random");
  }, []);

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((item, idx) => 
      idx === index ? { ...item, locked: !item.locked } : item
    ));
  };

  const copyToClipboard = (text: string, index: number | null = null, message: string = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    if (index !== null) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
    toast(message);
  };

  const copyPaletteAsJSON = () => {
    const json = JSON.stringify(colors.map(c => c.hex), null, 2);
    copyToClipboard(json, null, "Palette copied as JSON!");
  };

  const copyPaletteAsCSS = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
    copyToClipboard(css, null, "Palette copied as CSS Variables!");
  };

  const isDark = (color: string) => chroma(color).luminance() < 0.5;

  return (
    <ToolPage tool={tool}>
      <div className="space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <Label className="text-foreground font-bold">Generation Strategy</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["random", "complementary", "analogous", "triadic", "split-complementary", "monochromatic"] as HarmonyType[]).map((type) => (
                <Button
                  key={type}
                  variant={harmony === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setHarmony(type);
                    generatePalette(type);
                  }}
                  className="capitalize h-8 text-xs px-3"
                >
                  {type.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 min-w-[200px]">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <Label className="text-foreground font-bold">Base Color</Label>
            </div>
            <div className="flex gap-2">
              <Input 
                type="color"
                value={baseColor}
                onChange={(e) => {
                  setBaseColor(e.target.value);
                  if (harmony !== "random") generatePalette(harmony, e.target.value);
                }}
                className="w-12 h-10 p-1 bg-transparent border-border rounded cursor-pointer"
              />
              <Input 
                value={baseColor}
                onChange={(e) => {
                  setBaseColor(e.target.value);
                  if (chroma.valid(e.target.value) && harmony !== "random") {
                    generatePalette(harmony, e.target.value);
                  }
                }}
                className="flex-1 font-mono text-sm uppercase h-10 bg-muted/30"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button 
              size="lg" 
              onClick={() => generatePalette()} 
              className="w-full md:w-auto h-10 font-bold gap-2 px-6"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </div>

        {/* Palette Display */}
        <div className="grid grid-cols-1 sm:grid-cols-5 h-[400px] rounded-3xl overflow-hidden shadow-2xl transition-all hover:shadow-primary/5">
          {colors.map((color, idx) => (
            <div 
              key={idx}
              className="relative group flex flex-col items-center justify-end pb-8 gap-4 transition-all duration-300 hover:flex-[1.2]"
              style={{ backgroundColor: color.hex }}
            >
              <div className="absolute top-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLock(idx)}
                  className={`rounded-full shadow-lg ${isDark(color.hex) ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}`}
                >
                  {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </div>

              <div className={`flex flex-col items-center gap-2 ${isDark(color.hex) ? 'text-white' : 'text-black'}`}>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-lg font-bold uppercase tracking-wider">{color.hex}</span>
                  <button 
                    onClick={() => copyToClipboard(color.hex, idx)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 opacity-70" />}
                  </button>
                </div>
                
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <button 
                    onClick={() => copyToClipboard(chroma(color.hex).css(), null, "RGB copied!")}
                    className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-black/10 hover:bg-black/20"
                  >
                    RGB
                  </button>
                  <button 
                    onClick={() => copyToClipboard(`hsl(${chroma(color.hex).hsl().map((v, i) => i === 0 ? Math.round(v) : Math.round(v * 100) + '%').join(', ')})`, null, "HSL copied!")}
                    className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-black/10 hover:bg-black/20"
                  >
                    HSL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions & Mockup */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                <Label className="text-xl font-bold text-foreground tracking-tight">UI Visualization</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyPaletteAsJSON} className="h-8 text-[10px] uppercase font-bold gap-2">
                  <FileJson className="w-3.5 h-3.5" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={copyPaletteAsCSS} className="h-8 text-[10px] uppercase font-bold gap-2">
                  <Code className="w-3.5 h-3.5" />
                  CSS
                </Button>
              </div>
            </div>

            {/* Mockup */}
            <Card className="border-border bg-muted/10 overflow-hidden">
              <CardContent className="p-8 space-y-8" style={{ backgroundColor: colors[0]?.hex + '10' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: colors[0]?.hex }} />
                    <div className="space-y-1">
                      <div className="h-3 w-24 rounded bg-foreground/10" />
                      <div className="h-2 w-16 rounded bg-foreground/5" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-foreground/5 border border-foreground/10" />
                    <div className="h-8 w-8 rounded-lg bg-foreground/5 border border-foreground/10" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight" style={{ color: colors[0]?.hex }}>
                      Experience the Palette
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      See how your primary, secondary, and accent colors harmonize within a realistic interface layout.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-none shadow-sm p-4 space-y-3" style={{ backgroundColor: colors[1]?.hex }}>
                      <div className={`h-2 w-12 rounded ${isDark(colors[1]?.hex || '#000') ? 'bg-white/20' : 'bg-black/10'}`} />
                      <div className={`h-8 w-full rounded-lg ${isDark(colors[1]?.hex || '#000') ? 'bg-white/10' : 'bg-black/5'}`} />
                      <div className={`h-2 w-full rounded ${isDark(colors[1]?.hex || '#000') ? 'bg-white/10' : 'bg-black/5'}`} />
                    </Card>
                    <Card className="border-none shadow-sm p-4 space-y-3" style={{ backgroundColor: colors[2]?.hex }}>
                      <div className={`h-2 w-12 rounded ${isDark(colors[2]?.hex || '#000') ? 'bg-white/20' : 'bg-black/10'}`} />
                      <div className="flex gap-2">
                        <div className={`h-8 w-8 rounded-full ${isDark(colors[2]?.hex || '#000') ? 'bg-white/10' : 'bg-black/5'}`} />
                        <div className={`h-8 w-8 rounded-full ${isDark(colors[2]?.hex || '#000') ? 'bg-white/10' : 'bg-black/5'}`} />
                      </div>
                      <div className={`h-2 w-full rounded ${isDark(colors[2]?.hex || '#000') ? 'bg-white/10' : 'bg-black/5'}`} />
                    </Card>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="rounded-full px-8 shadow-lg transition-transform hover:scale-105 active:scale-95" 
                      style={{ backgroundColor: colors[0]?.hex, color: isDark(colors[0]?.hex || '#000') ? '#fff' : '#000' }}
                    >
                      Primary Action
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full px-8 border-2 transition-transform hover:scale-105 active:scale-95" 
                      style={{ borderColor: colors[3]?.hex, color: colors[3]?.hex }}
                    >
                      Outline
                    </Button>
                    <Button 
                      className="rounded-xl px-6 shadow-sm" 
                      style={{ backgroundColor: colors[4]?.hex, color: isDark(colors[4]?.hex || '#000') ? '#fff' : '#000' }}
                    >
                      Accent
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tips */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <Label className="text-xl font-bold text-foreground tracking-tight">Design Tips</Label>
            </div>
            <div className="space-y-4">
              {[
                { 
                  title: "Complementary", 
                  desc: "Colors from opposite sides of the wheel. High contrast, high energy." 
                },
                { 
                  title: "Analogous", 
                  desc: "Colors next to each other. Pleasing, low-contrast, harmonious." 
                },
                { 
                  title: "Triadic", 
                  desc: "Three colors equally spaced. Vibrant even when desaturated." 
                },
                { 
                  title: "Monochromatic", 
                  desc: "Different shades and tints of a single hue. Elegant and professional." 
                },
                { 
                  title: "The 60-30-10 Rule", 
                  desc: "Use 60% dominant color, 30% secondary, and 10% for accents." 
                }
              ].map((tip, idx) => (
                <div key={idx} className="p-4 bg-card border border-border rounded-xl space-y-1 transition-all hover:border-primary/30">
                  <h4 className="text-sm font-bold text-primary">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
