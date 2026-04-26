import { 
  ArrowLeftRight,
  Binary, 
  Bug,
  Code, 
  Database,
  FileJson,
  Fingerprint, 
  Hash, 
  Key, 
  Link, 
  Lock, 
  QrCode,
  RotateCcw, 
  Search, 
  Shield, 
  Type,
  Clock,
  Eye,
  Palette
} from "lucide-react";
import { Category } from "@/src/types";

export const CATEGORIES: Category[] = [
  {
    name: "Generators",
    icon: Fingerprint,
    tools: [
      {
        id: "uuid",
        name: "UUID Generator",
        description: "Generate version 4 and 7 UUIDs (Universally Unique Identifiers) in bulk.",
        path: "/tools/uuid",
        category: "Generators",
        icon: Fingerprint,
        seoTitle: "Online UUID Generator (v4 & v7) - Free & Secure",
        seoDescription: "Generate random UUID v4 and time-based UUID v7 instantly. Support for bulk generation, 100% client-side for maximum privacy.",
        keywords: ["online uuid generator", "free uuid v4 generator", "uuid v7 tool", "bulk uuid"],
        techName: "Crypto.randomUUID()",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID"
      },
      {
        id: "nanoid",
        name: "NanoID Generator",
        description: "A tiny, secure, URL-friendly, unique string ID generator with customizable alphabet.",
        path: "/tools/nanoid",
        category: "Generators",
        icon: Hash,
        seoTitle: "NanoID Generator Online - Customizable & Secure",
        seoDescription: "Create secure NanoIDs with custom length and alphabet. Faster and smaller than UUID, generated entirely in your browser.",
        keywords: ["nanoid generator", "online nanoid tool", "custom nanoid", "unique id generator"],
        techName: "nanoid package",
        techUrl: "https://github.com/ai/nanoid"
      },
      {
        id: "ulid",
        name: "ULID Generator",
        description: "Universally Unique Lexicographically Sortable Identifier.",
        path: "/tools/ulid",
        category: "Generators",
        icon: Binary,
        seoTitle: "Online ULID Generator - Sortable Unique IDs",
        seoDescription: "Generate ULIDs for your database. Universally unique, lexicographically sortable, and URL-friendly identifiers.",
        keywords: ["ulid generator", "online ulid tool", "sortable unique id", "free ulid"],
        techName: "ulid package",
        techUrl: "https://github.com/ulid/javascript"
      },
      {
        id: "cuid2",
        name: "CUID2 Generator",
        description: "Next-generation collision-resistant IDs for horizontal scaling.",
        path: "/tools/cuid2",
        category: "Generators",
        icon: Fingerprint,
        seoTitle: "CUID2 Generator Online - Secure Scaling IDs",
        seoDescription: "Generate secure, collision-resistant CUID2 identifiers. Perfect for distributed systems and modern web apps.",
        keywords: ["cuid2 generator", "online cuid tool", "collision resistant id", "scaling ids"],
        techName: "@paralleldrive/cuid2 package",
        techUrl: "https://github.com/paralleldrive/cuid2"
      },
      {
        id: "qrcode",
        name: "QR Code Generator",
        description: "Generate customizable QR codes for text, URLs, and more with color options.",
        path: "/tools/qrcode",
        category: "Generators",
        icon: QrCode,
        seoTitle: "Online QR Code Generator - Free & Customizable",
        seoDescription: "Create high-quality QR codes instantly. Customize colors, error correction levels, and download as PNG or SVG.",
        keywords: ["qr code generator", "online qrcode", "custom qr code", "free qr generator"],
        techName: "qrcode package",
        techUrl: "https://www.npmjs.com/package/qrcode"
      }
    ]
  },
  {
    name: "Testing",
    icon: Bug,
    tools: [
      {
        id: "regex",
        name: "Regex Tester",
        description: "Test and debug JavaScript regular expressions in real-time with highlights and explanations.",
        path: "/tools/regex",
        category: "Testing",
        icon: Search,
        seoTitle: "Free Online Regex Tester - JavaScript Regular Expression Tool",
        seoDescription: "Test, debug, and explain JavaScript regular expressions. Real-time highlighting, capture groups, and substitution support.",
        keywords: ["regex tester", "online regex tool", "javascript regex", "regular expression debugger"],
        techName: "RegExp API",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
      },
      {
        id: "json-schema-validator",
        name: "JSON Schema Validator",
        description: "Validate JSON data against a JSON Schema (Draft 7 or 2020-12) with real-time error reporting.",
        path: "/tools/json-schema-validator",
        category: "Testing",
        icon: Database,
        seoTitle: "Free Online JSON Schema Validator",
        seoDescription: "Validate JSON data against high-level schemas. Supports Draft-07 and Draft-2020-12 with detailed error reporting.",
        keywords: ["json schema validator", "ajv online", "validate json schema", "json schema tester"],
        techName: "Ajv (Another JSON Validator)",
        techUrl: "https://ajv.js.org/"
      },
      {
        id: "cron-tester",
        name: "Cron Expression Tester",
        description: "Test and debug cron expressions with human-readable descriptions and upcoming execution times.",
        path: "/tools/cron-tester",
        category: "Testing",
        icon: Clock,
        seoTitle: "Free Online Cron Expression Tester",
        seoDescription: "Test your crontabs. See a human-friendly description of your cron expression and view a list of next run times.",
        keywords: ["cron tester", "online cron debugger", "crontab generator", "next execution time"],
        techName: "cronstrue & cron-parser",
        techUrl: "https://github.com/bradymholt/cRonstrue"
      },
      {
        id: "jwt-verifier",
        name: "JWT Verifier",
        description: "Decode and cryptographically verify JWT signatures using HS256, RS256, and more.",
        path: "/tools/jwt-verifier",
        category: "Testing",
        icon: Eye,
        seoTitle: "Free Online JWT Verifier & Decoder",
        seoDescription: "Verify the integrity and authenticity of JSON Web Tokens. Supports HMAC, RSA, and ECDSA signature verification.",
        keywords: ["jwt verifier", "verify jwt signature", "online jwt tool", "jwt authenticity"],
        techName: "jose package",
        techUrl: "https://github.com/panva/jose"
      }
    ]
  },
  {
    name: "Converters",
    icon: ArrowLeftRight,
    tools: [
      {
        id: "timestamp",
        name: "Timestamp Converter",
        description: "Convert between Unix timestamps, ISO 8601, and human-readable dates.",
        path: "/tools/timestamp",
        category: "Converters",
        icon: RotateCcw,
        seoTitle: "Online Unix Timestamp Converter - Epoch & ISO 8601 Tool",
        seoDescription: "Easily convert Unix timestamps (seconds & milliseconds) to ISO 8601 and local date formats. 100% private and runs in your browser.",
        keywords: ["unix timestamp converter", "epoch to iso", "iso 8601 converter", "date to timestamp"],
        techName: "JavaScript Date API",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
      },
      {
        id: "binary-hex",
        name: "Binary/Hex Converter",
        description: "Convert directly between binary and hexadecimal representations.",
        path: "/tools/binary-hex",
        category: "Converters",
        icon: ArrowLeftRight,
        seoTitle: "Online Binary to Hex Converter - Hexadecimal to Binary Tool",
        seoDescription: "Convert binary strings to hexadecimal and vice versa with ease. Fast, private, and runs entirely in your browser.",
        keywords: ["binary to hex", "hex to binary", "base2 to base16", "binary converter"],
        techName: "JavaScript Number API",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString"
      },
      {
        id: "csv-json",
        name: "CSV to JSON",
        description: "Convert CSV data to JSON format with customizable delimiter and header options.",
        path: "/tools/csv-json",
        category: "Converters",
        icon: Code,
        seoTitle: "Online CSV to JSON Converter - Free Data Tool",
        seoDescription: "Transform CSV datasets into JSON arrays or objects. Supports custom delimiters, headers, and type inference.",
        keywords: ["csv to json", "online csv converter", "convert csv to json", "csv tool"],
        techName: "Custom client-side CSV parser"
      },
      {
        id: "json-csv",
        name: "JSON to CSV",
        description: "Convert JSON arrays or objects into CSV format with customizable delimiters.",
        path: "/tools/json-csv",
        category: "Converters",
        icon: FileJson,
        seoTitle: "Online JSON to CSV Converter - Free Data Tool",
        seoDescription: "Transform JSON data into CSV format. Supports nested objects, custom delimiters, and quote handling.",
        keywords: ["json to csv", "convert json to csv", "json tool", "data converter"],
        techName: "Custom client-side CSV generator"
      }
    ]
  },
  {
    name: "Encoders / Decoders",
    icon: Code,
    tools: [
      {
        id: "base64",
        name: "Base64 Encoder/Decoder",
        description: "Encode and decode text or files to/from Base64 format.",
        path: "/tools/base64",
        category: "Encoders / Decoders",
        icon: Type,
        seoTitle: "Online Base64 Encoder & Decoder - Free & Secure",
        seoDescription: "Convert text or files to Base64 and back. Support for drag-and-drop and binary data, 100% client-side.",
        keywords: ["online base64 encoder", "base64 decoder", "file to base64", "base64 tool"],
        techName: "atob & btoa APIs",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/atob"
      },
      {
        id: "url",
        name: "URL Encoder/Decoder",
        description: "Safely encode and decode URLs and parameters.",
        path: "/tools/url",
        category: "Encoders / Decoders",
        icon: Link,
        seoTitle: "URL Encoder & Decoder Online - URI Component Tool",
        seoDescription: "Decode or encode URL parameters and components instantly. Fix broken links and clean up query strings.",
        keywords: ["url encoder", "url decoder", "uri encode online", "percent encoding tool"],
        techName: "encodeURIComponent API",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent"
      },
      {
        id: "html",
        name: "HTML Entities",
        description: "Encode and decode HTML entities to prevent XSS and formatting issues.",
        path: "/tools/html",
        category: "Encoders / Decoders",
        icon: Code,
        seoTitle: "Online HTML Entity Encoder & Decoder - Secure Web Dev",
        seoDescription: "Escape and unescape HTML code. Convert special characters to entities and back to prevent rendering issues.",
        keywords: ["html entity encoder", "html decoder", "escape html online", "html tool"],
        techName: "DOMParser API",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/DOMParser"
      },
      {
        id: "hex",
        name: "Hex Encoder/Decoder",
        description: "Convert string text to Hexadecimal and vice versa.",
        path: "/tools/hex",
        category: "Encoders / Decoders",
        icon: Binary,
        seoTitle: "Online Hex Encoder & Decoder - Text to Hex Tool",
        seoDescription: "Fast conversion between plain text and Hexadecimal strings. Useful for debugging binary protocols.",
        keywords: ["hex encoder", "hex decoder", "text to hex online", "hex tool"],
        techName: "TextEncoder API",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder"
      },
      {
        id: "binary",
        name: "Binary Encoder/Decoder",
        description: "Convert text to its binary representation and vice versa.",
        path: "/tools/binary",
        category: "Encoders / Decoders",
        icon: Binary,
        seoTitle: "Online Binary Encoder & Decoder - Text to Binary Tool",
        seoDescription: "Convert text to binary (0s and 1s) and back. Supports UTF-8 encoding, generated entirely in your browser.",
        keywords: ["text to binary", "binary to text", "online binary converter", "binary encoder"],
        techName: "TextEncoder & String.fromCodePoint",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder"
      },
      {
        id: "jwt",
        name: "JWT Decoder",
        description: "Inspect and decode JSON Web Tokens without sending them anywhere.",
        path: "/tools/jwt",
        category: "Encoders / Decoders",
        icon: Shield,
        seoTitle: "JWT Decoder Online - Privacy First Token Inspector",
        seoDescription: "Decode JWT headers and payloads instantly. Your tokens never leave your browser, ensuring maximum security.",
        keywords: ["jwt decoder", "online jwt tool", "decode json web token", "jwt inspector"],
        techName: "JSON.parse & atob",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/atob"
      }
    ]
  },
  {
    name: "Hashing",
    icon: Search,
    tools: [
      {
        id: "hash",
        name: "Hash Generator",
        description: "Generate SHA-256, SHA-512, SHA-1, and MD5 hashes for text or files.",
        path: "/tools/hash",
        category: "Hashing",
        icon: Search,
        seoTitle: "Online Hash Generator - SHA & MD5 Tool",
        seoDescription: "Calculate secure cryptographic hashes for text or files. 100% browser-based computation using Web Crypto API.",
        keywords: ["sha256 generator", "md5 hash online", "sha512 tool", "file hashing"],
        techName: "Web Crypto API (SubtleCrypto)",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest"
      }
    ]
  },
  {
    name: "Encryption",
    icon: Lock,
    tools: [
      {
        id: "aes",
        name: "AES-256 Encryption",
        description: "Encrypt and decrypt text using password-based AES-256-GCM.",
        path: "/tools/aes",
        category: "Encryption",
        icon: Lock,
        seoTitle: "Online AES-256 Encryptor & Decryptor - Secure Vault",
        seoDescription: "Passphrase-based military-grade encryption in your browser. SECURE and PRIVACY-focused text encryption.",
        keywords: ["aes encryption online", "aes 256 decrypt", "password protect text", "secure encryption tool"],
        techName: "Web Crypto API (AES-GCM)",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
      },
      {
        id: "rsa",
        name: "RSA Key Pair Generator",
        description: "Generate random RSA public and private key pairs.",
        path: "/tools/rsa",
        category: "Encryption",
        icon: Key,
        seoTitle: "RSA Key Pair Generator Online - PEM Format Keys",
        seoDescription: "Generate secure RSA 2048 or 4096 bit key pairs. Export to PEM format for use in your applications.",
        keywords: ["rsa generator", "rsa public key pair", "online pem generator", "crypto keys"],
        techName: "Web Crypto API (RSASSA-PKCS1-v1_5)",
        techUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
      }
    ]
  },
  {
    name: "Design",
    icon: Palette,
    tools: [
      {
        id: "color-palette",
        name: "Color Palette Generator",
        description: "Generate harmonious color palettes, pick base colors, and visualize them in a UI mockup.",
        path: "/tools/color-palette",
        category: "Design",
        icon: Palette,
        seoTitle: "Online Color Palette Generator - Design Harmony Tool",
        seoDescription: "Create beautiful, balanced color schemes instantly. Generate complementary, analogous, and triadic palettes. Export as JSON or CSS.",
        keywords: ["color palette generator", "color harmony tool", "ui color generator", "design palette"],
        techName: "chroma-js",
        techUrl: "https://vis4.net/chromajs/"
      }
    ]
  }
];

export const ALL_TOOLS = CATEGORIES.flatMap(c => c.tools);
