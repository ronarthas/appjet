// types/config.interface.ts
export interface AppjetConfig {
  window: {
    // Window config
    title?: string;
    width?: number;
    height?: number;
    debug?: boolean;
    resizable?: boolean;
  };
  frontend: {
    //Path to the fontend dist folder ex front/dist/
    distPath: string;
    //Entry file ex: index.html
    entryPointFile: string;
    //Vite server address ex: http://localhost:5173
    viteServer?: string;
  };
}

export interface BuildConfig {
  entrypoint: string;
  outputDir: string;
  appName: string;
  frontendDir?: string;
  targets?: BunBuildTarget[];
  minify?: boolean;
  sourcemap?: boolean;
}

export type BunBuildTarget =
  | "bun-linux-x64"
  | "bun-linux-arm64"
  | "bun-windows-x64"
  | "bun-windows-arm64"
  | "bun-darwin-x64"
  | "bun-darwin-arm64"
  | "bun-linux-x64-musl"
  | "bun-linux-arm64-musl";
