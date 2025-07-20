import { buildAppjetApp, type BuildConfig } from "appjet";

export const build: BuildConfig = {
  appName: "test",
  entrypoint: "./appjet.ts",
  outputDir: "./build",
  frontendDir: "../frontend",
  targets: ["bun-linux-x64"],
};

await buildAppjetApp(build);
