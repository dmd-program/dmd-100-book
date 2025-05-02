import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const CONFIG_PATH = path.resolve(DOCS_DIR, '.vitepress/config.mjs');
const OUTPUT_DIR = path.resolve(DOCS_DIR, '.vitepress/dist/api');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'content-api.json');
const DEBUG = false; // Set to true for detailed logging

/**
 * Get the site title and description from the VitePress config file
 */
async function getSiteConfig() {
  try {
    // Read the config file content
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
    
    // Extract title using regex (simpler than parsing the module)
    const titleMatch = configContent.match(/title:\s*"([^"]+)"/);
    const descriptionMatch = configContent.match(/description:\s*"([^"]+)"/);
    
    return {
      title: titleMatch ? titleMatch[1] : 'DMD 100',
      description: descriptionMatch ? descriptionMatch[1] : 'Digital Multimedia Design Course Content'
    };
  } catch (error) {
    console.warn('Could not parse VitePress config file:', error.message);
    return {
      title: 'DMD 100',
      description: 'Digital Multimedia Design Course Content'
    };
  }
}

/**
 * Extract the first H1 heading from Markdown content
 * @param {string} content - Markdown content
 * @returns {string|null} - The heading text or null if not found
 */
function extractH1FromMarkdown(content) {
  // Match the first # heading (H1) in the markdown
  const h1Match = content.match(/^# (.*?)$/m);
  return h1Match ? h1Match[1].trim() : null;
}

/**
 * Clean up a title - remove .md extensions and transform slugs to readable text if needed
 * @param {string} title - The title to clean
 * @returns {string} - The cleaned title
 */
function cleanTitle(title) {
  // Remove .md extension if present
  title = title.replace(/\.md$/, '');
  
  // Replace hyphens and underscores with spaces if title looks like a slug
  if (title.includes('-') || title.includes('_')) {
    // Only transform if it looks like a slug (no capital letters or sentence structure)
    if (!/[A-Z]/.test(title) && !title.includes(' ')) {
      title = title
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        // Capitalize first letter of each word
        .replace(/(^|\s)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    }
  }
  
  return title;
}

async function generateApi() {
  console.log('Generating content API...');
  
  // Map to store page titles by path for cross-referencing
  const titleMap = new Map();

  try {
    // Get site title and description from VitePress config
    const siteConfig = await getSiteConfig();
    let bookTitle = siteConfig.title;
    let bookDescription = siteConfig.description;
    
    // Optional: Try to get more specific title from index.md if it exists
    const indexPath = path.resolve(DOCS_DIR, 'index.md');
    if (fs.existsSync(indexPath)) {
      try {
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        const { data: indexFrontmatter, content } = matter(indexContent);
        
        // If there's an H1 heading in the index.md, use it for a more specific title
        const h1Title = extractH1FromMarkdown(content);
        if (h1Title) {
          // Combine site title with more specific book title
          bookTitle = h1Title;
        }
      } catch (error) {
        console.warn('Could not parse index.md file:', error.message);
      }
    }

    // 1. Find all markdown files in the docs directory
    const mdFiles = await glob('**/*.md', { cwd: DOCS_DIR });

    // Store flat content data for reference
    const contentItems = [];

    // First pass - extract all titles and store in map for cross-referencing
    console.log('Extracting page titles...');
    for (const relativePath of mdFiles) {
      const absolutePath = path.resolve(DOCS_DIR, relativePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      // Get title - prioritize H1 heading, then frontmatter title, then filename
      let title = extractH1FromMarkdown(content);
      
      if (!title) {
        title = frontmatter.title;
      }
      
      if (!title) {
        // Clean up the filename - make sure to remove the .md extension
        const baseName = path.basename(relativePath, '.md');
        title = cleanTitle(baseName);
      }
      
      // Extra check - ensure no .md extension in any title
      if (typeof title === 'string') {
        title = title.replace(/\.md$/i, '');
      }
      
      // Store the title in our map
      titleMap.set(relativePath, title);
      
      if (DEBUG) {
        console.log(`Title for ${relativePath}: "${title}"`);
      }
    }

    // 2. Process each markdown file for content API
    console.log('Building content structure...');
    for (const relativePath of mdFiles) {
      // Skip the main index.md and LICENSE.md at the root if necessary
      if (relativePath === 'index.md' || relativePath === 'LICENSE.md') {
          continue;
      }
      
      const absolutePath = path.resolve(DOCS_DIR, relativePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const { data: frontmatter } = matter(fileContent);

      // 3. Determine the final URL path
      const urlPath = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '.html');
      
      // 4. Get the title from our map
      const title = titleMap.get(relativePath) || cleanTitle(path.basename(relativePath, '.md'));
      
      // 5. Structure the data
      contentItems.push({
        text: title,
        link: urlPath,
        relativePath: relativePath.replace(/\\/g, '/'),
        // Store path parts to help with building hierarchy later
        pathParts: relativePath.split(path.sep),
        // Include additional frontmatter if needed
        frontmatter: {
          ...frontmatter
        }
      });
    }

    // 6. Build hierarchy from flat list
    const hierarchy = buildHierarchy(contentItems, titleMap);

    // 7. Create the final API structure
    const apiData = {
      title: bookTitle,
      description: bookDescription,
      outline: hierarchy
    };

    // 8. Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 9. Write the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(apiData, null, 2));
    console.log(`Content API generated successfully at ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Error generating content API:', error);
    process.exit(1); // Exit with error code
  }
}

/**
 * Build a hierarchical structure from flat content items
 */
function buildHierarchy(items, titleMap) { // items should have clean titles now
  const rootItems = [];
  const lessonGroups = {};

  // --- Grouping logic --- 
  items.forEach(item => {
    const pathParts = item.pathParts;
    // Skip if not in a lesson folder or path is too short
    if (pathParts[0] !== 'lessons' || pathParts.length < 2) return;
    
    const lessonFolder = pathParts[1]; // e.g., "lesson-1"
    if (!lessonGroups[lessonFolder]) {
      // Initialize structure for the lesson
      lessonGroups[lessonFolder] = { intro: null, items: [], subgroups: {} };
    }

    // Check if it's an introduction file (e.g., /lessons/lesson-X/introduction-....md)
    if (pathParts.length === 3 && pathParts[2].startsWith('introduction-')) {
        lessonGroups[lessonFolder].intro = item; // Store the intro item object
    } 
    // Check if it belongs to a subgroup (e.g., /lessons/lesson-X/topics/....md)
    else if (pathParts.length > 3) {
        const subgroupName = pathParts[2]; // e.g., "topics"
        if (!lessonGroups[lessonFolder].subgroups[subgroupName]) {
            lessonGroups[lessonFolder].subgroups[subgroupName] = [];
        }
        lessonGroups[lessonFolder].subgroups[subgroupName].push(item);
    } 
    // Check if it's a direct child of the lesson folder (e.g., /lessons/lesson-X/some-file.md)
    else if (pathParts.length === 3) { 
        lessonGroups[lessonFolder].items.push(item);
    }
    // Note: Files directly in /lessons/ (like /lessons/readme.md) are ignored by this logic
  });

  // --- Hierarchy building logic --- 
  Object.keys(lessonGroups).sort().forEach(lessonKey => {
    const lessonGroup = lessonGroups[lessonKey];

    // ALWAYS create the lesson node based on the lessonKey (e.g., "lesson-1" -> "Lesson 1")
    const lessonNode = {
      text: formatLessonName(lessonKey), 
      link: "", // Top-level lesson group doesn't link directly
      items: [] // Initialize items array
    };

    // 1. Add the intro page first, if it exists
    if (lessonGroup.intro) {
      // Title should be clean from the map, link is correct
      lessonNode.items.push({
        text: lessonGroup.intro.text || 'Introduction', // Use pre-cleaned text, fallback
        link: lessonGroup.intro.link
      });
    }

    // 2. Add other direct items (these are files directly under /lessons/lesson-X/)
    lessonGroup.items.forEach(item => {
       // Ensure we don't add the intro item again if it was somehow grouped here
       if (item !== lessonGroup.intro) {
           lessonNode.items.push({
               text: item.text || 'Missing Title', // Use pre-cleaned text
               link: item.link
           });
       }
    });

    // 3. Add subgroups (Topics, Readings, Projects, etc.)
    Object.keys(lessonGroup.subgroups).sort().forEach(subgroupKey => {
      const subgroupItems = lessonGroup.subgroups[subgroupKey];
      if (subgroupItems.length > 0) {
        const subgroupNode = {
          text: formatGroupName(subgroupKey), // Format subgroup name (e.g., "topics" -> "Topics")
          items: []
        };
        
        // Sort items within the subgroup
        subgroupItems
          .sort((a, b) => {
            // ... existing sort logic ...
            const aMatch = a.text.match(/^(\d+)\.\s/);
            const bMatch = b.text.match(/^(\d+)\.\s/);
            if (aMatch && bMatch) {
              return parseInt(aMatch[1]) - parseInt(bMatch[1]);
            }
            return a.text.localeCompare(b.text);
          })
          .forEach(item => {
            subgroupNode.items.push({
              text: item.text || 'Missing Title', // Use pre-cleaned text
              link: item.link
            });
          });
        lessonNode.items.push(subgroupNode); // Add the populated subgroup node
      }
    });

    // Only add the lesson node to the final list if it actually contains items
    if (lessonNode.items.length > 0) {
        rootItems.push(lessonNode);
    }
  });

  return rootItems;
}

/**
 * Format group name from folder name (e.g., "topics" -> "Topics")
 */
function formatGroupName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
}

/**
 * Format lesson name from folder (e.g., "lesson-1" -> "Lesson 1")
 */
function formatLessonName(name) {
  return name.replace(/-/g, ' ').replace(/(^|\s)([a-z])/g, function(match, p1, p2) {
    return p1 + p2.toUpperCase();
  });
}

generateApi();
