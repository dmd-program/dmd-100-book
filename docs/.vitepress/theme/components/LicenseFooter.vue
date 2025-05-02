<template>
  <div class="license-footer" v-if="shouldShowLicense">
    <details class="custom-block details">
      <summary>License</summary>
      
      <div class="license-section">
        <!-- Page-specific license with RDFa attributes -->
        <p v-if="showPageLicense" class="license-text" 
           v-bind:attr="{ prefix: 'cc: http://creativecommons.org/ns# dc: http://purl.org/dc/terms/ schema: https://schema.org/' }"
           typeof="schema:CreativeWork cc:Work">
          This work, 
          <template v-if="shouldShowWorkLink">
            <a :href="workLinkUrl" property="schema:url dc:source">"{{ pageTitle }}"</a>
          </template>
          <template v-else>
            <span property="schema:name">"{{ pageTitle }}"</span>
          </template>, 
          by <span property="schema:author dc:creator">{{ pageAuthor }}</span> is licensed under 
          <a :href="licenseUrl" rel="license" property="cc:license schema:license">{{ licenseName }}</a>.
        </p>
        
        <!-- Entire work license with RDFa attributes -->
        <p v-if="showSitewideLicense" class="license-text"
           v-bind:attr="{ prefix: 'cc: http://creativecommons.org/ns# dc: http://purl.org/dc/terms/ schema: https://schema.org/' }"
           typeof="schema:CreativeWork cc:Work">
          The entire work, <a :href="workUrl" property="schema:url dc:source">"{{ workTitle }}"</a>, 
          by <span property="schema:author dc:creator">{{ workAuthor }}</span> is licensed under 
          <a :href="siteLicenseUrl" rel="license" property="cc:license schema:license">{{ siteLicenseName }}</a>.
        </p>
        
        <!-- License icon with RDFa -->
        <div class="license-icon">
          <a rel="license" :href="licenseUrl">
            <img alt="Creative Commons License" style="border-width:0" :src="licenseImage" property="cc:licenseIcon" />
          </a>
        </div>
      </div>
      
      <div v-if="customLicenseContent" class="custom-license-section" v-html="customLicenseContent"></div>
    </details>
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, ref } from 'vue'
import { useData } from 'vitepress'
import { withBase } from 'vitepress'

// Access frontmatter and site data
const { frontmatter, page, site, theme } = useData()

// Get the first h1 heading from the page as the page title
const pageTitle = computed(() => {
  // Try to get title from frontmatter first
  if (frontmatter.value.title) {
    return frontmatter.value.title
  }
  
  // If no title in frontmatter, try to extract from page content (first h1)
  return page.value.title || 'Current Page'
})

// Get the current page URL - combine base URL with page path
const currentPageUrl = computed(() => {
  const basePath = site.value.base || '/'
  // Remove .md extension and add .html if needed
  const pagePath = page.value.relativePath.replace(/\.md$/, '.html')
  
  // Use the site's domain and base path instead of hardcoded URL
  const siteUrl = theme.value.siteUrl
  return `${siteUrl}${basePath}${pagePath}`
})

// Check if we should show a link to the work
const shouldShowWorkLink = computed(() => {
  // If disableWorkLink is explicitly set to true, don't show link
  if (frontmatter.value.disableWorkLink === true) {
    return false;
  }
  return true;
})

// Get the URL to use for the work link 
// (either custom workUrl from frontmatter or default currentPageUrl)
const workLinkUrl = computed(() => {
  // If custom workUrl is provided in frontmatter, use it
  if (frontmatter.value.workUrl) {
    return frontmatter.value.workUrl;
  }
  // Otherwise use the current page URL
  return currentPageUrl.value;
})

// Enhanced author logic - now using theme.value to access themeConfig
const pageAuthor = computed(() => {
  // First check if author is specified in frontmatter
  if (frontmatter.value.author) {
    return frontmatter.value.author;
  }
  
  // Access the defaultAuthor from the theme config
  if (theme.value.defaultAuthor) {
    return theme.value.defaultAuthor;
  }
  
  // Fallback to Michael Collins (hardcoded default)
  return 'the author';
})

// Work information - from theme config
const workTitle = computed(() => theme.value.workTitle)
const workUrl = computed(() => {
  const basePath = site.value.base || '/'
  const siteUrl = theme.value.siteUrl
  return `${siteUrl}${basePath}`
})
const workAuthor = computed(() => theme.value.defaultAuthor)

// License type can be overridden in frontmatter, defaults to theme config
const license = computed(() => frontmatter.value.license || theme.value.license || 'cc-by')

// Get site-wide license from theme config, not frontmatter
const siteLicense = computed(() => theme.value.license || 'cc-by')

// Parse license version from the license string
const licenseVersion = computed(() => {
  const licenseStr = license.value;
  // Check if license includes version number (e.g., cc-by-3.0 or cc-by-nc-3.0)
  const versionMatch = licenseStr.match(/(\d+\.\d+)$/);
  
  if (versionMatch) {
    // Return the specified version if found
    return versionMatch[1];
  }
  
  // Default to 4.0 if no version is specified
  return '4.0';
})

// Parse site license version
const siteLicenseVersion = computed(() => {
  const licenseStr = siteLicense.value;
  // Check if license includes version number
  const versionMatch = licenseStr.match(/(\d+\.\d+)$/);
  
  if (versionMatch) {
    // Return the specified version if found
    return versionMatch[1];
  }
  
  // Default to 4.0 if no version is specified
  return '4.0';
})

// Get license type without version
const licenseType = computed(() => {
  const licenseStr = license.value;
  // If license has version suffix, remove it
  if (licenseStr.match(/\d+\.\d+$/)) {
    return licenseStr.replace(/[-]?\d+\.\d+$/, '');
  }
  return licenseStr;
})

// Get site license type without version
const siteLicenseType = computed(() => {
  const licenseStr = siteLicense.value;
  // If license has version suffix, remove it
  if (licenseStr.match(/\d+\.\d+$/)) {
    return licenseStr.replace(/[-]?\d+\.\d+$/, '');
  }
  return licenseStr;
})

// Visibility controls
const showPageLicense = computed(() => {
  // Check if page-specific control exists in frontmatter
  if (frontmatter.value.showPageLicense !== undefined) {
    return frontmatter.value.showPageLicense
  }
  // Fall back to global setting
  return theme.value.showPageLicense !== undefined ? theme.value.showPageLicense : true
})

const showSitewideLicense = computed(() => {
  // Check if page-specific control exists in frontmatter
  if (frontmatter.value.showSitewideLicense !== undefined) {
    return frontmatter.value.showSitewideLicense
  }
  // Fall back to global setting
  return theme.value.showSitewideLicense !== undefined ? theme.value.showSitewideLicense : true
})

// Should show any license at all
const shouldShowLicense = computed(() => showPageLicense.value || showSitewideLicense.value)

// Set license URL based on license type and version
const licenseUrl = computed(() => {
  // Handle custom license case
  if (licenseType.value === 'custom') {
    return frontmatter.value.customLicenseUrl || '#';
  }
  
  // For standard CC licenses, use the type and version
  let type = '';
  
  switch(licenseType.value) {
    case 'cc-by-sa': type = 'by-sa'; break;
    case 'cc-by-nc': type = 'by-nc'; break;
    case 'cc-by-nc-sa': type = 'by-nc-sa'; break;
    case 'cc-by-nd': type = 'by-nd'; break;
    case 'cc-by-nc-nd': type = 'by-nc-nd'; break;
    default: type = 'by'; // Default to CC BY
  }
  
  return `https://creativecommons.org/licenses/${type}/${licenseVersion.value}/`;
})

// Set site-wide license URL based on site license type and version
const siteLicenseUrl = computed(() => {
  // For standard CC licenses, use the type and version
  let type = '';
  
  switch(siteLicenseType.value) {
    case 'cc-by-sa': type = 'by-sa'; break;
    case 'cc-by-nc': type = 'by-nc'; break;
    case 'cc-by-nc-sa': type = 'by-nc-sa'; break;
    case 'cc-by-nd': type = 'by-nd'; break;
    case 'cc-by-nc-nd': type = 'by-nc-nd'; break;
    default: type = 'by'; // Default to CC BY
  }
  
  return `https://creativecommons.org/licenses/${type}/${siteLicenseVersion.value}/`;
})

// Generate license name based on license type and version
const licenseName = computed(() => {
  // Handle custom license case
  if (licenseType.value === 'custom') {
    return frontmatter.value.customLicenseName || 'Custom License';
  }
  
  // For standard CC licenses, use the type and version
  let name = '';
  
  switch(licenseType.value) {
    case 'cc-by-sa': name = 'CC-BY-SA'; break;
    case 'cc-by-nc': name = 'CC-BY-NC'; break;
    case 'cc-by-nc-sa': name = 'CC-BY-NC-SA'; break;
    case 'cc-by-nd': name = 'CC-BY-ND'; break;
    case 'cc-by-nc-nd': name = 'CC-BY-NC-ND'; break;
    default: name = 'CC-BY'; // Default to CC BY
  }
  
  return `${name}-${licenseVersion.value}`;
})

// Generate site-wide license name based on site license type and version
const siteLicenseName = computed(() => {
  // For standard CC licenses, use the type and version
  let name = '';
  
  switch(siteLicenseType.value) {
    case 'cc-by-sa': name = 'CC-BY-SA'; break;
    case 'cc-by-nc': name = 'CC-BY-NC'; break;
    case 'cc-by-nc-sa': name = 'CC-BY-NC-SA'; break;
    case 'cc-by-nd': name = 'CC-BY-ND'; break;
    case 'cc-by-nc-nd': name = 'CC-BY-NC-ND'; break;
    default: name = 'CC-BY'; // Default to CC BY
  }
  
  return `${name}-${siteLicenseVersion.value}`;
})

// License image based on license type and version
const licenseImage = computed(() => {
  // Handle custom license case
  if (licenseType.value === 'custom') {
    return frontmatter.value.customLicenseImage || '';
  }
  
  // For standard CC licenses, use the type and version
  let type = '';
  
  switch(licenseType.value) {
    case 'cc-by-sa': type = 'by-sa'; break;
    case 'cc-by-nc': type = 'by-nc'; break;
    case 'cc-by-nc-sa': type = 'by-nc-sa'; break;
    case 'cc-by-nd': type = 'by-nd'; break;
    case 'cc-by-nc-nd': type = 'by-nc-nd'; break;
    default: type = 'by'; // Default to CC BY
  }
  
  return `https://i.creativecommons.org/l/${type}/${licenseVersion.value}/88x31.png`;
})

// For custom license content if needed
const customLicenseContent = computed(() => frontmatter.value.customLicenseContent || '')

// Add the JSON-LD schema via lifecycle hooks instead of inline script
const addJsonLdSchema = () => {
  // Only add schema if license is shown
  if (!shouldShowLicense.value) {
    return
  }

  // Create the JSON-LD schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": pageTitle.value,
    "author": pageAuthor.value,
    "license": licenseUrl.value,
    "publisher": {
      "@type": "Organization",
      "name": "Digital Multimedia Design Program"
    }
  }
  
  // Check if the script already exists and remove it
  const existingScript = document.getElementById('license-jsonld')
  if (existingScript) {
    existingScript.remove()
  }
  
  // Add the JSON-LD script to the head
  const script = document.createElement('script')
  script.id = 'license-jsonld'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLdSchema)
  document.head.appendChild(script)
}

// Call on initial mount and whenever license data changes
onMounted(addJsonLdSchema)
onUpdated(addJsonLdSchema)
</script>

<style scoped>
.license-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.custom-block.details {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.custom-block.details summary {
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  padding: 0.25rem 0;
  color: var(--vp-c-text-1);
}

.license-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.license-text {
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.5;
}

.license-icon {
  margin-top: 0.5rem;
}

.custom-license-section {
  margin-top: 1rem;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .license-section {
    align-items: center;
  }
}
</style>