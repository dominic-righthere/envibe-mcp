# aienv-mcp

[![npm version](https://img.shields.io/npm/v/aienv-mcp.svg)](https://www.npmjs.com/package/aienv-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MCP server for aienv** - granular AI access control for environment variables.

## Install

Add to your AI tool's MCP config:

```json
{
  "mcpServers": {
    "aienv": {
      "command": "npx",
      "args": ["aienv-mcp"]
    }
  }
}
```

<details>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add aienv npx aienv-mcp
```
</details>

<details>
<summary><b>Claude Desktop</b></summary>

Add to `claude_desktop_config.json`:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
</details>

<details>
<summary><b>VS Code / Cursor / Windsurf</b></summary>

Add to your editor's MCP settings (see main [aienv](https://github.com/dominic-righthere/aienv) docs for details).
</details>

On first run, aienv automatically:
1. Creates `.env.manifest.yaml` from your `.env.example`
2. Generates `.env.ai` (filtered view for AI)
3. Blocks direct `.env` file access

## What is this?

This is the MCP server component of [aienv](https://github.com/dominic-righthere/aienv). It gives AI coding assistants controlled access to your environment variables with 5 access levels:

| Level | AI Can See | AI Can Modify |
|-------|-----------|---------------|
| `full` | Actual value | Yes |
| `read-only` | Actual value | No |
| `placeholder` | `<VAR_NAME>` | No |
| `schema-only` | Format only | No |
| `hidden` | Nothing | No |

## MCP Tools

| Tool | Description |
|------|-------------|
| `env_list` | List visible variables with access levels |
| `env_get` | Get a variable's value (respects permissions) |
| `env_set` | Set a variable (only `full` access) |
| `env_describe` | Get detailed info about a variable |

## For CLI tools

If you need CLI commands like `aienv setup -i` (interactive mode), `aienv view`, or `aienv generate`, install the full package:

```bash
npm install -g aienv
```

## License

MIT
