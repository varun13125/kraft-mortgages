# Playwright MCP Fix - May 18, 2026 (v3)

## Problem
Playwright MCP server would not connect in Claude Code CLI sessions despite being configured in `~/.claude/mcp.json`.

## Root Cause
Claude Code CLI on Windows cannot spawn `.cmd` batch wrappers as MCP server child processes. The stdio piping required for JSON-RPC MCP communication breaks when going through `cmd.exe` batch wrappers like `playwright-mcp.cmd`.

Previous attempts that failed:
- `cmd /c npx -y @playwright/mcp` — cmd wrapper breaks stdio
- `playwright-mcp.cmd` with args — .cmd wrapper also breaks stdio

## Working Fix
Use `node` to launch the JS entry point directly (same pattern as the working `outlook-mcp` server):

```json
"playwright": {
  "command": "node",
  "args": ["C:\\Users\\varun\\AppData\\Roaming\\npm\\node_modules\\@playwright\\mcp\\cli.js"]
}
```

## Why This Works
- `outlook-mcp` in the same config file uses `"command": "node"` with a direct `.js` path — and it works
- `.cmd` wrappers introduce an extra `cmd.exe` process layer that breaks stdio piping
- Claude Code CLI spawns MCP servers as child processes with stdio pipes — this requires direct Node.js execution

## Entry Point
`C:\Users\varun\AppData\Roaming\npm\node_modules\@playwright\mcp\cli.js`

## Verification
```
echo '{"jsonrpc":"2.0","id":1,"method":"initialize",...}' | node "C:\...\cli.js"
→ {"result":{"protocolVersion":"2024-11-05",...,"name":"Playwright","version":"1.61.0-alpha"}}
```

## Browser Binaries
Chromium v1223 installed at: `C:\Users\varun\AppData\Local\ms-playwright\chromium-1223`

## Note
- Do NOT use `--headless` for Facebook credential extraction (user needs to log in visually)
- The `claude_desktop_config.json` has a separate Playwright entry using `npx.cmd` — that config is for Claude Desktop app, not CLI
