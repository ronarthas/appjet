// scripts/build.ts
import { existsSync, mkdirSync } from "fs";
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
  } = config;

  console.log("🔥 Building Appjet app...");

  // 1. Build frontend if specified
  if (frontendDir && existsSync(frontendDir)) {
    console.log("📦 Building frontend...");
    try {
      execSync(`cd ${frontendDir} &&  bun run build`, { stdio: "inherit" });
      console.log("✅ Frontend built successfully");
    } catch (error) {
      console.error("❌ Frontend build failed");
      throw error;
    }
  }

  // 2. Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // 3. Build for each target
  for (const target of targets) {
    console.log(`🎯 Building for ${target}...`);

    const platformName = target.replace("bun-", "").replace("-x64", "");
    const extension = target.includes("windows") ? ".exe" : "";
    const outputFile = join(
      outputDir,
      `${appName}-${platformName}${extension}`,
    );

    const buildCommand = [
      "bun build",
      "--compile",
      `--target=${target}`,
      entrypoint,
      `--outfile=${outputFile}`,
      minify ? "--minify" : "",
      sourcemap ? "--sourcemap" : "",
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

// Script CLI
// if (import.meta.main) {
//   const config: BuildConfig = {
//     entrypoint: "./test/basic-app.ts",
//     outputDir: "./build",
//     appName: "appjet-test-app",
//     frontendDir: "./frontend",
//     targets: [
//       "bun-linux-x64",
//       // "bun-linux-arm64",    // Pour ARM
//       // "bun-windows-x64",    // Pour Windows
//       // "bun-darwin-x64"      // Pour macOS
//     ],
//   };

//   await buildAppjetApp(config);
// }
