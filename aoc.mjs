// src/cli.ts
import { copyFileSync, mkdirSync as mkdirSync2, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname as dirname2, join } from "node:path";
import { fileURLToPath } from "node:url";

// src/install.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
function load(settingsPath2) {
  return existsSync(settingsPath2) ? JSON.parse(readFileSync(settingsPath2, "utf8")) : {};
}
function save(settingsPath2, settings) {
  mkdirSync(dirname(settingsPath2), { recursive: true });
  writeFileSync(settingsPath2, JSON.stringify(settings, null, 2) + "\n", "utf8");
}
function installSettings(settingsPath2, opts) {
  const settings = load(settingsPath2);
  settings.statusLine = { type: "command", command: opts.statusLineCommand };
  settings.hooks ??= {};
  const stop = settings.hooks.Stop ??= [];
  const deduped = stop.filter((g) => !g.hooks?.some((h) => h.command === opts.hookCommand));
  deduped.push({ hooks: [{ type: "command", command: opts.hookCommand }] });
  settings.hooks.Stop = deduped;
  save(settingsPath2, settings);
}
function uninstallSettings(settingsPath2, marker) {
  if (!existsSync(settingsPath2)) return false;
  const settings = load(settingsPath2);
  let removed = false;
  const sl = settings.statusLine;
  if (typeof sl?.command === "string" && sl.command.includes(marker)) {
    delete settings.statusLine;
    removed = true;
  }
  const stop = settings.hooks?.Stop;
  if (Array.isArray(stop)) {
    const kept = stop.filter((g) => !g.hooks?.some((h) => typeof h.command === "string" && h.command.includes(marker)));
    if (kept.length !== stop.length) {
      settings.hooks.Stop = kept;
      removed = true;
    }
  }
  if (removed) save(settingsPath2, settings);
  return removed;
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
  const statusline = join(dir, "statusline.mjs");
  const hook = join(dir, "hook.mjs");
  copyFileSync(join(selfDir, "statusline.mjs"), statusline);
  copyFileSync(join(selfDir, "hook.mjs"), hook);
  installSettings(settingsPath(), {
    statusLineCommand: `"${process.execPath}" "${statusline}"`,
    hookCommand: `"${process.execPath}" "${hook}"`
  });
  process.stdout.write(`Installed ads-on-claude \u2192 ${dir}
`);
}
function uninstall() {
  const dir = installDir();
  const removed = uninstallSettings(settingsPath(), dir);
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
