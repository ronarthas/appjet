import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Fonction pour embedder les assets CSS et JS
export const embedAssets = (htmlContent: string, distPath: string) => {
  console.log("Starting asset embedding...");

  // Embed CSS files
  let processedHtml = htmlContent.replace(
    /<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g,
    (match, href) => {
      const cssPath = join(distPath, href.replace(/^\//, ""));
      console.log("Processing CSS:", cssPath);

      if (existsSync(cssPath)) {
        const css = readFileSync(cssPath, "utf-8");
        console.log("CSS embedded, size:", css.length);
        return `<style>${css}</style>`;
      } else {
        console.error("CSS file not found:", cssPath);
        return match;
      }
    },
  );

  // Embed JS files
  processedHtml = processedHtml.replace(
    /<script[^>]+src="([^"]+)"[^>]*><\/script>/g,
    (match, src) => {
      const jsPath = join(distPath, src.replace(/^\//, ""));
      console.log("Processing JS:", jsPath);

      if (existsSync(jsPath)) {
        const js = readFileSync(jsPath, "utf-8");
        console.log("JS embedded, size:", js.length);
        return `<script type="module">${js}</script>`;
      } else {
        console.error("JS file not found:", jsPath);
        return match;
      }
    },
  );

  return processedHtml;
};
