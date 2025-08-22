/**
 * Debug script to test embed functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed');
    
    console.log('Debug: Current URL:', window.location.href);
    console.log('Debug: Embed parameter:', embedParam);
    console.log('Debug: Body data-embed attribute:', document.body.getAttribute('data-embed'));
    
    // Check if navigation elements exist
    const nav = document.querySelector('.VPNav');
    const sidebar = document.querySelector('.VPSidebar');
    const footer = document.querySelector('.VPFooter');
    const licenseFooter = document.querySelector('.license-footer');
    
    console.log('Debug: VPNav element found:', !!nav);
    console.log('Debug: VPSidebar element found:', !!sidebar);
    console.log('Debug: VPFooter element found:', !!footer);
    console.log('Debug: LicenseFooter element found:', !!licenseFooter);
    
    if (nav) console.log('Debug: VPNav display style:', window.getComputedStyle(nav).display);
    if (sidebar) console.log('Debug: VPSidebar display style:', window.getComputedStyle(sidebar).display);
});
