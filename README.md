# VitePress DMD 100 Project

This project uses [VitePress](https://vitepress.dev/) to generate a static website from Markdown files located in the `docs` directory.

## Development

To run the local development server with hot-reloading:

1.  Make sure you have Node.js installed.
2.  Install the project dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run docs:dev
    ```
    This will typically make the site available at `http://localhost:5173`.

## URL Parameters

### Embed Mode

The site supports an embed mode that hides navigation elements, making it suitable for embedding pages in iframes.

To use embed mode, append `?embed=true` to any page URL:

```
https://example.com/lessons/lesson-1/topics/design_thinking.html?embed=true
```

This will:
- Hide the navigation bar
- Hide the sidebar
- Hide the footer
- Remove all padding and margins from the content area

This feature is useful when you want to embed specific content from the site into another webpage or learning management system without showing the navigation elements.

Example iframe implementation:
```html
<iframe 
  src="https://example.com/lessons/lesson-1/topics/design_thinking.html?embed=true" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>
```

## Build & Deployment

To build the static website for deployment:

1.  Run the build command:
    ```bash
    npm run docs:build
    ```
    This command performs two steps:
    *   `vitepress build docs`: Compiles the Markdown files and VitePress application into static HTML, CSS, and JavaScript files in the `.vitepress/dist` directory.
    *   `node scripts/generate-content-api.mjs`: After the build, this script runs automatically to generate a `content-api.json` file (likely placed in the build output directory). This API file probably contains metadata or structured content extracted from the Markdown files, which can be used by the frontend or other services.

2.  The contents of the `.vitepress/dist` directory are ready to be deployed to any static hosting provider (like Netlify, Vercel, GitHub Pages, etc.).

To preview the built site locally before deploying:

```bash
npm run docs:preview
```
This will serve the contents of `.vitepress/dist`.

## Utility Scripts

### External Link Checker

This project includes a script to find and check the status of external links within the Markdown files in the `docs` directory.

*   **Script Location**: `scripts/check_external_links.js`
*   **Functionality**:
    *   Scans all `.md` files under `docs/`.
    *   Extracts all external URLs (http/https).
    *   Sends a HEAD request to each unique URL to check if it's reachable (OK, Not Found, Redirect, Timeout, Error).
    *   Generates a CSV report named `external_links_report.csv` in the **workspace root** containing the URL, the file path where it was found, the line number, and the status.
*   **How to Run**:
    Navigate to the workspace root in your terminal and run:
    ```bash
    node scripts/check_external_links.js
    ```
    *Note: This script requires `node-fetch` (v2) which should be installed via `npm install`.*

### Content API Generator

*   **Script Location**: `scripts/generate-content-api.mjs`
*   **Functionality**: This script is automatically executed as part of the `npm run docs:build` process. It scans the built Markdown content or source files to create a structured JSON representation (`content-api.json`) of the site's content or metadata. Consult the script's source code for specific details on what data it extracts and how it's structured.
