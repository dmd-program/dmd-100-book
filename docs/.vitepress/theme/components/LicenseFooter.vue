<template>
  <div class="license-footer" v-if="shouldShowLicense">
    <details class="custom-block details">
      <summary>License</summary>
      
      <div class="license-section">
        <!-- Page-specific license with RDFa attributes -->
        <p v-if="showPageLicense" class="license-text" 
           prefix="cc: http://creativecommons.org/ns# dc: http://purl.org/dc/terms/ schema: https://schema.org/"
           typeof="schema:CreativeWork cc:Work">
          This work, <a :href="currentPageUrl" property="schema:url dc:source">"{{ pageTitle }}"</a>, 
          by <span property="schema:author dc:creator">{{ pageAuthor }}</span> is licensed under 
          <a :href="licenseUrl" rel="license" property="cc:license schema:license">{{ licenseName }}</a>.
        </p>
        
        <!-- Entire work license with RDFa attributes -->
        <p v-if="showSitewideLicense" class="license-text"
           prefix="cc: http://creativecommons.org/ns# dc: http://purl.org/dc/terms/ schema: https://schema.org/"
           typeof="schema:CreativeWork cc:Work">
          The entire work, <a :href="workUrl" property="schema:url dc:source">"{{ workTitle }}"</a>, 
          by <span property="schema:author dc:creator">{{ workAuthor }}</span> is licensed under 
          <a :href="licenseUrl" rel="license" property="cc:license schema:license">{{ licenseName }}</a>.
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

// Set license URL and name based on license type
const licenseUrl = computed(() => {
  switch(license.value) {
    case 'cc-by-sa': return 'https://creativecommons.org/licenses/by-sa/4.0/'
    case 'cc-by-nc': return 'https://creativecommons.org/licenses/by-nc/4.0/'
    case 'cc-by-nc-sa': return 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
    case 'cc-by-nd': return 'https://creativecommons.org/licenses/by-nd/4.0/'
    case 'cc-by-nc-nd': return 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
    case 'custom': return frontmatter.value.customLicenseUrl || '#'
    default: return 'https://creativecommons.org/licenses/by/4.0/'
  }
})

// License name based on license type
const licenseName = computed(() => {
  switch(license.value) {
    case 'cc-by-sa': return 'CC-BY-SA-4.0'
    case 'cc-by-nc': return 'CC-BY-NC-4.0'
    case 'cc-by-nc-sa': return 'CC-BY-NC-SA-4.0'
    case 'cc-by-nd': return 'CC-BY-ND-4.0'
    case 'cc-by-nc-nd': return 'CC-BY-NC-ND-4.0'
    case 'custom': return frontmatter.value.customLicenseName || 'Custom License'
    default: return 'CC-BY-4.0'
  }
})

// License image based on license type
const licenseImage = computed(() => {
  switch(license.value) {
    case 'cc-by-sa': return 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png'
    case 'cc-by-nc': return 'https://i.creativecommons.org/l/by-nc/4.0/88x31.png'
    case 'cc-by-nc-sa': return 'https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png'
    case 'cc-by-nd': return 'https://i.creativecommons.org/l/by-nd/4.0/88x31.png'
    case 'cc-by-nc-nd': return 'https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png'
    case 'custom': return frontmatter.value.customLicenseImage || ''
    default: return 'https://i.creativecommons.org/l/by/4.0/88x31.png'
  }
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