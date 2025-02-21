/**
 * Security audit handler for npm dependencies
 * Provides functionality to check for vulnerabilities in npm packages
 */

import { Vulnerability, NpmDependencies } from '../types/index.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import npmFetch from 'npm-registry-fetch';


export class SecurityAuditHandler {
    /**
     * Audits a single dependency for security vulnerabilities
     * @param name - The name of the package to audit
     * @param version - The version of the package to audit
     * @returns Promise containing the audit results
     */
    private async auditSingleDependency(name: string, version: string): Promise<any> {
        try {
            // Validate input parameters
            if (!name || !version) {
                throw new Error(`Invalid package name or version: ${name}@${version}`);
            }

            // Clean version string by removing prefix characters (^ or ~)
            const cleanVersion = version.trim().replace(/^[\^~]/, '');

            // Prepare audit data structure
            const auditData = {
                name: "single-dependency-audit",
                version: "1.0.0",
                requires: { [name]: cleanVersion },
                dependencies: {
                    [name]: { version: cleanVersion }
                }
            };

            // Send audit request to npm registry
            const result = await npmFetch.json('/-/npm/v1/security/audits', {
                method: 'POST',
                body: auditData,
                gzip: true
            });

            if (!result) {
                throw new Error(`No response received for ${name}@${cleanVersion}`);
            }

            return result;
        } catch (error) {
            console.error(`[ERROR] Error auditing ${name}@${version}:`, error);
            throw new McpError(
                ErrorCode.InternalError,
                `Failed to audit ${name}@${version}: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Main method to audit multiple dependencies
     * @param dependencies - Object containing package names and versions to audit
     * @returns Promise containing consolidated audit results
     */
    async auditNodejsDependencies(args: { dependencies: NpmDependencies }) {
        try {
            // Validate dependencies object
            if (!args || typeof args.dependencies !== 'object') {
                throw new McpError(
                    ErrorCode.InvalidParams,
                    'Invalid dependencies object'
                );
            }

            // Handle potentially nested dependencies object
            const actualDeps = args.dependencies.dependencies || args.dependencies;

            const auditResults = [];
            for (const [name, version] of Object.entries(actualDeps)) {
                if (typeof version !== 'string') continue
                try {
                    const result = await this.auditSingleDependency(name, version);
                    auditResults.push(result);
                } catch (error) {
                    console.error(`[ERROR] Failed to audit ${name}@${version}:`, error);
                    // Continue processing other dependencies
                }
            }

            // Merge and process all vulnerability results
            const mergedVulnerabilities = auditResults.flatMap(result =>
                this.processVulnerabilities(result)
            );

            // Return consolidated results
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(mergedVulnerabilities, null, 2),
                    },
                ]
            };
        } catch (error) {
            console.error('[ERROR] Audit failed:', error);
            if (error instanceof McpError) {
                throw error;
            }
            throw new McpError(
                ErrorCode.InternalError,
                `Audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Process raw vulnerability data into standardized format
     * @param auditData - Raw audit data from npm registry
     * @returns Array of processed vulnerabilities
     */
    private processVulnerabilities(auditData: any): Vulnerability[] {
        if (!auditData.advisories || Object.keys(auditData.advisories).length === 0) {
            return [];
        }

        const advisories = auditData.advisories;
        return Object.values(advisories).map((advisory: any) => ({
            name: advisory.module_name,
            version: advisory.vulnerable_versions,
            severity: advisory.severity,
            description: advisory.overview,
            recommendation: advisory.recommendation,
            fixAvailable: !!advisory.patched_versions,
            fixedVersion: advisory.patched_versions,
            githubAdvisoryId: advisory.github_advisory_id,
            updatedAt: advisory.updated,
            moreInfo: advisory.url
        }));
    }

    /**
     * Generate summary statistics for vulnerabilities
     * @param vulnerabilities - Array of processed vulnerabilities
     * @returns Summary object with counts by severity
     */
    private generateSummary(vulnerabilities: Vulnerability[]) {
        return {
            total: vulnerabilities.length,
            critical: vulnerabilities.filter(v => v.severity === 'critical').length,
            high: vulnerabilities.filter(v => v.severity === 'high').length,
            moderate: vulnerabilities.filter(v => v.severity === 'moderate').length,
            low: vulnerabilities.filter(v => v.severity === 'low').length
        };
    }
}
