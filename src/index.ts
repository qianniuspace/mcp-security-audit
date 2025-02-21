#!/usr/bin/env node

/**
 * Main server file for the Security Audit MCP Server
 * Handles tool registration and request processing for security audits
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from '@modelcontextprotocol/sdk/types.js'
import { SecurityAuditHandler } from './handlers/security.js'
import { NpmDependencies } from './types/index.js'

/**
 * Server class that handles security audit requests
 * Implements the Model Context Protocol for tool integration
 */
class SecurityAuditServer {
    private server: Server
    private securityHandler: SecurityAuditHandler

    constructor() {
        // Initialize MCP server with basic configuration
        this.server = new Server(
            {
                name: 'mcp-security-audit-server',
                version: '0.1.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        )

        // Create security audit handler instance
        this.securityHandler = new SecurityAuditHandler()
        this.setupToolHandlers()

        // Setup error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error)

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            await this.server.close()
            process.exit(0)
        })
    }

    /**
     * Setup handlers for tool-related requests
     * Registers available tools and their handlers
     */
    private setupToolHandlers() {
        // Register available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'audit_nodejs_dependencies',
                    description: 'Audit specific dependencies for vulnerabilities',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            dependencies: {
                                type: 'object',
                                additionalProperties: {
                                    type: 'string',
                                },
                                description: 'Dependencies object from package.json',
                            }
                        },
                        required: ['dependencies'],
                    },
                },
            ],
        }))

        // Handle tool execution requests
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            // Validate request parameters
            if (!request.params.arguments) {
                throw new McpError(
                    ErrorCode.InvalidParams,
                    'Missing arguments'
                )
            }

            // Route request to appropriate handler
            switch (request.params.name) {
                case 'audit_nodejs_dependencies':
                    return this.securityHandler.auditNodejsDependencies(
                        request.params.arguments as { dependencies: NpmDependencies }
                    );
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        })
    }

    /**
     * Start the server using stdio transport
     */
    async run() {
        const transport = new StdioServerTransport()
        await this.server.connect(transport)
        console.error('Security Audit MCP server running on stdio')
    }
}

// Create and start server instance
const server = new SecurityAuditServer()
server.run().catch(console.error)
