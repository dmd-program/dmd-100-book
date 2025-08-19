const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Import node-fetch

// --- Configuration ---
// Note: Paths are now calculated relative to the script's location
const outputCsvFile = 'external_links_report.csv'; // Output file name
const urlPattern = /https?:\/\/[^\s\"'`\)\]]+/g; // Regex to find URLs
const requestTimeout = 5000; // Timeout for checking URLs in milliseconds (e.g., 5000 = 5 seconds)
const concurrentChecks = 10; // How many URLs to check simultaneously

// GitHub repository configuration for generating links
const githubRepo = 'dmd-program/dmd-100-book'; // GitHub owner/repo
const githubBranch = 'main'; // Default branch name
// --- End Configuration ---

const scriptDir = __dirname;
const vitepressDir = path.resolve(scriptDir, '..'); // Assumes script is in vitepress-dmd-100/scripts
const workspaceRoot = path.resolve(vitepressDir, '..'); // Assumes vitepress-dmd-100 is in workspace root
const fullSearchPath = path.join(vitepressDir, 'docs'); // Search within the vitepress docs folder

// Change the output path to be in the project folder (vitepressDir) instead of workspace root
const outputCsvPath = path.join(vitepressDir, outputCsvFile); // Output to the project root

const foundLinks = []; // Stores { url, filePath, line }

console.log(`Script location: ${scriptDir}`);
console.log(`Workspace root: ${workspaceRoot}`);
console.log(`Searching for markdown files in: ${fullSearchPath}`);

// Recursive function to walk through directories
function walkDir(dir) {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        console.error(`Error reading directory ${dir}: ${err}`);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDir(filePath); // Recurse into subdirectories
        } else if (stat.isFile() && file.endsWith('.md')) {
            const relativeFilePath = path.relative(vitepressDir, filePath); // Keep path relative to project root for report
            // console.log(`Scanning: ${relativeFilePath}`); // Less verbose during check
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const lines = content.split('\n');
                lines.forEach((lineContent, index) => {
                    let match;
                    while ((match = urlPattern.exec(lineContent)) !== null) {
                        const url = match[0];
                        // Basic check to avoid markdown image syntax false positives like ![alt](http...)
                        if (!(lineContent.trim().startsWith('![') && lineContent.includes(url))) {
                             // Avoid adding duplicates if the same URL appears multiple times
                            if (!foundLinks.some(link => link.url === url)) {
                                foundLinks.push({ url, filePath: relativeFilePath, line: index + 1 });
                            }
                        }
                    }
                });
            } catch (err) {
                console.error(`Error reading file ${relativeFilePath}: ${err}`);
            }
        }
    });
}

// Function to check URL status
async function checkUrlStatus(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD', // Use HEAD request to be faster and lighter
            timeout: requestTimeout,
            headers: { // Add a basic user agent
                'User-Agent': 'Node.js Link Checker Script'
            },
            redirect: 'manual' // Handle redirects manually if needed, or follow them
        });

        if (response.ok) { // Status 200-299
            return 'OK';
        } else if (response.status >= 300 && response.status < 400) {
             // Could follow redirect here if desired: fetch(response.headers.get('location'))
            return `Redirect (${response.status})`;
        } else if (response.status === 404) {
            return 'Not Found (404)';
        } else {
            return `Client/Server Error (${response.status})`;
        }
    } catch (error) {
        // console.error(`Error checking ${url}: ${error.message}`);
         if (error.type === 'request-timeout') {
            return 'Timeout';
        }
        return 'Error (Network/DNS)'; // General network/fetch error
    }
}

// --- Main Execution ---

// 1. Find all unique links first
walkDir(fullSearchPath);
console.log(`\nFound ${foundLinks.length} unique external links. Now checking status...`);

// 2. Check link status concurrently
const linksWithStatus = []; // Stores [url, filePath, line, status]
(async () => {
    const promises = [];
    for (let i = 0; i < foundLinks.length; i++) {
        const link = foundLinks[i];
        // Add the promise to the list
        promises.push(
            checkUrlStatus(link.url).then(status => {
                // Store the result with original location info
                linksWithStatus.push([link.url, link.filePath, link.line, status]);
                 // Log progress
                process.stdout.write(`\rChecked ${linksWithStatus.length}/${foundLinks.length} links...`);
            })
        );

        // If we've reached the concurrency limit or the end of the list, wait for promises
        if (promises.length >= concurrentChecks || i === foundLinks.length - 1) {
            await Promise.all(promises);
            promises.length = 0; // Clear the promises array for the next batch
        }
    }
    process.stdout.write('\n'); // New line after progress indicator

    // 3. Write to CSV
    if (linksWithStatus.length > 0) {
        try {
            // Sort by file path, then line number for consistency
            linksWithStatus.sort((a, b) => {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return a[2] - b[2]; // Sort by line number if paths are the same
            });

            const header = 'URL,FilePath,LineNumber,Status\n'; // Added Status column
            const rows = linksWithStatus.map(link => {
                // Basic CSV escaping: double quotes around fields containing commas or quotes
                return link.map((field, index) => {
                    const fieldStr = String(field);
                    
                    // For the FilePath column (index 1), create a clickable GitHub link with line number
                    if (index === 1) {
                        const lineNumber = link[2]; // Get line number from the link array
                        // Create GitHub URL to the specific line in the file
                        const githubUrl = `https://github.com/${githubRepo}/blob/${githubBranch}/${fieldStr}#L${lineNumber}`;
                        
                        // Return the GitHub URL, properly escaped for CSV
                        if (githubUrl.includes(',') || githubUrl.includes('"') || githubUrl.includes('\n')) {
                            return `"${githubUrl.replace(/"/g, '""')}"`;
                        }
                        return githubUrl;
                    }
                    
                    // For other fields, use normal CSV escaping
                    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                        return `"${fieldStr.replace(/"/g, '""')}"`;
                    }
                    return fieldStr;
                }).join(',');
            }).join('\n');

            const csvContent = header + rows;
            fs.writeFileSync(outputCsvPath, csvContent, 'utf-8');
            console.log(`Report saved to: ${outputCsvPath}`);
        } catch (err) {
            console.error(`Error writing CSV file ${outputCsvPath}: ${err}`);
        }
    } else {
        console.log("No external links found to check.");
    }
})(); // Immediately invoke the async function
