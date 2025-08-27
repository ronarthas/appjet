// scripts/build.ts
import {
  existsSync,
  mkdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { execSync } from "child_process";
import type { BuildConfig } from "../types/config.interface";

export async function buildAppjetApp(config: BuildConfig) {
  const {
    entrypoint,
    outputDir,
    appName,
    frontendDir,
    targets = ["bun-linux-x64"],
    minify = true,
    sourcemap = true,
    windows,
    embedDir = "src/assets",
    distDir = "./src/assets/dist",
  } = config;

  console.log("🔥 Building Appjet app...");

  // 1. Build frontend if specified
  if (frontendDir && existsSync(frontendDir)) {
    console.log("📦 Building frontend...");
    try {
      execSync(`cd ${frontendDir} && bun run build`, { stdio: "inherit" });
      console.log("✅ Frontend built successfully");
    } catch (error) {
      console.error("❌ Frontend build failed");
      throw error;
    }
  }
  // 1.5. 🆕 Post-process le HTML après le build frontend
  if (existsSync(distDir)) {
    console.log("🔧 Post-processing HTML for standalone...");
    const htmlPath = join(distDir, "index.html");
    const rawHtml = readFileSync(htmlPath, "utf-8");
    const processedHtml = await processAssetsForStandalone(rawHtml, distDir);
    writeFileSync(htmlPath, processedHtml);
    console.log("✅ HTML processed successfully");
  }

  // 2. Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // 🆕 3. Scan embedded assets avec Bun.Glob natif
  let embeddedFiles: string[] = [];
  if (existsSync(embedDir)) {
    console.log(`📁 Scanning embedded assets in ${embedDir}...`);
    try {
      const glob = new Bun.Glob("**/*");

      for await (const file of glob.scan(embedDir)) {
        const fullPath = join(embedDir, file);

        try {
          if (statSync(fullPath).isFile()) {
            embeddedFiles.push(fullPath);
          }
        } catch {
          // Ignorer les erreurs
        }
      }

      console.log(`✅ Found ${embeddedFiles.length} files to embed`);
    } catch (error) {
      console.warn(`⚠️ Warning: Could not scan embed directory: ${error}`);
    }
  }

  // 4. Build for each target avec execSync
  for (const target of targets) {
    console.log(`🎯 Building for ${target}...`);
    const platformName = target.replace("bun-", "").replace("-x64", "");
    const extension = target.includes("windows") ? ".exe" : "";
    const outputFile = join(
      outputDir,
      `${appName}-${platformName}${extension}`,
    );

    // 🆕 Construire la commande bun build complète
    const buildCommand = [
      "bun build",
      "--compile",
      `--target=${target}`,
      entrypoint,
      ...embeddedFiles, // 🆕 Tous les assets
      `--outfile=${outputFile}`,
      minify ? "--minify" : "",
      sourcemap ? "--sourcemap" : "",
      // 🆕 Config Windows native en CLI
      ...(target.includes("windows") && windows && process.platform === "win32"
        ? [
            windows.title
              ? `--windows-title="${windows.title}"`
              : `--windows-title="${appName}"`,
            windows.publisher
              ? `--windows-publisher="${windows.publisher}"`
              : "",
            windows.version
              ? `--windows-version="${windows.version}"`
              : `--windows-version="1.0.0"`,
            windows.description
              ? `--windows-description="${windows.description}"`
              : "",
            windows.copyright
              ? `--windows-copyright="${windows.copyright}"`
              : "",
          ]
        : []),
    ]
      .filter(Boolean)
      .join(" ");

    try {
      console.log(`Running: ${buildCommand}`);
      execSync(buildCommand, { stdio: "inherit" });
      console.log(`✅ ${target} build complete: ${outputFile}`);
    } catch (error) {
      console.error(`❌ ${target} build failed`);
      throw error;
    }
  }

  console.log("🎉 All builds completed!");
}

async function processAssetsForStandalone(
  htmlContent: string,
  distPath: string,
): Promise<string> {
  let processedHtml = htmlContent;

  // Embed CSS files
  processedHtml = processedHtml.replace(
    /<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g,
    (match, href) => {
      const cssPath = join(distPath, href.replace(/^\//, ""));
      if (existsSync(cssPath)) {
        const css = readFileSync(cssPath, "utf-8");
        return `<style>${css}</style>`;
      }
      return match;
    },
  );

  // Embed JS files
  processedHtml = processedHtml.replace(
    /<script[^>]+src="([^"]+)"[^>]*><\/script>/g,
    (match, src) => {
      const jsPath = join(distPath, src.replace(/^\//, ""));
      if (existsSync(jsPath)) {
        const js = readFileSync(jsPath, "utf-8");
        return `<script type="module">${js}</script>`;
      }
      return match;
    },
  );

  // Traiter le favicon s'il existe
  processedHtml = processedHtml.replace(
    /<link rel="icon"[^>]+href="([^"]+)"[^>]*>/g,
    (match, href) => {
      const iconPath = join(distPath, href.replace(/^\//, ""));
      if (existsSync(iconPath)) {
        const iconBuffer = readFileSync(iconPath);
        const base64 = iconBuffer.toString("base64");
        return `<link rel="icon" href="data:image/x-icon;base64,${base64}">`;
      }
      return match;
    },
  );

  return processedHtml;
}
