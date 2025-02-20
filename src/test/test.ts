import npmFetch from 'npm-registry-fetch';
import { SecurityAuditHandler } from '../handlers/security.js';
import * as path from 'path';
import * as fs from 'fs';

async function testNpmRegistry() {
    try {
        // 测试 1: Registry 连接和完整响应
        // console.log('Test 1: Testing npm registry connection and full response...');
        // const pingResponse = await npmFetch.json('/-/ping');
        // console.log('Registry connection:', pingResponse ? 'OK' : 'Failed');
        // console.log('Full ping response:', JSON.stringify(pingResponse, null, 2));

        // 测试 2: 单个依赖审计（已知漏洞版本）- 完整响应
        console.log('\nTest 2: Testing single dependency audit with full response...');
        const handler = new SecurityAuditHandler();
        const singleDep = {
            // 'lodash': '4.17.1',     // 多个已知漏洞
            // '@modelcontextprotocol/sdk': '1.5.0',   
            "next": "14.2.17"
        };

        console.log('\nSending audit requests for single dependencies:');
        for (const [name, version] of Object.entries(singleDep)) {
            console.log(`\nAuditing ${name}@${version}`);
            const auditData = {
                name: "single-dependency-audit",
                version: "1.0.0",
                requires: { [name]: version },
                dependencies: {
                    [name]: { version: version.replace('^', '') }
                }
            };
            console.log('Request data:', JSON.stringify(auditData, null, 2));
            
            try {
                const response = await npmFetch.json('/-/npm/v1/security/audits', {
                    method: 'POST',
                    body: auditData,
                    gzip: true
                });
                console.log('Full API Response:', JSON.stringify(response, null, 2));
            } catch (error) {
                console.error(`Error auditing ${name}:`, error);
            }
        }

        // const singleAuditResult = await handler.auditDependencies({ 
        //     dependencies: singleDep,
        //     level: 'low'
        // });

        // console.log('\nProcessed Single Dependency Results:');
        // console.log(JSON.stringify(singleAuditResult, null, 2));

        // // 测试 3: 多个依赖审计 - 完整响应
        // console.log('\nTest 3: Testing multiple dependencies audit with full response...');
        // const multipleDeps = {
        //     'lodash': '4.17.1',
        //     'express': '4.0.0',
        //     'moment': '2.0.0'
        // };

        // console.log('\nSending audit requests for multiple dependencies:');
        // for (const [name, version] of Object.entries(multipleDeps)) {
        //     console.log(`\nAuditing ${name}@${version}`);
        //     const auditData = {
        //         name: "multiple-dependencies-audit",
        //         version: "1.0.0",
        //         requires: { [name]: version },
        //         dependencies: {
        //             [name]: { version: version.replace('^', '') }
        //         }
        //     };
        //     console.log('Request data:', JSON.stringify(auditData, null, 2));
            
        //     try {
        //         const response = await npmFetch.json('/-/npm/v1/security/audits', {
        //             method: 'POST',
        //             body: auditData,
        //             gzip: true
        //         });
        //         console.log('Full API Response:', JSON.stringify(response, null, 2));
        //     } catch (error) {
        //         console.error(`Error auditing ${name}:`, error);
        //     }
        // }

        // const multipleAuditResult = await handler.auditDependencies({ 
        //     dependencies: multipleDeps,
        //     level: 'low'
        // });

        // console.log('\nProcessed Multiple Dependencies Results:');
        // console.log(JSON.stringify(multipleAuditResult, null, 2));


        // 测试 lodash 4.17.1 的漏洞
        // console.log('\nTesting lodash@4.17.1 vulnerabilities...');
        // const handler = new SecurityAuditHandler();
        // const dependencies = {
        //     "@ai-sdk/deepseek": "^0.1.0"  // 已知有漏洞的版本
        // };

        // try {
        //     const result = await handler.auditDependencies({ dependencies });
            
        //     console.log('\nAudit Summary:');
        //     console.log(JSON.stringify(result, null, 2));

            

        // } catch (error) {
        //     console.error('Error during audit:', error);
        // }

    } catch (error) {
        console.error('Test failed:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Full error:', error);
        process.exit(1);
    }
}

// 运行测试
console.log('Starting tests...\n');
testNpmRegistry().catch(error => {
    console.error('Test execution failed:', error);
    console.error('Full error details:', error);
    process.exit(1);
}); 