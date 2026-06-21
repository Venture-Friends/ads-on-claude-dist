# ads-on-claude installer (Windows / PowerShell)
#   irm https://<host>/install.ps1 | iex
#
# Thin by design: detect prerequisites, download the bundles, then hand off the
# settings.json wiring to the real (tested) installer.
$ErrorActionPreference = "Stop"

$BaseUrl = if ($env:AOC_BASE_URL) { $env:AOC_BASE_URL } else { "https://raw.githubusercontent.com/Venture-Friends/ads-on-claude-dist/main" }
$InstallDir = if ($env:AOC_HOME) { $env:AOC_HOME } else { Join-Path $HOME ".ads-on-claude" }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "ads-on-claude needs Node.js (you already have it if you run Claude Code). Install Node, then re-run this command."
  exit 1
}

Write-Host "Downloading ads-on-claude..."
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
foreach ($f in @("aoc.mjs", "statusline.mjs")) {
  Invoke-WebRequest -Uri "$BaseUrl/$f" -OutFile (Join-Path $InstallDir $f)
}

Write-Host "Wiring Claude Code..."
$env:AOC_HOME = $InstallDir
node (Join-Path $InstallDir "aoc.mjs") install

Write-Host "Done. Open or restart Claude Code to see your footer."
