# Security Audit Tool
[![smithery badge](https://smithery.ai/badge/@qianniuspace/mcp-security-audit)](https://smithery.ai/server/@qianniuspace/mcp-security-audit)


A MCP Server that can audit npm package dependencies for security vulnerabilities. Built with the Model Context Protocol (MCP).

## Supported Platforms

- npm/pnpm/yarn（nodejs）

## Features

- Audit specific dependencies for security vulnerabilities
- Check for known vulnerabilities in npm packages
- Generate detailed vulnerability reports
- Support for multiple severity levels (critical, high, moderate, low)
- Compatible with package.json dependency format

### Installing via Smithery

To install Security Audit Tool for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@qianniuspace/mcp-security-audit):

```bash
npx -y @smithery/cli install @qianniuspace/mcp-security-audit --client claude
```

### MCP Integration

1. Clone the repository:
```bash
git clone https://github.com/qianniuspace/mcp-security-audit.git
cd mcp-security-audit
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Add MCP configuration:
```json
{
  "Name": "mcp-security-audit",
  "Type": "command",
  "Command": "node /path/to/mcp-security-audit/build/index.js"
}
```
Note: Replace `/path/to/mcp-security-audit` with your actual installation path.

## Usage



## API Response

The tool returns detailed vulnerability information including:

- Vulnerability details
- Severity levels
- Fix recommendations
- CVSS scores
- GitHub Advisory IDs
- CVE references

Example response:
```json
{
  "vulnerabilities": [...],
  "summary": {
    "total": 7,
    "critical": 1,
    "high": 3,
    "moderate": 3,
    "low": 0
  },
  "metadata": {
    "timestamp": "2024-04-23T10:00:00.000Z",
    "packageManager": "npm",
    "projectName": "dependency-audit"
  }
}
```

## Configuration

The tool uses the following files for configuration:
- `package.json` - Project dependencies
- MCP configuration for tool integration

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the inspector
npm run inspector

# Watch mode
npm run watch
```

## License

MIT

## Author

ESX (qianniuspace@gmail.com)

