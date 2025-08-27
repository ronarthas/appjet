import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const execFileAsync = promisify(execFile);

/**
 * Installation options for Windows software
 */
export interface InstallOptions {
  /** Silent installation arguments (default: ["/silent", "/install"]) */
  silentArgs?: string[];
  /** Hide console window during installation */
  windowsHide?: boolean;
  /** Installation timeout in milliseconds */
  timeout?: number;
  /** Custom working directory */
  cwd?: string;
}

/**
 * Install third-party software on Windows
 * @param file File data from Bun embeddedFiles
 * @param filename Filename for the installer
 * @param options Installation options
 */
export async function installSoft(
  file: Uint8Array,
  filename: string,
  options: InstallOptions = {},
): Promise<void> {
  const {
    silentArgs = ["/silent", "/install"],
    windowsHide = true,
    timeout = 300000, // 5 minutes
    cwd,
  } = options;

  try {
    console.log(`Installing ${filename}...`);

    const tempDir = tmpdir();
    const tempInstallerPath = join(tempDir, filename);
    await Bun.write(tempInstallerPath, file);

    await execFileAsync(tempInstallerPath, silentArgs, {
      windowsHide,
      timeout,
      cwd: cwd || tempDir,
    });

    console.log(`${filename} installed successfully`);
  } catch (err) {
    console.error(`Installation failed for ${filename}:`, err);
    throw new Error(
      `Unable to install ${filename} silently (admin rights required?)`,
    );
  }
}

/**
 * Predefined installation configurations for common software
 */
export const InstallPresets = {
  webview2: {
    silentArgs: ["/silent", "/install"],
  },

  msi: {
    silentArgs: ["/quiet", "/norestart"],
    timeout: 600000, // 10 minutes for MSI
  },

  innoSetup: {
    silentArgs: ["/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART"],
  },

  nsis: {
    silentArgs: ["/S"],
  },

  postgres: {
    silentArgs: ["--mode", "unattended", "--superpassword", "postgres"],
    timeout: 900000, // 15 minutes
  },

  gstreamer: {
    silentArgs: ["/S"], // Typically NSIS-based
    timeout: 480000, // 8 minutes
  },
} as const;

//exemple
// WebView2
// await installSoft(webview2Data, "webview2.exe", InstallPresets.webview2);

//  PostgreSQL
// await installSoft(pgData, "postgresql.exe", InstallPresets.postgres);

//  GStreamer
// await installSoft(gstreamerData, "gstreamer.msi", InstallPresets.gstreamer);

//  Custom installer
// await installSoft(customData, "custom.exe", {
//   silentArgs: ["/quiet", "/passive"],
//   timeout: 120000
// });
