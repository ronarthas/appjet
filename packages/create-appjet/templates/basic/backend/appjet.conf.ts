import type { AppjetConfig } from "appjet";
export const config: AppjetConfig = {
  window: {
    debug: true,
    height: 800,
    width: 800,
    resizable: true,
    title: "Appjet - welcome",
  },
  frontend: {
    distPath: "../frontend/dist",
    entryPointFile: "index.html",
    viteServer: "http://localhost:5173",
  },
};
