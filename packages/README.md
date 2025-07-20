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

## 🚀 Quick Start

Create a new Appjet app:

```bash
bun create appjet my-app
cd my-app
bun install
bun dev
```

## 📖 Basic Usage

```typescript
import { Appjet } from 'appjet';

const app = new Appjet({
  window: {
    title: 'My App',
    width: 1200,
    height: 800,
    resizable: true
  },
  frontend: {
    distPath: './frontend/dist',
    entryPointFile: 'index.html',
    viteServer: 'http://localhost:5173'
  }
});
```

## 🛠️ Build for Production

```bash
bun run build        # Build web assets + desktop app
bun run build:exe    # Compile to executable
```

## 📚 Documentation

Documentation is not written yet - this project is in early development.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/yourname/appjet/blob/main/CONTRIBUTING.md)

## 📄 License

MIT © [Your Name]
