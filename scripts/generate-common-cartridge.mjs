import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import MarkdownIt from 'markdown-it';
import { create } from 'xmlbuilder2';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Configuration ---
const projectRoot = path.resolve(__dirname, '..'); // Assumes script is in vitepress-dmd-100/scripts
const configPath = path.join(projectRoot, 'docs/.vitepress/config.mjs');
const docsRoot = path.join(projectRoot, 'docs');
const outputFileName = 'common-cartridge-export.imscc';
const outputPath = path.join(projectRoot, outputFileName);
const courseIdentifier = 'DMD100_Course'; // Unique identifier for the course
const organizationIdentifier = 'DMD100_Organization'; // Unique identifier for the organization structure
// --- End Configuration ---

const md = new MarkdownIt();

// Helper function to generate unique identifiers
let idCounter = 0;
function generateIdentifier(prefix = 'resource') {
  return `${prefix}_${Date.now()}_${idCounter++}`;
}

// Function to extract H1 title from Markdown content
function extractH1Title(markdownContent) {
  const tokens = md.parse(markdownContent, {});
  const h1Token = tokens.find(token => token.type === 'heading_open' && token.tag === 'h1');
  if (h1Token) {
    const inlineToken = tokens[tokens.indexOf(h1Token) + 1];
    if (inlineToken && inlineToken.type === 'inline') {
      return inlineToken.content.trim();
    }
  }
  return 'Untitled Page'; // Default title if H1 not found
}

// Function to find the Markdown file path from a VitePress link
async function findMarkdownFile(link) {
    if (!link || !link.startsWith('/')) return null;

    // Remove leading slash and potential .html extension
    const baseLink = link.replace(/^\//, '').replace(/\.html$/, '');
    const potentialPath = path.join(docsRoot, `${baseLink}.md`);

    try {
        await fs.access(potentialPath);
        return potentialPath;
    } catch (error) {
        // Handle cases like index pages (e.g., /lessons/ becomes /lessons/index.md)
        const potentialIndexPath = path.join(docsRoot, baseLink, 'index.md');
         try {
            await fs.access(potentialIndexPath);
            return potentialIndexPath;
         } catch (indexError) {
            console.warn(`Markdown file not found for link: ${link} (tried ${potentialPath} and ${potentialIndexPath})`);
            return null;
         }
    }
}


async function generateCommonCartridge() {
  console.log('Starting Common Cartridge generation...');

  // Dynamically import the ESM config
  const configModule = await import(configPath);
  const config = configModule.default;

  if (!config || !config.themeConfig || !config.themeConfig.sidebar) {
    console.error('Error: Could not load sidebar configuration from', configPath);
    return;
  }

  if (!config.base) {
      console.error('Error: `base` URL is not defined in VitePress config.');
      return;
  }

  const sidebar = config.themeConfig.sidebar;
  const baseUrl = config.siteUrl && config.base ? `${config.siteUrl}${config.base}` : `https://dmd-program.github.io${config.base}`; // Fallback just in case siteUrl isn't set

  const manifest = {
    manifest: {
      '@xmlns': 'http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1',
      '@xmlns:lom': 'http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest',
      '@xmlns:lomimscc': 'http://www.imsglobal.org/xsd/imsccv1p1/LOM/extension',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:schemaLocation': 'http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/ccv1p1_imscp_v1p1_v1p0.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lommanifest_v1p0.xsd http://www.imsglobal.org/xsd/imsccv1p1/LOM/extension http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lomextension_v1p0.xsd',
      '@identifier': courseIdentifier,
      metadata: {
        schema: 'IMS Common Cartridge',
        schemaversion: '1.1.0',
        'lom:lom': {
          '@xmlns': 'http://ltsc.ieee.org/xsd/imsccv1p1/LOM/manifest',
          'lom:general': {
            'lom:title': { 'lom:string': config.title || 'VitePress Course' },
            'lom:description': { 'lom:string': config.description || 'Course content exported from VitePress' }
          },
          'lom:rights': {
             'lom:copyrightAndOtherRestrictions': { 'lom:value': 'yes' }, // Assuming copyrighted unless specified otherwise
             'lom:description': { 'lom:string': `Default license: ${config.themeConfig.license || 'cc-by'}. Check individual pages for specific licenses.` }
          }
          // Add more LOM metadata if needed (e.g., author, version)
        }
      },
      organizations: {
        organization: {
          '@identifier': organizationIdentifier,
          '@structure': 'rooted-hierarchy',
          title: config.title || 'Course Structure',
          item: [] // Top-level items (modules) will be added here
        }
      },
      resources: {
        // Resource definitions will be added here
      }
    }
  };

  const resources = manifest.manifest.resources;
  const organizationItems = manifest.manifest.organizations.organization.item;

  // Store web link XML file contents to be added to the zip
  const resourceXmlFiles = {};

  // Process sidebar items
  for (const section of sidebar) {
    if (section.items && section.text) { // Treat collapsible sections as modules
      const moduleIdentifier = generateIdentifier('module');
      const moduleItem = {
        '@identifier': moduleIdentifier,
        title: section.text,
        item: []
      };
      organizationItems.push(moduleItem);

      // Recursively process items within the section
      await processSidebarItems(section.items, moduleItem.item, resources, baseUrl, docsRoot);

    } else if (section.link && section.text) { // Treat top-level links as direct items if needed
        await processSingleLink(section, organizationItems, resources, baseUrl, docsRoot);
    }
  }

  // Function to recursively process sidebar items and add them to the manifest
  async function processSidebarItems(items, parentItemArray, resourcesNode, baseUrl, docsRoot) {
    for (const item of items) {
      if (item.link && item.text) {
         await processSingleLink(item, parentItemArray, resourcesNode, baseUrl, docsRoot);
      } else if (item.items && item.text) { // Handle nested collapsible sections (sub-modules/folders)
        const subFolderIdentifier = generateIdentifier('folder');
        const subFolderItem = {
          '@identifier': subFolderIdentifier,
          title: item.text,
          item: []
        };
        parentItemArray.push(subFolderItem);
        await processSidebarItems(item.items, subFolderItem.item, resourcesNode, baseUrl, docsRoot);
      }
    }
  }

  // Function to process a single link item
  async function processSingleLink(item, parentItemArray, resourcesNode, baseUrl, docsRoot) {
      const markdownPath = await findMarkdownFile(item.link);
      let pageTitle = item.text; // Use sidebar text as fallback

      if (markdownPath) {
          try {
              const content = await fs.readFile(markdownPath, 'utf-8');
              pageTitle = extractH1Title(content) || item.text; // Use H1 or fallback to sidebar text
          } catch (err) {
              console.warn(`Warning: Could not read file ${markdownPath} for title extraction. Using sidebar text "${item.text}". Error: ${err.message}`);
          }
      } else {
          console.warn(`Warning: Could not find Markdown file for link: ${item.link}. Using sidebar text "${item.text}" as title.`);
      }

      const resourceIdentifier = generateIdentifier('resource_weblink');
      const itemIdentifier = generateIdentifier('item');
      const embedUrl = `${baseUrl}${item.link.replace(/^\//, '').replace(/\.md$/, '.html')}?embed=true`;

      // Add resource definition
      resourcesNode.resource = resourcesNode.resource || []; // Ensure array exists
      resourcesNode.resource.push({
          '@identifier': resourceIdentifier,
          '@type': 'imswl_xmlv1p1', // Web Link type
          '@href': `Resources/${resourceIdentifier}.xml`, // Pointer to the XML file defining the web link
          file: {
              '@href': `Resources/${resourceIdentifier}.xml`
          }
      });

      // Add item to organization
      parentItemArray.push({
          '@identifier': itemIdentifier,
          '@identifierref': resourceIdentifier,
          title: pageTitle
      });

      // Create the separate XML file for the web link resource
      const webLinkXml = create({ version: '1.0', encoding: 'UTF-8' })
          .ele('webLink', {
              'xmlns': 'http://www.imsglobal.org/xsd/imswl_v1p1',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              'xsi:schemaLocation': 'http://www.imsglobal.org/xsd/imswl_v1p1 http://www.imsglobal.org/profile/cc/ccv1p1/imswl_v1p1.xsd', // Correct schema location
              'identifier': resourceIdentifier // Added identifier attribute
          })
          .ele('title').txt(pageTitle).up()
          .ele('url', { href: embedUrl })
          .end({ prettyPrint: true });


      // Add this XML content to the zip package later
      resourceXmlFiles[resourceIdentifier] = webLinkXml;
  }


  // Build the final imsmanifest.xml content
  const manifestXml = create({ version: '1.0', encoding: 'UTF-8' }, manifest).end({ prettyPrint: true });

  // Create the zip file (IMSCC package)
  const zip = new JSZip();
  zip.file('imsmanifest.xml', manifestXml);

  // Add the individual web link XML files into a 'Resources' folder within the zip
  const resourcesFolder = zip.folder("Resources");
  for (const [identifier, xmlContent] of Object.entries(resourceXmlFiles)) {
      resourcesFolder.file(`${identifier}.xml`, xmlContent);
  }


  // Write the zip file
  const zipContent = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
          level: 9
      }
  });

  await fs.writeFile(outputPath, zipContent);

  console.log(`✅ Common Cartridge package generated successfully at: ${outputPath}`);
}

generateCommonCartridge().catch(error => {
  console.error('❌ Error generating Common Cartridge package:', error);
  process.exit(1);
});

