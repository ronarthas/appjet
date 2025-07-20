#!/usr/bin/env bun
import { mkdir, writeFile, cp } from "fs/promises";
import { join, resolve } from "path";
import { existsSync } from "fs";
import * as p from "@clack/prompts";

const templates = {
  basic: {
    name: "Basic Lumina app",
    description: "Simple desktop app with HTML/CSS/JS",
  },
  vue: {
    name: "Vue.js app",
    description: "Desktop app with Vue.js + Vite",
  },
};

async function main() {
  console.clear();

  p.intro("🌟 Welcome to Lumina");

  // Si un nom est passé en argument, l'utiliser
  const args = process.argv.slice(2);
  let projectName = args[0];

  if (!projectName) {
    projectName = await p.text({
      message: "What is your project name?",
      placeholder: "my-awesome-app",
      validate: (value) => {
        if (!value) return "Please enter a project name";
        if (existsSync(resolve(value))) return "Directory already exists!";
        if (!/^[a-z0-9-_]+$/i.test(value))
          return "Use only letters, numbers, dashes and underscores";
        return undefined;
      },
    });

    if (p.isCancel(projectName)) {
      p.cancel("Operation cancelled");
      process.exit(0);
    }
  }

  // Vérifier si le dossier existe déjà
  if (existsSync(resolve(projectName))) {
    p.cancel(`❌ Directory ${projectName} already exists!`);
    process.exit(1);
  }

  const template = await p.select({
    message: "Choose a template:",
    options: Object.entries(templates).map(([key, { name, description }]) => ({
      value: key,
      label: name,
      hint: description,
    })),
  });

  if (p.isCancel(template)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const shouldInstall = await p.confirm({
    message: "Install dependencies?",
    initialValue: true,
  });

  if (p.isCancel(shouldInstall)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const s = p.spinner();

  try {
    s.start("Creating project...");

    const projectPath = resolve(projectName);
    await mkdir(projectPath, { recursive: true });

    // Copier le template
    const templatePath = new URL(`../templates/${template}`, import.meta.url)
      .pathname;

    // Fix pour Windows - enlever le "/" initial sur Windows
    const cleanTemplatePath =
      process.platform === "win32" && templatePath.startsWith("/")
        ? templatePath.slice(1)
        : templatePath;

    await copyTemplate(cleanTemplatePath, projectPath, projectName);

    if (shouldInstall) {
      s.message("Installing dependencies...");

      const install = Bun.spawn(["bun", "install"], {
        cwd: projectPath,
        stdio: ["inherit", "inherit", "inherit"],
      });
      await install.exited;
    }

    s.stop("✅ Project created successfully!");

    p.note(
      `cd ${projectName}\n${shouldInstall ? "" : "bun install\n"}bun dev`,
      "Next steps:",
    );

    p.outro("Happy coding! 🚀");
  } catch (error) {
    s.stop("❌ Failed to create project");
    p.cancel(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function copyTemplate(templatePath, targetPath, projectName) {
  // Copier tous les fichiers du template
  await cp(templatePath, targetPath, { recursive: true });

  // Personnaliser le package.json
  const packageJsonPath = join(targetPath, "package.json");
  if (existsSync(packageJsonPath)) {
    const packageJson = await Bun.file(packageJsonPath).json();
    packageJson.name = projectName;

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

main().catch(console.error);
