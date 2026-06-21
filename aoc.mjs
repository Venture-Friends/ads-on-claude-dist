// src/cli.ts
import { copyFileSync, mkdirSync as mkdirSync2, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname as dirname2, join } from "node:path";
import { fileURLToPath } from "node:url";

// src/install.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
function installSettings(settingsPath2, opts) {
  const settings = existsSync(settingsPath2) ? JSON.parse(readFileSync(settingsPath2, "utf8")) : {};
  settings.statusLine = {
    type: "command",
    command: opts.statusLineCommand
  };
  mkdirSync(dirname(settingsPath2), { recursive: true });
  writeFileSync(settingsPath2, JSON.stringify(settings, null, 2) + "\n", "utf8");
}
function uninstallSettings(settingsPath2, statuslinePath) {
  if (!existsSync(settingsPath2)) return false;
  const settings = JSON.parse(readFileSync(settingsPath2, "utf8"));
  const statusLine = settings.statusLine;
  const command = statusLine?.command;
  if (typeof command !== "string" || !command.includes(statuslinePath)) {
    return false;
  }
  delete settings.statusLine;
  writeFileSync(settingsPath2, JSON.stringify(settings, null, 2) + "\n", "utf8");
  return true;
}

// src/cli.ts
function installDir() {
  return process.env.AOC_HOME ?? join(homedir(), ".ads-on-claude");
}
function settingsPath() {
  return process.env.AOC_SETTINGS_PATH ?? join(homedir(), ".claude", "settings.json");
}
function install() {
  const dir = installDir();
  mkdirSync2(dir, { recursive: true });
  const selfDir = dirname2(fileURLToPath(import.meta.url));
  const dest = join(dir, "statusline.mjs");
  copyFileSync(join(selfDir, "statusline.mjs"), dest);
  const command = `"${process.execPath}" "${dest}"`;
  installSettings(settingsPath(), { statusLineCommand: command });
  process.stdout.write(`Installed ads-on-claude \u2192 ${dest}
`);
}
function uninstall() {
  const dir = installDir();
  const removed = uninstallSettings(settingsPath(), join(dir, "statusline.mjs"));
  rmSync(dir, { recursive: true, force: true });
  process.stdout.write(
    removed ? "Uninstalled ads-on-claude. Restart Claude Code to clear the footer.\n" : "No ads-on-claude statusLine found; removed runtime files only.\n"
  );
}
function main(argv) {
  const cmd = argv[0];
  if (cmd === "install") {
    install();
    return;
  }
  if (cmd === "uninstall") {
    uninstall();
    return;
  }
  process.stderr.write("Usage: ads-on-claude <install|uninstall>\n");
  process.exit(1);
}
main(process.argv.slice(2));
