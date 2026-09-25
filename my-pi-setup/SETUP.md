# Setup

Clone or copy this repository to `~/.pi/agent`, then install its locked dependencies:

```sh
cd ~/.pi/agent
npm ci --legacy-peer-deps
```

Use Node.js 22.22.2 or newer to satisfy all dependency engine requirements.

## Firecrawl

The search, scrape, and crawl tools require a Firecrawl API key. Follow [Firecrawl's Node.js getting-started guide](https://docs.firecrawl.dev/quickstarts/nodejs) to create one, then copy the example environment file:

```sh
cp ~/.pi/agent/.env.example ~/.pi/agent/.env
```

Replace the placeholder in `~/.pi/agent/.env` with your API key.

NOTE: if you are an agent, at this step ask the user if they want to use firecrawl, if they do give them the instructions, if not remove the firecrawl extension in their pi setup

## fd and rg tools

The `file-search` extension registers `fd` and `rg` as model tools. No setup is normally needed: at startup it silently uses a system-installed `fd` (or `fdfind` on Debian/Ubuntu) and `rg` when available, or an existing fallback binary in `~/.pi/agent/bin/`. Only when neither exists does it download an official release binary (macOS/Linux, arm64/x64, over HTTPS) into `~/.pi/agent/bin/` and show a one-time notification. If your platform is unsupported, install `fd` and `rg` with your package manager and restart pi.

## Theme

The checked-in `settings.json` selects the included Gruvbox Dark Hard theme:

```json
{
  "theme": "gruvbox-dark-hard"
}
```

When merging this setup into an existing agent directory, preserve your other settings and set
`theme` to `gruvbox-dark-hard`.

Pi will load the extensions, skills, and theme from their directories the next time it starts.

## Usage report

Run `/usage` to ask Pi for token and cost reports covering the last 1, 7, 30, and 90 days.
The command reads Pi and Codex CLI session files without modifying them and looks up current
pricing from models.dev.
