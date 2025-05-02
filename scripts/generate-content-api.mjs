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
    // Get book title and description from the main index.md
    const indexPath = path.resolve(DOCS_DIR, 'index.md');
    let bookTitle = 'DMD 100: Digital Multimedia Design';
    let bookDescription = 'Digital Multimedia Design 100 Course Content';
    
    if (fs.existsSync(indexPath)) {
      try {
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        const { data: indexFrontmatter, content } = matter(indexContent);
        
        // Use frontmatter title and description if available
        if (indexFrontmatter.title) bookTitle = indexFrontmatter.title;
        if (indexFrontmatter.description) bookDescription = indexFrontmatter.description;
      } catch (error) {
        console.warn('Could not parse index.md file:', error.message);
      }
    }

    // 1. Find all markdown files in the lessons directory
    const mdFiles = await glob('lessons/**/*.md', { cwd: DOCS_DIR });

    // Store flat content data for reference
    const contentItems = [];

    // 2. Process each markdown file
    for (const relativePath of mdFiles) {
      const absolutePath = path.resolve(DOCS_DIR, relativePath);
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      // 3. Determine the final URL path
      // Example: lessons/lesson-1/topic.md -> /lessons/lesson-1/topic.html
      const urlPath = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '.html');
      
      // 4. Structure the data
      contentItems.push({
        text: frontmatter.title || path.basename(relativePath, '.md'),
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

    // 5. Build hierarchy from flat list
    const hierarchy = buildHierarchy(contentItems);

    // 6. Create the final API structure
    const apiData = {
      title: bookTitle,
      description: bookDescription,
      outline: hierarchy
    };

    // 7. Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 8. Write the JSON file
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
function buildHierarchy(items) {
  const rootItems = [];
  
  // Group by lesson
  const lessonGroups = {};
  
  items.forEach(item => {
    const pathParts = item.pathParts;
    
    // Skip if not in a lesson folder
    if (pathParts[0] !== 'lessons' || pathParts.length < 2) {
      return;
    }
    
    // Extract lesson folder (e.g., "lesson-1")
    const lessonFolder = pathParts[1];
    
    if (!lessonGroups[lessonFolder]) {
      lessonGroups[lessonFolder] = {
        items: [],
        subgroups: {}
      };
    }
    
    // If this is the lesson introduction file, use it as the parent
    if (pathParts.length === 3 && pathParts[2].includes('introduction-')) {
      lessonGroups[lessonFolder].intro = item;
    } 
    // Group items by their subfolder (topics, projects, etc.)
    else if (pathParts.length > 3) {
      const subgroupName = pathParts[2];
      
      if (!lessonGroups[lessonFolder].subgroups[subgroupName]) {
        lessonGroups[lessonFolder].subgroups[subgroupName] = [];
      }
      
      lessonGroups[lessonFolder].subgroups[subgroupName].push(item);
    } 
    // Direct lesson children
    else {
      lessonGroups[lessonFolder].items.push(item);
    }
  });
  
  // Convert groups to hierarchical structure
  Object.keys(lessonGroups).sort().forEach(lessonKey => {
    const lessonGroup = lessonGroups[lessonKey];
    const lessonNode = lessonGroup.intro || {
      text: formatLessonName(lessonKey),
      link: ''
    };
    
    // Process items directly under the lesson
    if (!lessonNode.items) {
      lessonNode.items = [];
    }
    
    lessonGroup.items.forEach(item => {
      if (item !== lessonGroup.intro) {
        lessonNode.items.push({
          text: item.text,
          link: item.link
        });
      }
    });
    
    // Process subgroups (topics, projects, etc.)
    Object.keys(lessonGroup.subgroups).sort().forEach(subgroupKey => {
      const subgroupItems = lessonGroup.subgroups[subgroupKey];
      
      if (subgroupItems.length > 0) {
        const subgroupNode = {
          text: formatGroupName(subgroupKey),
          items: []
        };
        
        // Sort items alphabetically by path
        subgroupItems
          .sort((a, b) => a.link.localeCompare(b.link))
          .forEach(item => {
            subgroupNode.items.push({
              text: item.text,
              link: item.link
            });
          });
        
        lessonNode.items.push(subgroupNode);
      }
    });
    
    rootItems.push(lessonNode);
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
