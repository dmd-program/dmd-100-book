import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

const DOCS_DIR = path.resolve(process.cwd(), 'docs');
const OUTPUT_DIR = path.resolve(DOCS_DIR, '.vitepress/dist/api');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'content-api.json');

async function generateApi() {
  console.log('Generating content API...');

  try {
    // 1. Find all markdown files in the lessons directory
    const mdFiles = await glob('lessons/**/*.md', { cwd: DOCS_DIR });

    const contentData = [];

    // 2. Process each markdown file
    for (const relativePath of mdFiles) {
      const absolutePath = path.resolve(DOCS_DIR, relativePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      // 3. Determine the final URL path
      // Example: lessons/lesson-1/topic.md -> /lessons/lesson-1/topic.html
      const urlPath = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '.html'); // Corrected regex

      // 4. Structure the data (customize as needed)
      contentData.push({
        title: frontmatter.title || path.basename(relativePath, '.md'), // Use frontmatter title or filename
        path: urlPath,
        relativePath: relativePath.replace(/\\/g, '/'), // Corrected regex
        // Add other frontmatter fields if needed
        // rawContent: content, // Optionally include raw markdown content
        // htmlContent: await convertMarkdownToHtml(content), // Optionally convert to HTML
      });
    }

    // 5. Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 6. Write the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contentData, null, 2));

    console.log(`Content API generated successfully at ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Error generating content API:', error);
    process.exit(1); // Exit with error code
  }
}

// Optional: Function to convert markdown to HTML if needed
// async function convertMarkdownToHtml(markdown) {
//   // You might need to install and configure markdown-it or another parser
//   // const md = require('markdown-it')();
//   // return md.render(markdown);
//   return ''; // Placeholder
// }

generateApi();
