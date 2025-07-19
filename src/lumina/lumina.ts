// lumina.ts
import { Webview, SizeHint } from "webview-bun";
import type { LuminaConfig } from "./types/config.interface";
import { embedAssets } from "./utils/assets.utils";
import { bindingRegistry } from "./registry";
import { join } from "path";
import { readFileSync, existsSync } from "fs";

const DEV_MODE = process.env.NODE_ENV !== "production";

export class Lumina {
  private webview: Webview;
  private config: LuminaConfig;

  constructor(config: LuminaConfig) {
    this.config = config;

    // Create webview instance
    this.webview = new Webview(this.config.window.debug || false, {
      width: this.config.window.width || 1024,
      height: this.config.window.height || 768,
      hint: this.config.window.resizable ? SizeHint.NONE : SizeHint.FIXED,
    });

    // Set window title
    if (this.config.window.title) {
      this.webview.title = this.config.window.title;
    }

    // 🎯 Auto-bind toutes les fonctions du registry
    this.setupBindings();

    // Load content based on mode
    if (DEV_MODE) {
      console.log("🔥 DEV MODE - Using Vite server");
      this.webview.navigate(
        this.config.frontend.viteServer || "http://localhost:5173",
      );
    } else {
      console.log("📦 PROD MODE - Using embedded assets");
      const htmlPath = join(
        this.config.frontend.distPath,
        this.config.frontend.entryPointFile,
      );

      if (existsSync(htmlPath)) {
        const rawHtml = readFileSync(htmlPath, "utf-8");
        const finalHtml = embedAssets(rawHtml, this.config.frontend.distPath);
        this.webview.setHTML(finalHtml);
      } else {
        throw new Error(`HTML entry point not found: ${htmlPath}`);
      }
    }

    // Start the webview
    this.webview.run();
  }

  /**
   * Setup all registered bindings
   */
  private setupBindings() {
    const allBindings = bindingRegistry.getAll();
    const bindingNames = Object.keys(allBindings);

    console.log(`🔗 Setting up ${bindingNames.length} bindings:`, bindingNames);

    Object.entries(allBindings).forEach(([name, fn]) => {
      this.webview.bind(name, fn);
    });
  }
}
