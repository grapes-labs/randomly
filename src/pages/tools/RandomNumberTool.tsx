import React, { useState } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export function RandomNumberTool() {
  const tool = ALL_TOOLS.find(t => t.id === "random-number")!;
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [allowDecimals, setAllowDecimals] = useState<boolean>(false);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string>("");

  const handleGenerate = () => {
    setError("");

    if (min >= max && !allowDecimals) {
      setError("Minimum value must be strictly less than maximum for integer generation (unless generating only 1 possible value).");
      return;
    }

    if (min > max) {
      setError("Minimum value cannot be greater than maximum value.");
      return;
    }

    // Check if unique generation is possible
    if (!allowDuplicates && !allowDecimals) {
      const distinctCount = (max - min) + 1;
      if (count > distinctCount) {
        setError(`Cannot generate ${count} unique integers between ${min} and ${max}.`);
        return;
      }
    }

    let results: number[] = [];

    if (!allowDuplicates) {
      const generated = new Set<string>();
      let attempts = 0;
      const maxAttempts = count * 100; // failsafe

      while (generated.size < count && attempts < maxAttempts) {
        let rand = Math.random() * (max - min) + min;

        if (!allowDecimals) {
          // If not decimal, we need include max.
          // Math.floor(Math.random() * (max - min + 1) + min)
          rand = Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
          // For decimals, we can round to a few places to make uniqueness check realistic,
          // but Math.random() is almost always unique.
        }

        const randStr = allowDecimals ? rand.toString() : rand.toFixed(0);

        if (!generated.has(randStr)) {
          generated.add(randStr);
          results.push(allowDecimals ? rand : parseInt(randStr, 10));
        }
        attempts++;
      }

      if (generated.size < count) {
        setError("Could not generate enough unique numbers. Try increasing the range.");
        return;
      }
    } else {
      for (let i = 0; i < count; i++) {
        let rand = Math.random() * (max - min) + min;
        if (!allowDecimals) {
          rand = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        results.push(rand);
      }
    }

    setOutput(results.join("\n"));
  };

  return (
    <ToolPage tool={tool} output={output} onAction={handleGenerate}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label className="text-foreground font-bold">Minimum Value</Label>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(parseFloat(e.target.value) || 0)}
            className="bg-muted/50 text-foreground"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-foreground font-bold">Maximum Value</Label>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(parseFloat(e.target.value) || 0)}
            className="bg-muted/50 text-foreground"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-foreground font-bold">Quantity (1-10000)</Label>
          <Input
            type="number"
            min={1}
            max={10000}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="bg-muted/50 text-foreground"
          />
        </div>

        <div className="space-y-4 flex flex-col justify-end">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allow-decimals"
              checked={allowDecimals}
              onChange={(e) => setAllowDecimals(e.target.checked)}
              className="accent-primary h-4 w-4"
            />
            <Label htmlFor="allow-decimals" className="text-foreground">Allow Decimals</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allow-duplicates"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="accent-primary h-4 w-4"
            />
            <Label htmlFor="allow-duplicates" className="text-foreground">Allow Duplicates</Label>
          </div>
        </div>

        {error && (
          <div className="col-span-2 text-destructive text-sm font-semibold">
            {error}
          </div>
        )}
      </div>
    </ToolPage>
  );
}
