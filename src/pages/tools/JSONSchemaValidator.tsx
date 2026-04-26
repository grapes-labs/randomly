import React, { useState, useEffect, useCallback } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Code, Braces } from "lucide-react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useToast } from "@/src/components/ui/toast";

const EXAMPLE_SCHEMA = {
  "type": "object",
  "properties": {
    "user": {
      "type": "object",
      "properties": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "roles": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["id", "name", "email"]
    }
  },
  "required": ["user"]
};

const EXAMPLE_DATA = {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["admin", "editor"]
  }
};

export function JSONSchemaValidator() {
  const tool = ALL_TOOLS.find(t => t.id === "json-schema-validator")!;
  const { toast } = useToast();
  const [schema, setSchema] = useState(JSON.stringify(EXAMPLE_SCHEMA, null, 2));
  const [data, setData] = useState(JSON.stringify(EXAMPLE_DATA, null, 2));
  const [version, setVersion] = useState("draft-07");
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);
  const [valid, setValid] = useState<boolean | null>(null);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);

  const validate = useCallback(() => {
    setIsValidating(true);
    setSyntaxError(null);
    setErrors([]);
    setValid(null);

    // Debounce simulation - though Ajv is very fast
    setTimeout(() => {
      try {
        let parsedSchema, parsedData;
        try {
          parsedSchema = JSON.parse(schema);
        } catch (e) {
          setSyntaxError("Invalid JSON syntax in Schema");
          setIsValidating(false);
          return;
        }

        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          setSyntaxError("Invalid JSON syntax in Data");
          setIsValidating(false);
          return;
        }

        const ajv = new Ajv({ 
          allErrors: true, 
          strict: false,
          // Support for different drafts can be more complex, 
          // Ajv supports many by default or with plugins, 
          // here we just use the default instance which is mostly Draft 7 compatible.
        });
        addFormats(ajv);

        const validateFn = ajv.compile(parsedSchema);
        const isValid = validateFn(parsedData);

        setValid(!!isValid);
        if (!isValid) {
          setErrors(validateFn.errors || []);
        }
      } catch (e: any) {
        setSyntaxError(`Validation Engine Error: ${e.message}`);
      } finally {
        setIsValidating(false);
      }
    }, 300);
  }, [schema, data, version]);

  useEffect(() => {
    validate();
  }, [schema, data, version, validate]);

  const formatJSON = (target: "schema" | "data") => {
    try {
      if (target === "schema") {
        setSchema(JSON.stringify(JSON.parse(schema), null, 2));
      } else {
        setData(JSON.stringify(JSON.parse(data), null, 2));
      }
      toast("Formatted!");
    } catch (e) {
      toast("Invalid JSON - cannot format");
    }
  };

  const loadExample = () => {
    setSchema(JSON.stringify(EXAMPLE_SCHEMA, null, 2));
    setData(JSON.stringify(EXAMPLE_DATA, null, 2));
    toast("Example loaded");
  };

  return (
    <ToolPage tool={tool}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label className="text-foreground font-bold">Schema Version</Label>
            <Tabs value={version} onValueChange={setVersion} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
                <TabsTrigger value="draft-07">Draft-07</TabsTrigger>
                <TabsTrigger value="draft-2020-12">Draft-2020-12</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" size="sm" onClick={loadExample} className="h-8 text-xs">
            Load Example
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Braces className="w-4 h-4 text-primary" />
                JSON Schema
              </Label>
              <Button variant="ghost" size="sm" onClick={() => formatJSON("schema")} className="h-6 text-[10px] uppercase font-bold text-muted-foreground">
                Format
              </Button>
            </div>
            <div className="group relative">
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="w-full min-h-[400px] bg-muted/20 border border-border rounded-xl p-4 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none custom-scrollbar"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                JSON Data
              </Label>
              <Button variant="ghost" size="sm" onClick={() => formatJSON("data")} className="h-6 text-[10px] uppercase font-bold text-muted-foreground">
                Format
              </Button>
            </div>
            <div className="group relative">
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full min-h-[400px] bg-muted/20 border border-border rounded-xl p-4 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none custom-scrollbar"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-foreground font-bold">Validation Result</Label>
            {isValidating && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Validating...
              </div>
            )}
          </div>

          <Card className={`border-none shadow-sm ${valid === true ? 'bg-green-500/10' : syntaxError || valid === false ? 'bg-red-500/10' : 'bg-muted/30'}`}>
            <CardContent className="p-6">
              {syntaxError ? (
                <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold">Syntax Error</p>
                    <p className="text-sm opacity-90">{syntaxError}</p>
                  </div>
                </div>
              ) : valid === true ? (
                <div className="flex items-start gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold">Valid — your JSON matches the schema</p>
                    <p className="text-sm opacity-90">All constraints satisfied.</p>
                  </div>
                </div>
              ) : valid === false ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                    <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-bold">Invalid — {errors.length} error{errors.length > 1 ? 's' : ''} found</p>
                    </div>
                  </div>
                  <div className="grid gap-2 pl-8">
                    {errors.map((error, idx) => (
                      <div key={idx} className="p-3 bg-red-500/5 border-l-2 border-red-500 rounded-r text-sm">
                        <span className="font-mono text-xs font-bold text-red-500 mr-2 capitalize">{error.instancePath || "$"}</span>
                        <span className="text-foreground/80">{error.message}</span>
                        {error.params && Object.keys(error.params).length > 0 && (
                          <div className="mt-1 opacity-60 text-[10px] font-mono">
                            {JSON.stringify(error.params)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  Adjust schema or data to see validation results.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPage>
  );
}
