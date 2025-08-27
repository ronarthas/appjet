// appjet.ts
import { Webview, SizeHint } from "webview-bun";
import type { AppjetConfig } from "./types/config.interface";
import { bindingRegistry } from "./registry";

const DEV_MODE = process.env.NODE_ENV !== "production";

export class Appjet {
  private webview: Webview;
  private config: AppjetConfig;

  constructor(config: AppjetConfig) {
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
      this.webview.run();
    } else {
      console.log("📦 PROD MODE - Using embedded assets");
      const htmlFile = Array.from(Bun.embeddedFiles).find((file) =>
        file.name.includes("index.html"),
      );

      if (htmlFile) {
        htmlFile
          .text()
          .then((finalHtml) => {
            this.webview.setHTML(finalHtml);
            this.webview.run();
          })
          .catch((error) => {
            console.error("Erreur chargement HTML:", error);
            throw error;
          });
      } else {
        throw new Error("HTML entry point not found in embedded files");
      }
    }
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
