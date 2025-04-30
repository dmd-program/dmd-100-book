/**
 * VitePress embed mode handler
 * Detects ?embed=true parameter and hides navigation elements
 */

(function() {
  function checkEmbed() {
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed');
    
    if (embedParam === 'true') {
      document.body.setAttribute('data-embed', 'true');
    } else {
      document.body.removeAttribute('data-embed');
    }
  }
  
  // Run immediately if body exists
  if (document.body) {
    checkEmbed();
  } else {
    // Otherwise wait for the DOM to be ready
    document.addEventListener('DOMContentLoaded', checkEmbed);
  }
  
  // Set up a MutationObserver to detect SPA navigation
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      checkEmbed();
    });
    
    // Start observing once DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
  
  // Also listen for popstate events (browser back/forward)
  window.addEventListener('popstate', checkEmbed);
})();