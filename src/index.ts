#!/usr/bin/env node
/**
 * aienv-mcp - MCP server for granular AI access control of environment variables
 *
 * Install: claude mcp add aienv npx aienv-mcp
 */

import { startMCPServer } from "./server";

startMCPServer();
