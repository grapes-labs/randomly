import React from "react";
import { Tool } from "@/src/types";

export function SEOSection({ tool }: { tool: Tool }) {
  return (
    <div className="mt-16 pt-16 border-t border-border/50 max-w-none">
      <section className="markdown-body">
        <h2>What is {tool.name}?</h2>
        <p>
          The <strong>{tool.name}</strong> is a specialized developer utility designed to provide 
          quick, secure, and offline access to {tool.description.toLowerCase()}. Like all tools 
          on Randomly, this tool runs 100% in your browser using {tool.techName ? (
            tool.techUrl ? (
              <a href={tool.techUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{tool.techName}</a>
            ) : (
              <span className="text-primary">{tool.techName}</span>
            )
          ) : (
            "modern web standards"
          )} and 
          other modern web standards, ensuring your sensitive data never touches a server.
        </p>

        <h2>Common Use Cases for {tool.name}</h2>
        <ul>
          <li><strong>Development & Debugging:</strong> Quickly generate or convert data for mockups, prototypes, and testing environments.</li>
          <li><strong>Data Privacy:</strong> Handle sensitive keys, hashes, or identifiers without risking data leaks through third-party servers.</li>
          <li><strong>System Integration:</strong> Create compatible data formats (like {tool.name.includes('UUID') ? 'UUID v4/v7' : tool.name}) for database schemas and API parameters.</li>
          <li><strong>Security Audits:</strong> Verify hashes or decode tokens locally to inspect payloads without exposing them to the internet.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-foreground font-semibold mb-2">Is {tool.name} free to use?</h3>
            <p>Yes, our <strong>online {tool.name.toLowerCase()}</strong> is completely free for developers. There are no limits on usage, and you can generate or convert as much data as you need.</p>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-2">Is my data sent to your server?</h3>
            <p>Absolutely not. The primary feature of Randomly is privacy. All calculations for the <strong>{tool.name.toLowerCase()} tool</strong> happen locally in your browser's memory. This is why it works so fast and remains perfectly secure.</p>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-2">Does this tool support bulk operations?</h3>
            <p>Where applicable, our developer tools support bulk generation (like with our <strong>free {tool.name.toLowerCase()} generator</strong>) and batch processing to save you time during complex development tasks.</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.seoDescription,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "url": `https://randomly.grapeslabs.dev${tool.path}`,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
    </div>
  );
}
