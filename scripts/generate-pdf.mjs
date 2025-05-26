import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'docs/.vitepress/dist');
const pdfOutputPath = path.join(distDir, 'dmd-100-complete-book.pdf');

console.log('🔄 Generating comprehensive PDF from built site...');

async function generateComprehensivePDF() {
  try {
    // Check if dist directory exists
    if (!fs.existsSync(distDir)) {
      console.error('❌ Dist directory not found. Please run build first.');
      process.exit(1);
    }

    console.log('📖 Generating comprehensive course PDF...');
    
    // Create a comprehensive puppeteer script
    const puppeteerScript = `
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const baseUrl = 'file://${distDir.replace(/\\/g, '/')}/';
  
  // Key pages to include in the PDF (in order)
  const pages = [
    'index.html',
    'introduction/about-this-course.html',
    'introduction/digital_multimedia_design.html',
    'introduction/learning-objectives.html',
    'introduction/projects.html',
    'lessons/introduction-what-is-design.html',
    'lessons/introduction-visual-and-interaction-design.html', 
    'lessons/introduction-storytelling.html',
    'lessons/introduction-open-design.html',
    'lessons/introduction-self-design.html'
  ];
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  // Add global CSS for all pages
  const globalCSS = \`
    .VPNav, .VPSidebar, .edit-link, .outline, .VPDocAsideOutline,
    .vp-doc-footer, .prev-next, .edit-link-button { 
      display: none !important; 
    }
    .VPContent { 
      padding-left: 0 !important; 
      max-width: 100% !important;
      margin: 0 !important;
    }
    .content, .vp-doc {
      max-width: 100% !important;
      padding: 0 !important;
    }
    body { 
      font-size: 14px; 
      line-height: 1.6; 
      color: #000;
      margin: 0;
      padding: 20px;
    }
    a { 
      color: #000 !important; 
      text-decoration: underline;
    }
    h1 { 
      page-break-before: always;
      margin-top: 2rem;
      font-size: 28px;
      border-bottom: 2px solid #eee;
      padding-bottom: 0.5rem;
    }
    h1:first-of-type {
      page-break-before: auto;
    }
    h2 {
      font-size: 22px;
      margin-top: 1.5rem;
      color: #333;
    }
    h3 {
      font-size: 18px;
      margin-top: 1rem;
      color: #555;
    }
    pre, code { 
      background: #f8f8f8 !important;
      border: 1px solid #ddd;
      padding: 0.5rem;
      font-size: 12px;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    table th, table td {
      border: 1px solid #ddd;
      padding: 0.5rem;
      text-align: left;
    }
    table th {
      background: #f5f5f5;
      font-weight: bold;
    }
  \`;
  
  let htmlContent = '';
  
  // Process each page
  for (const pagePath of pages) {
    const pageUrl = baseUrl + pagePath;
    console.log(\`Processing: \${pagePath}\`);
    
    try {
      await page.goto(pageUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Extract main content
      const content = await page.evaluate(() => {
        const main = document.querySelector('.vp-doc, .content, main');
        return main ? main.innerHTML : document.body.innerHTML;
      });
      
      // Add page break and content
      htmlContent += \`
        <div class="page-content">
          \${content}
        </div>
      \`;
      
    } catch (error) {
      console.warn(\`Warning: Could not process \${pagePath}\`);
    }
  }
  
  // Create a single comprehensive HTML page
  const fullHTML = \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>DMD 100: Digital Multimedia Design Foundations - Complete Course</title>
      <style>\${globalCSS}</style>
    </head>
    <body>
      <div class="cover-page">
        <h1 style="page-break-before: auto; text-align: center; margin-top: 3rem;">
          DMD 100: Digital Multimedia Design Foundations
        </h1>
        <p style="text-align: center; font-size: 18px; margin-top: 2rem;">
          Complete Course Guide
        </p>
        <p style="text-align: center; margin-top: 2rem;">
          Generated on: \${new Date().toLocaleDateString()}
        </p>
      </div>
      \${htmlContent}
    </body>
    </html>
  \`;
  
  // Load the combined content
  await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
  
  // Generate PDF
  await page.pdf({
    path: '${pdfOutputPath.replace(/\\/g, '/')}',
    format: 'A4',
    margin: {
      top: '25mm',
      right: '20mm',
      bottom: '25mm',
      left: '20mm'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:9px; width:100%; text-align:center; margin: 0 auto; color: #666;">DMD 100: Digital Multimedia Design Foundations</div>',
    footerTemplate: '<div style="font-size:9px; width:100%; text-align:center; margin: 0 auto; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    preferCSSPageSize: false,
    scale: 0.85
  });
  
  await browser.close();
  console.log('✅ Comprehensive PDF generated successfully');
})().catch(console.error);
`;

    // Write the script temporarily
    const tempScript = path.join(projectRoot, 'temp-pdf-generator.js');
    fs.writeFileSync(tempScript, puppeteerScript);

    try {
      // Install puppeteer if not already installed
      console.log('📦 Checking puppeteer installation...');
      execSync('npm list puppeteer', { stdio: 'pipe', cwd: projectRoot });
      
      // Run the puppeteer script
      console.log('🚀 Running comprehensive PDF generation...');
      execSync(`node ${tempScript}`, { stdio: 'inherit', cwd: projectRoot });
      
      // Clean up
      fs.unlinkSync(tempScript);
      
      if (fs.existsSync(pdfOutputPath)) {
        const stats = fs.statSync(pdfOutputPath);
        console.log(`📊 PDF size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📍 PDF location: ${pdfOutputPath}`);
        console.log(`🌐 PDF will be accessible at: /dmd-100-book/dmd-100-complete-book.pdf`);
      } else {
        console.error('❌ PDF generation failed - file not created');
        process.exit(1);
      }
      
    } catch (scriptError) {
      // Clean up temp file
      if (fs.existsSync(tempScript)) {
        fs.unlinkSync(tempScript);
      }
      throw scriptError;
    }

  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  }
}

generateComprehensivePDF();
