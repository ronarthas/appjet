# create-appjet ✈️

> ⚠️ **This project is in early development** - Only Vue.js template has been briefly tested so far.

**Scaffold Appjet desktop applications**

The official project generator for [Appjet](https://npmjs.com/package/appjet) - create fast, lightweight desktop apps with modern web technologies.

## 📋 Prerequisites

- **[Bun](https://bun.sh)** (required - not Node.js compatible)
- **System webview libraries** - see [Appjet documentation](https://npmjs.com/package/appjet#prerequisites)

## 🚀 Usage

Create a new Appjet application:

```bash
# With Bun (recommended)
bun create appjet my-app

# With npm
npx create-appjet my-app

# With Yarn
yarn create appjet my-app
```

## 📋 Available Templates

- **basic** - Simple HTML/CSS/JS desktop app *(available)*
- **vue** - Vue.js + Vite desktop app *(coming soon)*

## 🎯 Interactive Mode

Run without arguments for interactive setup:

```bash
bun create appjet
```

You'll be prompted to:
- Choose your project name
- Select a template
- Install dependencies automatically

## 🛠️ What's Included

Each generated project includes:
- ⚡ **Backend** - Appjet configuration and build scripts
- 🎨 **Frontend** - Web technologies (Vue.js for vue template)
- 🔧 **Build Tools** - Ready-to-use development and build commands
- 📦 **TypeScript** - Full TypeScript support

## 🚀 After Creation

```bash
cd my-app
bun install    # If not done automatically
bun dev        # Start development
bun build      # Build for production
```

## 📚 Learn More

Documentation is not written yet - this project is in early development.

## 🤝 Contributing

Found a bug or want to contribute? Visit the [main repository](https://github.com/yourname/appjet).

## 📄 License

MIT © [Your Name]
