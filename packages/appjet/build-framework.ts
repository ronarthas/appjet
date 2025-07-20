// build-framework.ts
import { rmSync, existsSync } from "fs";

// Clean dist
if (existsSync("./dist")) {
  rmSync("./dist", { recursive: true });
}

// Build le framework
await Bun.build({
  entrypoints: ["./src/appjet/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: false,
  splitting: false,
});

// Générer les types TypeScript
try {
  await Bun.spawn(["bunx", "tsc", "--emitDeclarationOnly"], {
    stdio: "inherit",
  });
  console.log("✅ Framework build complete!");
} catch (error) {
  console.error("❌ TypeScript generation failed:", error);
  process.exit(1);
}
