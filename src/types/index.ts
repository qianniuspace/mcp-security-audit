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
 * Represents a map of package names to their versions
 */
export interface NpmDependencies {
    [key: string]: string;  // Package name -> version mapping
}

