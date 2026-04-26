import React, { useState, useMemo } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Clock, Info, CheckCircle2, XCircle, Calendar, Copy, ChevronDown } from "lucide-react";
import cronstrue from "cronstrue";
import cronParser from "cron-parser";
import { useToast } from "@/src/components/ui/toast";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

const EXAMPLES = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at 9am", value: "0 9 * * *" },
  { label: "Every weekday at 9am", value: "0 9 * * MON-FRI" },
  { label: "Every Sunday at midnight", value: "0 0 * * SUN" },
  { label: "First of the month", value: "0 0 1 * *" },
];

export function CronTester() {
  const tool = ALL_TOOLS.find(t => t.id === "cron-tester")!;
  const [expression, setExpression] = useState("0 9 * * MON-FRI");
  const [format, setFormat] = useState("standard");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const { toast } = useToast();

  const cronData = useMemo(() => {
    if (!expression.trim()) return { error: "Expression is empty", description: "", nextRuns: [] };
    
    try {
      const description = cronstrue.toString(expression, {
        use24HourTimeFormat: true,
        throwExceptionOnParseError: true
      });

      const options = {
        currentDate: new Date(),
        tz: timezone
      };

      const interval = cronParser.parse(expression, options);
      const nextRuns = [];
      for (let i = 0; i < 10; i++) {
        nextRuns.push(interval.next().toDate());
      }

      return { error: null, description, nextRuns };
    } catch (e: any) {
      return { error: e.message || "Invalid cron expression", description: "", nextRuns: [] };
    }
  }, [expression, timezone]);

  const copyNextRuns = () => {
    const text = JSON.stringify(cronData.nextRuns, null, 2);
    navigator.clipboard.writeText(text);
    toast("Copied next run times as JSON");
  };

  const fields = expression.trim().split(/\s+/);

  return (
    <ToolPage tool={tool}>
      <div className="space-y-8">
        {/* Input area */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Label className="text-foreground font-bold">Cron Expression</Label>
              <Tabs value={format} onValueChange={setFormat} className="w-[140px]">
                <TabsList className="grid w-full grid-cols-3 h-8 bg-muted/50 border border-border">
                  <TabsTrigger value="standard" className="text-[10px]">5</TabsTrigger>
                  <TabsTrigger value="extended" className="text-[10px]">6</TabsTrigger>
                  <TabsTrigger value="quartz" className="text-[10px]">7</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative w-full sm:w-[220px]">
              <select 
                value={expression} 
                onChange={(e) => setExpression(e.target.value)}
                className="w-full h-8 bg-muted/50 border border-border rounded-md px-3 text-sm appearance-none outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="" disabled>Load Example...</option>
                {EXAMPLES.map(ex => (
                  <option key={ex.value} value={ex.value}>{ex.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <Input 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
              className={`h-14 text-xl font-mono bg-muted/30 border-2 transition-all ${cronData.error ? 'border-red-500/50 focus-visible:ring-red-500/20' : 'border-border focus-visible:border-primary/50'}`}
            />
            {cronData.error && (
              <div className="mt-2 flex items-center gap-2 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                <XCircle className="w-3" />
                {cronData.error}
              </div>
            )}
          </div>
        </div>

        {/* Human Readable */}
        {cronData.description && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">In plain English</Label>
            <p className="text-2xl font-bold text-foreground">
              {cronData.description}
            </p>
          </div>
        )}

        {/* Field Breakdown */}
        <div className="space-y-4">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Field Breakdown</Label>
          <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex gap-px bg-border border border-border rounded-lg min-w-max">
              {['minute', 'hour', 'day', 'month', 'weekday', 'year'].slice(0, Math.max(5, fields.length)).map((label, idx) => (
                <div key={idx} className="bg-muted/50 p-4 flex-1 text-center group transition-colors hover:bg-muted">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold mb-2 group-hover:text-primary transition-colors">{label}</div>
                  <div className="font-mono text-lg text-primary">{fields[idx] || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          {/* Next Runs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Run Times</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-[180px]">
                  <select 
                    value={timezone} 
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-7 text-[10px] bg-muted/40 border-none rounded font-medium px-2 appearance-none outline-none focus:ring-1 focus:ring-primary/30"
                  >
                    <option value="UTC">UTC</option>
                    <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Local Time</option>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                  <ChevronDown className="absolute right-1 top-1.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
                <Button variant="ghost" size="sm" onClick={copyNextRuns} className="h-7 text-[10px] font-bold px-2">
                  <Copy className="w-3 h-3 mr-1.5" />
                  JSON
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {cronData.nextRuns.length > 0 ? (
                cronData.nextRuns.map((date, idx) => {
                  const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
                  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={idx} className="group p-3 bg-muted/10 border border-border rounded-lg flex items-center justify-between transition-all hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-foreground">
                          {date.toLocaleString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZone: timezone
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {diff === 0 ? 'today' : diff === 1 ? 'tomorrow' : `in ${diff} days`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-muted/10 border-2 border-dashed border-border rounded-lg">
                  <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground italic">No upcoming executions. Check your expression.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="space-y-4">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cron Quick Reference</Label>
            <div className="grid gap-3">
              {[
                { token: "*", desc: "Any value (every)" },
                { token: ",", desc: "Value list separator (e.g. 1,3,5)" },
                { token: "-", desc: "Range of values (e.g. 1-5)" },
                { token: "/", desc: "Value increments (e.g. */15)" },
                { token: "L", desc: "Last day of the month/week" },
                { token: "W", desc: "Nearest weekday" },
                { token: "#", desc: "Nth day of the month (e.g. 1#2 is 2nd Mon)" }
              ].map(tip => (
                <div key={tip.token} className="p-3 bg-card border border-border border-l-4 border-l-primary/30 rounded flex items-center justify-between text-xs transition-transform hover:scale-[1.01]">
                  <code className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{tip.token}</code>
                  <span className="text-muted-foreground text-right">{tip.desc}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-muted/20 border border-border rounded-lg flex items-start gap-3">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground leading-none">Pro Tip</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Cron expressions depend on the system's timezone. 
                  Always verify if your server runs in UTC or local time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
