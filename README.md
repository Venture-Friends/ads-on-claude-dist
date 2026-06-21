# ads-on-claude (distribution)

Public, generated distribution for **ads-on-claude** — a privacy-first ad layer
for Claude Code. This repo holds only compiled bundles + install scripts; the
source lives in a private repo.

## Install

macOS / Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/Venture-Friends/ads-on-claude-dist/main/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/Venture-Friends/ads-on-claude-dist/main/install.ps1 | iex
```

Requires Node.js (already present if you run Claude Code). The installer writes a
`statusLine` into `~/.claude/settings.json` and a runtime into `~/.ads-on-claude/`.

> Generated — do not edit by hand. Published via `scripts/publish-dist.mjs`.
