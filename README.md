# envibe-mcp

[![npm version](https://img.shields.io/npm/v/envibe-mcp.svg)](https://www.npmjs.com/package/envibe-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MCP server for envibe** - the missing permission layer between AI agents and your .env.

## Install

Add to your AI tool's MCP config:

```json
{
  "mcpServers": {
    "envibe": {
      "command": "npx",
      "args": ["envibe-mcp"]
    }
  }
}
```

<details>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add envibe npx envibe-mcp
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

Add to your editor's MCP settings (see main [envibe](https://github.com/dominic-righthere/envibe) docs for details).
</details>

On first run, envibe automatically:
1. Creates `.env.manifest.yaml` from your `.env.example`
2. Generates `.env.ai` (filtered view for AI)
3. Blocks direct `.env` file access

## What is this?

This is the MCP server component of [envibe](https://github.com/dominic-righthere/envibe). It gives AI coding assistants controlled access to your environment variables with 5 access levels:

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
| `env_describe` | Get detailed info including format and example |
| `env_check_required` | Check which required variables are missing |

### v0.2.0 Features

- **Better error messages** - When access is denied, get helpful guidance
- **Format hints** - Know what format a variable should be (url, key, number, etc.)
- **Required var checking** - Use `env_check_required` to guide users through setup

## For CLI tools

If you need CLI commands like `envibe setup -i` (interactive mode), `envibe view`, or `envibe generate`, install the full package:

```bash
npm install -g envibe
```

## License

MIT
