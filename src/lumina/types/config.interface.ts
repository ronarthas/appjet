// types/config.interface.ts
export interface LuminaConfig {
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
