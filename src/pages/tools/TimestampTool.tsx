import React, { useState, useEffect, useCallback } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Clock, RefreshCw, Copy, Check } from "lucide-react";
import { useToast } from "@/src/components/ui/toast";

export function TimestampTool() {
  const tool = ALL_TOOLS.find(t => t.id === "timestamp")!;
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());
  const [input, setInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update "now" every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parseInput = useCallback(() => {
    if (!input) return null;
    
    // Try parsing as number
    if (/^\d+$/.test(input)) {
      const num = parseInt(input);
      // Guess seconds vs milliseconds
      if (num < 10000000000) {
        return new Date(num * 1000); // Seconds
      }
      return new Date(num); // Milliseconds
    }
    
    // Try parsing as date string
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }, [input]);

  const activeDate = parseInput() || now;

  // Format date for datetime-local input (YYYY-MM-DDThh:mm)
  const formatForPicker = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}`;
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setInput(date.toISOString());
    }
  };

  const results = [
    { label: "Unix (Seconds)", value: Math.floor(activeDate.getTime() / 1000).toString(), id: "seconds" },
    { label: "Unix (Milliseconds)", value: activeDate.getTime().toString(), id: "ms" },
    { label: "ISO 8601", value: activeDate.toISOString(), id: "iso" },
    { label: "UTC String", value: activeDate.toUTCString(), id: "utc" },
    { label: "Local Date String", value: activeDate.toLocaleDateString() + " " + activeDate.toLocaleTimeString(), id: "local" },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    toast("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <ToolPage tool={tool}>
      <div className="space-y-8">
        {/* Real-time Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/50 border-border p-6 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-2 font-bold">
              <Clock className="w-3 h-3" />
              Current Unix Timestamp
            </div>
            <div className="text-3xl font-black text-foreground font-mono">
              {Math.floor(now.getTime() / 1000)}
            </div>
          </Card>
          <Card className="bg-muted/50 border-border p-6 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-2 font-bold">
              <Clock className="w-3 h-3" />
              Current ISO 8601
            </div>
            <div className="text-xl font-bold text-foreground font-mono break-all text-center">
              {now.toISOString()}
            </div>
          </Card>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold text-lg">Manual Input</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setInput("")}
                className="h-8 text-xs bg-muted/50 text-foreground"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Reset to Now
              </Button>
            </div>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter seconds, milliseconds, ISO string..."
              className="bg-muted/50 text-lg py-6 font-mono text-foreground"
            />
            <p className="text-xs text-muted-foreground italic">
              Supports Unix epoch (s/ms) and ISO date strings.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-foreground font-bold text-lg">Visual Selection</Label>
            <div className="relative group">
              <Input
                type="datetime-local"
                value={formatForPicker(activeDate)}
                onChange={handlePickerChange}
                className="bg-muted/50 text-lg py-6 font-mono cursor-pointer transition-all hover:border-primary/50 text-foreground"
              />
              <div className="absolute inset-0 pointer-events-none group-hover:bg-primary/5 rounded-lg transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground italic">
              Use the calendar to pick a specific date and time visually.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-foreground font-bold uppercase tracking-widest text-xs">Conversion Results</h3>
          <div className="space-y-3">
            {results.map((res) => (
              <div key={res.id} className="group relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-muted/40 border border-border hover:border-primary/50 transition-all gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-black leading-none">
                      {res.label}
                    </Label>
                    <div className="text-sm md:text-base font-mono text-foreground select-all break-all">
                      {res.value}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(res.value, res.id)}
                    className="shrink-0 hover:bg-muted"
                  >
                    {copiedField === res.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
