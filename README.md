# Appjet ✈️

> ⚠️ **This project is in early development** - Only basic template is currently available.

**Fast, simple desktop apps with modern web technologies**

Appjet is a lightweight alternative to Electron, built for speed and simplicity. Create desktop applications using Vue.js, HTML, CSS, and JavaScript - powered by Bun and native webviews.

## 📋 Prerequisites

### Required
- **[Bun](https://bun.sh)** (not Node.js compatible)
- **System webview libraries**:

#### Windows
- Windows 11: ✅ Built-in (no additional setup)
- Windows 10: May require WebView2 runtime

#### macOS
- Built-in WebKit (no additional setup required)

#### Linux
Install GTK 4 and WebkitGTK 6:
```bash
# Debian/Ubuntu
sudo apt install libgtk-4-1 libwebkitgtk-6.0-4

# Arch Linux
sudo pacman -S gtk4 webkitgtk-6.0

# Fedora
sudo dnf install gtk4 webkitgtk6.0
```

## ⚡ Why Appjet?

- **🚀 Lightning Fast** - Built on Bun, compiles to native executables
- **🪶 Lightweight** - No bundled Chromium, uses system webview
- **🎯 Simple** - Minimal API, focus on your app logic
- **🔧 Modern Stack** - Vue.js, Vite, TypeScript out of the box
- **📦 Single Binary** - Compile to standalone executables
- **🔥 Hot Reload** - Instant updates during development
- **🔗 Auto Binding** - Automatic function binding between backend and frontend

## 🚀 Quick Start

Create a new Appjet app:

```bash
bun create appjet my-app
cd my-app
```

### Setup Frontend (Vue.js example)
```bash
cd frontend
bun create vue@latest .
bun install

# Start frontend dev server
bun dev
```

### Setup Backend
```bash
cd ../backend
bun install

# Start backend (in another terminal)
bun dev
```

## ⚙️ Configuration

### Window & Webview Settings (`appjet.config.ts`)
```typescript
import type { AppjetConfig } from "appjet";

export const config: AppjetConfig = {
  window: {
    debug: true,              // Enable dev tools
    height: 800,              // Window height
    width: 1200,              // Window width
    resizable: true,          // Allow window resize
    title: "My Appjet App",   // Window title
  },
  frontend: {
    distPath: "../frontend/dist",           // Production build path
    entryPointFile: "index.html",           // Entry HTML file
    viteServer: "http://localhost:5173",    // Dev server URL
  },
};
```

### Build Configuration (`appjet.build.ts`)
```typescript
import { buildAppjetApp, type BuildConfig } from "appjet";

export const build: BuildConfig = {
  appName: "my-app",                    // Executable name
  entrypoint: "./appjet.ts",            // Backend entry point
  outputDir: "./dist",                  // Build output directory
  frontendDir: "../frontend",           // Frontend source directory
  targets: ["bun-linux-x64"],          // Target platforms
};

await buildAppjetApp(build);
```

## 🔗 Backend ↔ Frontend Communication

Appjet's **magic**: just register a function in your backend, and it's automatically available in your frontend!

### Backend (`backend/api.ts`)
```typescript
import { registerBinding } from "appjet";
import { readdir, writeFile } from "fs/promises";

// Simple function
const greetUser = (name: string) => {
  return `Hello ${name}! Welcome to Appjet ✈️`;
};

// Async function with file system access
const listFiles = async (directory: string) => {
  try {
    const files = await readdir(directory);
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Complex function with multiple operations
const saveUserData = async (userData: { name: string; email: string }) => {
  await writeFile('user.json', JSON.stringify(userData, null, 2));
  console.log("User data saved!");
  return { saved: true, timestamp: Date.now() };
};

// Register functions (they become available in frontend automatically!)
registerBinding("greetUser", greetUser);
registerBinding("listFiles", listFiles);
registerBinding("saveUserData", saveUserData);

// Or register multiple at once
registerBinding({
  getCurrentTime: () => new Date().toISOString(),
  getSystemInfo: () => ({ platform: process.platform, arch: process.arch })
});
```

### Frontend (Vue.js, React, or vanilla JS)
```typescript
// Cast window to access bound functions
const w = window as any;

// Call the backend functions directly
const greeting = await w.greetUser("Alice");
console.log(greeting); // "Hello Alice! Welcome to Appjet ✈️"

// File system operations from frontend
const result = await w.listFiles("/home/user/documents");
if (result.success) {
  console.log("Files:", result.files);
}

// Save data
await w.saveUserData({ name: "Bob", email: "bob@example.com" });

// Get system info
const info = await w.getSystemInfo();
console.log(info); // { platform: "linux", arch: "x64" }
```

**💡 Pro tip:** For better TypeScript support, you can create a types file:

```typescript
// types/appjet.d.ts
declare global {
  interface Window {
    greetUser: (name: string) => Promise<string>;
    listFiles: (directory: string) => Promise<{success: boolean, files?: string[], error?: string}>;
    saveUserData: (userData: {name: string, email: string}) => Promise<{saved: boolean, timestamp: number}>;
    getSystemInfo: () => Promise<{platform: string, arch: string}>;
  }
}
```

Then use with full type safety:
```typescript
const greeting = await window.greetUser("Alice"); // ✅ Fully typed!
```

**✨ That's it!** No IPC setup, no manual bindings, no complex messaging. Just write functions in your backend and call them from your frontend like magic! 🪄

## 🛠️ Build for Production

### For Vue.js Projects

1. **Update your router** (`src/router/index.ts`) to use memory history:

```typescript
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(), // Use memory history for embedded apps
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
```

2. **Update your `vite.config.ts`** for single-file output:

```typescript
export default defineConfig({
  // ... other config
  build: {
    assetsInlineLimit: 999999999,  // Inline all assets
    cssCodeSplit: false,           // Single CSS file
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/index.js',
        assetFileNames: 'assets/index.[ext]',
      },
    },
  },
});
```

### Build Commands
```bash
# Build everything
cd backend
bun run build

# Or build executable directly
bun run appjet.build.ts
```

## 📚 Available Targets

- `bun-linux-x64` - Linux 64-bit
- `bun-windows-x64` - Windows 64-bit
- `bun-darwin-x64` - macOS Intel
- `bun-darwin-arm64` - macOS Apple Silicon

## 🤝 Contributing

Contributions welcome! This project is in early development.

## 📄 License

MIT © Bastien Etienne
