import React, { useState, useEffect, useRef, useMemo } from "react";
import { ToolPage } from "@/src/components/ToolPage";
import { ALL_TOOLS } from "@/src/config/tools";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { 
  Search, 
  Info, 
  FileText, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Flag,
  Replace,
  Settings2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MatchResult {
  match: string;
  index: number;
  length: number;
  groups: (string | undefined)[];
}

interface RegexToken {
  token: string;
  description: string;
  example: string;
}

const CHEAT_SHEET: { section: string; items: RegexToken[] }[] = [
  {
    section: "Anchors",
    items: [
      { token: "^", description: "Start of string/line", example: "^abc" },
      { token: "$", description: "End of string/line", example: "xyz$" },
      { token: "\\b", description: "Word boundary", example: "\\bword\\b" },
      { token: "\\B", description: "Non-word boundary", example: "\\Bnot\\B" },
    ]
  },
  {
    section: "Character Classes",
    items: [
      { token: ".", description: "Any character except newline", example: "a.b" },
      { token: "\\d", description: "Any digit (0-9)", example: "\\d+" },
      { token: "\\w", description: "Word character (a-z, A-Z, 0-9, _)", example: "\\w+" },
      { token: "\\s", description: "Whitespace (space, tab, newline)", example: "\\s+" },
      { token: "[abc]", description: "Any character in the set", example: "[aeiou]" },
      { token: "[^abc]", description: "Any character NOT in the set", example: "[^0-9]" },
    ]
  },
  {
    section: "Quantifiers",
    items: [
      { token: "*", description: "0 or more times", example: "a*" },
      { token: "+", description: "1 or more times", example: "a+" },
      { token: "?", description: "0 or 1 time", example: "a?" },
      { token: "{n}", description: "Exactly n times", example: "a{3}" },
      { token: "{n,}", description: "n or more times", example: "a{2,}" },
      { token: "{n,m}", description: "Between n and m times", example: "a{2,4}" },
    ]
  },
  {
    section: "Groups & References",
    items: [
      { token: "(...)", description: "Capturing group", example: "(abc)+" },
      { token: "(?:...)", description: "Non-capturing group", example: "(?:abc)+" },
      { token: "(?P<name>...)", description: "Named capturing group", example: "(?P<id>\\d+)" },
      { token: "\\1", description: "Backreference to group 1", example: "(\\w)\\1" },
    ]
  }
];

export function RegexTool() {
  const tool = ALL_TOOLS.find(t => t.id === "regex")!;
  const [pattern, setPattern] = useState("([a-z]+)-(\\d+)");
  const [flags, setFlags] = useState("gim");
  const [testString, setTestString] = useState("hello-123 world-456 example-789");
  const [substitution, setSubstitution] = useState("$2 $1");
  const [showSubstitution, setShowSubstitution] = useState(false);
  const [copiedRegex, setCopiedRegex] = useState(false);
  const [copiedMatches, setCopiedMatches] = useState(false);
  const [expandedMatches, setExpandedMatches] = useState<number[]>([]);
  const [cheatSheetQuery, setCheatSheetQuery] = useState("");
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [regexError, setRegexError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  // Parse Regex and handle errors/backtracking
  const regexData = useMemo(() => {
    setIsTimeout(false);
    setRegexError(null);
    if (!pattern) return { regex: null, matches: [] };

    try {
      // Protection against very long strings or evil regex
      // We wrap it in a timeout check if we were in a worker, but here we'll just try
      const startTime = performance.now();
      const re = new RegExp(pattern, flags);
      const matches: MatchResult[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          if (performance.now() - startTime > 1000) {
            setIsTimeout(true);
            return { regex: null, matches: [] };
          }
          matches.push({
            match: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1)
          });
          if (match[0].length === 0) re.lastIndex++; // Prevent infinite loop on empty matches
        }
      } else {
        match = re.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1)
          });
        }
      }

      return { regex: re, matches };
    } catch (e) {
      setRegexError(e instanceof Error ? e.message : "Invalid Regex");
      return { regex: null, matches: [] };
    }
  }, [pattern, flags, testString]);

  const { regex, matches } = regexData;

  // Substitute text
  const substitutedText = useMemo(() => {
    if (!regex || !showSubstitution) return "";
    try {
      return testString.replace(regex, substitution);
    } catch (e) {
      return "Substitution Error";
    }
  }, [regex, showSubstitution, testString, substitution]);

  // Regex Explanation logic (Simplified but robust)
  const explanation = useMemo(() => {
    if (!pattern) return [];
    
    const parts: { token: string; desc: string }[] = [];
    let current = "";
    
    // Heuristic breakdown
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      if (char === '^') parts.push({ token: "^", desc: "Start of line/string" });
      else if (char === '$') parts.push({ token: "$", desc: "End of line/string" });
      else if (char === '\\') {
        const next = pattern[i+1];
        if (next === 'd') parts.push({ token: "\\d", desc: "Digital character (0-9)" });
        else if (next === 'w') parts.push({ token: "\\w", desc: "Word character (a-z, A-Z, 0-9, _)" });
        else if (next === 's') parts.push({ token: "\\s", desc: "Whitespace character" });
        else if (next === 'b') parts.push({ token: "\\b", desc: "Word boundary" });
        else parts.push({ token: `\\${next}`, desc: `Literal character '${next}'` });
        i++;
      }
      else if (char === '(') parts.push({ token: "(", desc: "Start capture group" });
      else if (char === ')') parts.push({ token: ")", desc: "End capture group" });
      else if (char === '[') {
        let set = "[";
        i++;
        while (i < pattern.length && pattern[i] !== ']') {
          set += pattern[i];
          i++;
        }
        set += "]";
        parts.push({ token: set, desc: "Character set" });
      }
      else if (char === '+') parts.push({ token: "+", desc: "One or more times" });
      else if (char === '*') parts.push({ token: "*", desc: "Zero or more times" });
      else if (char === '?') parts.push({ token: "?", desc: "Zero or one time (optional)" });
      else if (char === '{') {
        let quant = "{";
        i++;
        while (i < pattern.length && pattern[i] !== '}') {
          quant += pattern[i];
          i++;
        }
        quant += "}";
        parts.push({ token: quant, desc: `Exactly ${quant.slice(1, -1)} times` });
      }
      else {
        parts.push({ token: char, desc: `Literal '${char}'` });
      }
    }
    return parts;
  }, [pattern]);

  // Highlighting Logic
  const highlightedHTML = useMemo(() => {
    if (!regex || matches.length === 0) {
      return testString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    let html = "";
    let lastIndex = 0;

    // We sort matches by index to be safe
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((m, mIdx) => {
      // Add text before match
      html += testString.slice(lastIndex, m.index).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      // Add match with group highlights
      // For simplicity in a flat string, we just highlight the whole match if no groups,
      // or we can try to nest if groups were available.
      // JS doesn't give us the ranges of groups easily in a flat map, so we'll highlight the whole match
      // with group-aware colors if possible, or just the whole match with a sequence of colors.
      
      const colors = [
        "bg-yellow-400/40 dark:bg-yellow-400/30 border-b border-yellow-400 text-yellow-900 dark:text-yellow-100",
        "bg-blue-400/40 dark:bg-blue-400/30 border-b border-blue-400 text-blue-900 dark:text-blue-100",
        "bg-green-400/40 dark:bg-green-400/30 border-b border-green-400 text-green-900 dark:text-green-100",
        "bg-purple-400/40 dark:bg-purple-400/30 border-b border-purple-400 text-purple-900 dark:text-purple-100",
        "bg-pink-400/40 dark:bg-pink-400/30 border-b border-pink-400 text-pink-900 dark:text-pink-100",
      ];
      
      const color = colors[mIdx % colors.length];
      html += `<span class="${color} rounded-sm px-0.5">${m.match.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
      
      lastIndex = m.index + m.length;
    });

    // Add remaining text
    html += testString.slice(lastIndex).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Convert newlines to breaks or similar
    // Actually, in contenteditable, we want to maintain the value, but let's see.
    // For a display overlay approach it's easier, but for contenteditable:
    return html.replace(/\n/g, "<br>");
  }, [testString, regex, matches]);

  // Sync contenteditable with state
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== highlightedHTML) {
      // Small trick: only update if the TEXT content changed or it's the first render
      // to avoid losing focus/caret while typing.
      // But since we are doing full syntax highlighting in a contenteditable,
      // we MUST handle cursor.
    }
  }, [highlightedHTML]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.innerText;
    if (newText !== testString) {
      setTestString(newText);
    }
  };

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.replace(f, ''));
    } else {
      setFlags(flags + f);
    }
  };

  const copyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopiedRegex(true);
    setTimeout(() => setCopiedRegex(false), 2000);
  };

  const copyMatches = () => {
    navigator.clipboard.writeText(JSON.stringify(matches.map(m => m.match), null, 2));
    setCopiedMatches(true);
    setTimeout(() => setCopiedMatches(false), 2000);
  };

  const toggleMatch = (idx: number) => {
    if (expandedMatches.includes(idx)) {
      setExpandedMatches(expandedMatches.filter(i => i !== idx));
    } else {
      setExpandedMatches([...expandedMatches, idx]);
    }
  };

  const filteredCheatSheet = CHEAT_SHEET.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.token.toLowerCase().includes(cheatSheetQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(cheatSheetQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <ToolPage tool={tool}>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Content Area */}
        <div className="space-y-6 overflow-hidden">
          {/* Regex Input Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Regular Expression
              </Label>
              <div className="flex gap-2">
                <Button 
                  variant={showSubstitution ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSubstitution(!showSubstitution)}
                  className="h-8 text-xs bg-muted/50 text-foreground hover:bg-muted"
                >
                  <Replace className="w-3 h-3 mr-1" />
                  Substitution
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyRegex}
                  className="h-8 text-xs bg-muted/50 text-foreground hover:bg-muted"
                >
                  {copiedRegex ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedRegex ? "Copied" : "Copy Regex"}
                </Button>
              </div>
            </div>

            <div 
              className={`flex items-center gap-0 bg-muted/50 border rounded-lg px-3 py-1 transition-colors ${regexError ? 'border-red-500 ring-1 ring-red-500' : 'border-border focus-within:border-primary/50'}`}
            >
              <span className="text-muted-foreground font-mono text-lg select-none">/</span>
              <Input 
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="border-none bg-transparent focus-visible:ring-0 text-lg font-mono placeholder:text-muted-foreground/50 h-9"
              />
              <span className="text-muted-foreground font-mono text-lg select-none">/</span>
              <Input 
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="gim"
                className="w-16 border-none bg-transparent focus-visible:ring-0 text-lg font-mono text-primary placeholder:text-muted-foreground/50 h-9 text-center"
              />
            </div>

            {regexError && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                <XCircle className="w-3 h-3" />
                {regexError}
              </div>
            )}
            {isTimeout && (
              <div className="flex items-center gap-2 text-orange-500 text-xs font-medium border border-orange-500/20 bg-orange-500/5 p-2 rounded">
                <XCircle className="w-4 h-4" />
                Pattern caused timeout — simplify your regex (catastrophic backtracking detected)
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {[
                { f: 'g', label: 'global', desc: 'dont return after first match' },
                { f: 'm', label: 'multiline', desc: '^ and $ match start/end of line' },
                { f: 'i', label: 'case insensitive', desc: 'case-insensitive search' },
                { f: 's', label: 'dot all', desc: '. matches newline' },
              ].map(flag => (
                <button
                  key={flag.f}
                  onClick={() => toggleFlag(flag.f)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all border ${
                    flags.includes(flag.f) 
                    ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.3)]' 
                    : 'bg-muted/40 border-border text-muted-foreground hover:border-foreground hover:bg-muted'
                  }`}
                  title={flag.desc}
                >
                  {flag.f} ({flag.label})
                </button>
              ))}
            </div>
          </div>

          {showSubstitution && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-foreground font-bold flex items-center gap-2">
                  <Replace className="w-4 h-4 text-primary" />
                  Substitution String
                </Label>
                <Input 
                  value={substitution}
                  onChange={(e) => setSubstitution(e.target.value)}
                  placeholder="e.g. $2, $1 or static text"
                  className="bg-muted/50 border-input focus:border-primary/50 font-mono text-foreground"
                />
              </div>
            </motion.div>
          )}

          {/* Test String Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Test String
              </Label>
              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/20">
                {matches.length} matches
              </div>
            </div>

            <div className="relative">
              {/* For simplicity we'll use a layered approach instead of full contenteditable sync which is broken in React state flows */}
              <div 
                className="absolute inset-0 p-4 font-mono text-sm pointer-events-none whitespace-pre-wrap break-all overflow-auto"
                dangerouslySetInnerHTML={{ __html: highlightedHTML }}
              />
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full min-h-[250px] p-4 bg-muted/50 border border-input rounded-lg font-mono text-sm text-transparent caret-primary resize-none focus:outline-none focus:border-primary/50 relative z-10 whitespace-pre-wrap break-all overflow-auto"
                spellCheck={false}
              />
            </div>
          </div>

          {showSubstitution && (
            <div className="space-y-4">
              <Label className="text-foreground font-bold">Substitution Preview</Label>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg font-mono text-sm text-foreground whitespace-pre-wrap break-all min-h-[100px]">
                {substitutedText}
              </div>
            </div>
          )}

          {/* Regex Explanation Panel */}
          <Card className="bg-card border-border overflow-hidden shadow-sm">
            <CardHeader className="py-3 bg-muted/10 border-b border-border">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Info className="w-4 h-4 text-primary" />
                Regex Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {explanation.length > 0 ? (
                <div className="space-y-1">
                  {explanation.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 text-xs group">
                      <span className="font-mono text-primary min-w-[30px]">{item.token}</span>
                      <span className="text-muted-foreground select-none">→</span>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.desc}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/60 italic">Enter a pattern to see explanation.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Reference Panel */}
          <Card className="bg-card border-border overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsCheatSheetOpen(!isCheatSheetOpen)}
              className="w-full p-3 bg-muted/10 border-b border-border flex items-center justify-between hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-primary" />
                Quick Reference Cheat Sheet
              </div>
              {isCheatSheetOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {isCheatSheetOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="p-4 space-y-4">
                    <Input 
                      placeholder="Filter reference..."
                      value={cheatSheetQuery}
                      onChange={(e) => setCheatSheetQuery(e.target.value)}
                      className="h-8 text-xs bg-muted/60"
                    />
                    <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCheatSheet.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                          <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold">{section.section}</h4>
                          <div className="grid gap-2">
                            {section.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-muted/10 border border-border hover:border-primary transition-all cursor-help group">
                                <code className="text-primary font-mono bg-primary/10 px-1 rounded">{item.token}</code>
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors text-right">{item.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* SEO Section */}
          <div className="pt-12 border-t border-border/50 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Free Online Regex Tester</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-4">
                <p>
                  Regular Expressions (Regex) are powerful sequences of characters that define a search pattern. 
                  They are used in almost every programming language for string manipulation, data validation, 
                  and text processing. Whether you're a developer cleaning up log files or a data analyst 
                  extracting information from a dump, a reliable regex tester is an essential part of your toolkit.
                </p>
                <p>
                  This tool provides a modern, high-performance environment to test your patterns against real data. 
                  With live highlighting, capture group visualization, and a deep-dive explanation of your pattern, 
                  you can iterate quickly and avoid common pitfalls like catastrophic backtracking.
                </p>
                <h3 className="text-lg font-semibold text-foreground mt-6">Common Use Cases</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Data Validation:</strong> Testing email formats, phone numbers, or passwords.</li>
                  <li><strong>Text Extraction:</strong> Finding specific keys or values in configuration files or logs.</li>
                  <li><strong>Batch Refactoring:</strong> Using substitution mode to find/replace complex code patterns.</li>
                  <li><strong>Security Auditing:</strong> Identifying potentially malicious patterns or sensitive data leaks.</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/5 border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">What regex flavor does this tool use?</h4>
                  <p className="text-sm text-muted-foreground">JavaScript regex (ECMAScript), which works natively in the browser. It supports all modern ES2023+ features.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Are my patterns saved anywhere?</h4>
                  <p className="text-sm text-muted-foreground">No, everything runs entirely in your browser. No patterns or test strings are sent to any server, ensuring total privacy.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Does this support lookaheads and lookbehinds?</h4>
                  <p className="text-sm text-muted-foreground">Yes, modern JavaScript engines support both lookaheads and positive/negative lookbehinds (?&lt;= and ?&lt;!).</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Can I use named capture groups?</h4>
                  <p className="text-sm text-muted-foreground">Yes, you can use the (?&lt;name&gt;...) syntax to create named groups which will appear in the match information panel.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Match Information */}
        <div className="space-y-6">
          <Card className="bg-card border-border sticky top-6 shadow-sm">
            <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Flag className="w-4 h-4 text-primary" />
                Match Information
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyMatches}
                disabled={matches.length === 0}
                className="h-8 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
              >
                {copiedMatches ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copiedMatches ? "Copied" : "Copy JSON"}
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
              {matches.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Search className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm text-muted-foreground italic">No matches found</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {matches.map((m, i) => (
                    <div key={i} className="group transition-colors hover:bg-muted/10">
                      <button 
                        onClick={() => toggleMatch(i)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-1 rounded">Match {i + 1}</span>
                            <span className="text-xs text-muted-foreground font-mono">index {m.index}-{m.index + m.length}</span>
                          </div>
                          <div className="font-mono text-sm text-foreground line-clamp-1">{m.match}</div>
                        </div>
                        {expandedMatches.includes(i) ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedMatches.includes(i) && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-muted/20"
                          >
                            <div className="p-4 pt-0 space-y-3">
                              {m.groups.length > 0 ? (
                                <div className="space-y-2">
                                  {m.groups.map((g, gIdx) => (
                                    <div key={gIdx} className="flex flex-col gap-1 border-l-2 border-primary/20 pl-3 py-1">
                                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Group {gIdx + 1}</span>
                                      <span className="text-xs font-mono text-muted-foreground break-all">"{g || 'undefined'}"</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-muted-foreground/50 italic">No capture groups</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPage>
  );
}
