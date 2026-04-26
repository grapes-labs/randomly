/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./pages/Home";
import { UUIDTool } from "./pages/tools/UUIDTool";
import { NanoIDTool } from "./pages/tools/NanoIDTool";
import { ULIDTool } from "./pages/tools/ULIDTool";
import { CUID2Tool } from "./pages/tools/CUID2Tool";
import { Base64Tool } from "./pages/tools/Base64Tool";
import { URLTool } from "./pages/tools/URLTool";
import { HTMLTool } from "./pages/tools/HTMLTool";
import { HexTool } from "./pages/tools/HexTool";
import { BinaryTool } from "./pages/tools/BinaryTool";
import { TimestampTool } from "./pages/tools/TimestampTool";
import { BinaryHexTool } from "./pages/tools/BinaryHexTool";
import { JWTTool } from "./pages/tools/JWTTool";
import { HashTool } from "./pages/tools/HashTool";
import { AESTool } from "./pages/tools/AESTool";
import { RSATool } from "./pages/tools/RSATool";
import { RegexTool } from "./pages/tools/RegexTool";
import { QRCodeTool } from "./pages/tools/QRCodeTool";
import { JSONSchemaValidator } from "./pages/tools/JSONSchemaValidator";
import { CronTester } from "./pages/tools/CronTester";
import { JWTVerifier } from "./pages/tools/JWTVerifier";
import { ColorPaletteTool } from "./pages/tools/ColorPaletteTool";
import { CSVToJSONTool } from "./pages/tools/CSVToJSONTool";
import { JSONToCSVTool } from "./pages/tools/JSONToCSVTool";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "./components/ui/toast";
 
export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dev-toolbox-theme">
      <ToastProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools/uuid" element={<UUIDTool />} />
              <Route path="/tools/nanoid" element={<NanoIDTool />} />
              <Route path="/tools/ulid" element={<ULIDTool />} />
              <Route path="/tools/cuid2" element={<CUID2Tool />} />
              <Route path="/tools/base64" element={<Base64Tool />} />
              <Route path="/tools/url" element={<URLTool />} />
              <Route path="/tools/html" element={<HTMLTool />} />
              <Route path="/tools/hex" element={<HexTool />} />
              <Route path="/tools/binary" element={<BinaryTool />} />
              <Route path="/tools/timestamp" element={<TimestampTool />} />
              <Route path="/tools/binary-hex" element={<BinaryHexTool />} />
              <Route path="/tools/jwt" element={<JWTTool />} />
              <Route path="/tools/csv-json" element={<CSVToJSONTool />} />
              <Route path="/tools/json-csv" element={<JSONToCSVTool />} />
              <Route path="/tools/hash" element={<HashTool />} />
              <Route path="/tools/aes" element={<AESTool />} />
              <Route path="/tools/rsa" element={<RSATool />} />
              <Route path="/tools/regex" element={<RegexTool />} />
              <Route path="/tools/json-schema-validator" element={<JSONSchemaValidator />} />
              <Route path="/tools/cron-tester" element={<CronTester />} />
              <Route path="/tools/jwt-verifier" element={<JWTVerifier />} />
              <Route path="/tools/color-palette" element={<ColorPaletteTool />} />
              <Route path="/tools/qrcode" element={<QRCodeTool />} />
            </Routes>
          </AppLayout>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

