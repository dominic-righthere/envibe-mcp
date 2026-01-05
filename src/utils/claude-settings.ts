/**
 * Claude Code settings configuration utilities - Node.js compatible
 */
import * as fs from "fs/promises";
import * as path from "path";

const CLAUDE_DIR = ".claude";
const CLAUDE_SETTINGS_FILE = ".claude/settings.json";

// Safe .env files that should NOT be denied (AI can read these)
const SAFE_ENV_FILES = [
  ".env.ai",
  ".env.manifest.yaml",
  ".env.example",
  ".env.sample",
  ".env.template",
];

// Base permissions to add to Claude settings (static rules)
const DENY_RULES = [
  // File tool blocks (gitignore-style patterns)
  "Read(./.env)",
  "Read(./.env.*)",
  "Edit(./.env)",
  "Edit(./.env.*)",
  "Write(./.env)",
  "Write(./.env.*)",

  // Bash command blocks (prefix matching with :*)
  "Bash(cat .env:*)",
  "Bash(cat ./.env:*)",
  "Bash(head .env:*)",
  "Bash(head ./.env:*)",
  "Bash(tail .env:*)",
  "Bash(tail ./.env:*)",
  "Bash(less .env:*)",
  "Bash(less ./.env:*)",
  "Bash(more .env:*)",
  "Bash(more ./.env:*)",
  "Bash(grep .env:*)",
  "Bash(grep ./.env:*)",
];

const ALLOW_RULES = [
  "Read(./.env.ai)",
  "Read(./.env.manifest.yaml)",
  "Read(./.env.example)",
];

interface ClaudeSettings {
  permissions?: {
    deny?: string[];
    allow?: string[];
  };
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Discover .env files in the project directory
 * Returns files that should be denied (excludes safe files)
 */
export async function discoverEnvFiles(): Promise<string[]> {
  const files: string[] = [];

  try {
    const dirEntries = await fs.readdir(".", { withFileTypes: true });

    for (const entry of dirEntries) {
      if (entry.isFile() && entry.name.startsWith(".env")) {
        if (!SAFE_ENV_FILES.includes(entry.name)) {
          files.push(entry.name);
        }
      }
    }
  } catch {
    // Directory read failed
  }

  return files;
}

/**
 * Generate deny rules for a specific .env file
 */
function generateDenyRulesForFile(filename: string): string[] {
  return [
    `Read(./${filename})`,
    `Bash(cat ${filename}:*)`,
    `Bash(cat ./${filename}:*)`,
    `Bash(head ${filename}:*)`,
    `Bash(head ./${filename}:*)`,
    `Bash(tail ${filename}:*)`,
    `Bash(tail ./${filename}:*)`,
  ];
}

export interface ConfigureResult {
  denyAdded: number;
  allowAdded: number;
  mcpConfigured: boolean;
  discoveredFiles: string[];
}

/**
 * Configure Claude Code settings with aienv permissions
 * @param silent - If true, don't log to console (used by MCP server)
 */
export async function configureClaudeSettings(silent = false): Promise<ConfigureResult> {
  // Ensure .claude directory exists
  try {
    await fs.mkdir(CLAUDE_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }

  // Load existing settings or create new
  let settings: ClaudeSettings = {};

  try {
    const content = await fs.readFile(CLAUDE_SETTINGS_FILE, "utf-8");
    settings = JSON.parse(content);
    if (!silent) console.log("     Merging with existing settings...");
  } catch {
    // File doesn't exist or invalid JSON
  }

  // Initialize permissions if not present
  if (!settings.permissions) {
    settings.permissions = {};
  }
  if (!Array.isArray(settings.permissions.deny)) {
    settings.permissions.deny = [];
  }
  if (!Array.isArray(settings.permissions.allow)) {
    settings.permissions.allow = [];
  }

  // Discover actual .env files in the project
  const discoveredFiles = await discoverEnvFiles();

  // Build complete deny rules list (static + discovered)
  const allDenyRules = [...DENY_RULES];
  for (const file of discoveredFiles) {
    allDenyRules.push(...generateDenyRulesForFile(file));
  }

  // Add deny rules (skip duplicates)
  let denyAdded = 0;
  for (const rule of allDenyRules) {
    if (!settings.permissions.deny.includes(rule)) {
      settings.permissions.deny.push(rule);
      denyAdded++;
    }
  }

  // Add allow rules (skip duplicates)
  let allowAdded = 0;
  for (const rule of ALLOW_RULES) {
    if (!settings.permissions.allow.includes(rule)) {
      settings.permissions.allow.push(rule);
      allowAdded++;
    }
  }

  // Add MCP server config
  if (!settings.mcpServers) {
    settings.mcpServers = {};
  }

  const mcpConfigured = "aienv" in settings.mcpServers;
  settings.mcpServers.aienv = {
    command: "npx",
    args: ["aienv-mcp"],
  };

  // Write settings
  await fs.writeFile(CLAUDE_SETTINGS_FILE, JSON.stringify(settings, null, 2) + "\n");

  // Report what was done (if not silent)
  if (!silent) {
    const changes: string[] = [];
    if (denyAdded > 0) changes.push(`${denyAdded} deny rules`);
    if (allowAdded > 0) changes.push(`${allowAdded} allow rules`);
    if (!mcpConfigured) changes.push("MCP server");

    if (changes.length > 0) {
      console.log(`     Added: ${changes.join(", ")}`);
      if (discoveredFiles.length > 0) {
        console.log(`     Protected files: ${discoveredFiles.join(", ")}`);
      }
    } else {
      console.log("     Already configured");
    }
  }

  return { denyAdded, allowAdded, mcpConfigured, discoveredFiles };
}
