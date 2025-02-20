/**
 * Type definitions for the security audit system
 */

/**
 * Represents a single security vulnerability
 */
export interface Vulnerability {
    name: string;              // Package name
    version: string;           // Affected version range
    severity: string;          // Severity level (critical, high, moderate, low)
    description: string;       // Detailed description of the vulnerability
    recommendation: string;    // Recommended action to fix the vulnerability
    fixAvailable: boolean;     // Whether a fix is available
    fixedVersion?: string;     // Version that fixes the vulnerability
    // references: string[];
    githubAdvisoryId?: string; // GitHub Security Advisory ID
    updatedAt?: string;        // Last update timestamp
    cvss?: {                   // Common Vulnerability Scoring System
        score: number;
        vector: string;
    };
    cwe?: string[];           // Common Weakness Enumeration identifiers
    url?: string;             // URL for more information
}

/**
 * Represents the complete result of a security audit
 */
export interface AuditResult {
    vulnerabilities: Vulnerability[];  // List of found vulnerabilities
    summary: {                        // Summary statistics
        total: number;                // Total number of vulnerabilities
        critical: number;             // Number of critical vulnerabilities
        high: number;                 // Number of high severity vulnerabilities
        moderate: number;             // Number of moderate severity vulnerabilities
        low: number;                  // Number of low severity vulnerabilities
    };
    metadata: {                       // Audit metadata
        timestamp: string;            // When the audit was performed
        packageManager: string;       // Package manager used (npm)
        projectName?: string;         // Name of the audited project
        content?: DependencyContent[]; // List of audited dependencies
    };
}

/**
 * Represents a map of package names to their versions
 */
export interface NpmDependencies {
    [key: string]: string;  // Package name -> version mapping
}

/**
 * Represents a single dependency with its version
 */
export interface DependencyContent {
    name: string;     // Package name
    version: string;  // Package version
}

/**
 * Represents a request to perform a security audit
 */
export interface AuditRequest {
    dependencies: NpmDependencies;      // Dependencies to audit
    content?: DependencyContent[];      // Optional detailed dependency information
}