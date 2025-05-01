---
# Default to CC-BY license (this is optional, as cc-by is the site-wide default)
license: cc-by
attribution: Digital Multimedia Design Program
---

# License Examples

This page demonstrates how to use different Creative Commons licenses on your VitePress pages.

## How to Use

You can specify the license type and attribution in the front matter of any markdown file:

```md
---
license: cc-by-sa
attribution: Your Name or Organization
---
```

## Available License Types

The following license types are supported:

- `cc-by` - Creative Commons Attribution 4.0 (Default)
- `cc-by-sa` - Creative Commons Attribution-ShareAlike 4.0
- `cc-by-nc` - Creative Commons Attribution-NonCommercial 4.0
- `cc-by-nc-sa` - Creative Commons Attribution-NonCommercial-ShareAlike 4.0
- `cc-by-nd` - Creative Commons Attribution-NoDerivatives 4.0
- `cc-by-nc-nd` - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
- `custom` - Custom license (requires additional parameters)

## Custom License Example

For a custom license, you can use the following front matter:

```md
---
license: custom
customLicenseText: "This work is licensed under a <a href='https://example.com/license'>Custom License</a>."
customLicenseImage: "/path/to/license/image.png"
customLicenseAlt: "Custom License Logo"
attribution: "Custom Attribution"
---
```

<!-- The LicenseFooter component will automatically be displayed here -->
<LicenseFooter />

---

## Examples of Different Licenses

### CC-BY-SA Example

This section uses a different license.

<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
  <h4>ShareAlike Content</h4>
  <p>This specific section demonstrates content with a ShareAlike license.</p>
  <LicenseFooter license="cc-by-sa" attribution="DMD Program Contributors" />
</div>

### CC-BY-NC Example

<div style="background-color: #f0f8ff; padding: 20px; border-radius: 5px;">
  <h4>NonCommercial Content</h4>
  <p>This specific section demonstrates content with a NonCommercial license.</p>
  <LicenseFooter license="cc-by-nc" attribution="Penn State University" />
</div>

### Custom License Example

<div style="background-color: #fff8dc; padding: 20px; border-radius: 5px;">
  <h4>Custom License</h4>
  <p>This specific section demonstrates content with a custom license.</p>
  <LicenseFooter 
    license="custom" 
    customText="This is a custom license text with <a href='#'>special terms</a>."
    customImage="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/cc-zero.png"
    customAlt="CC0 License" 
    attribution="Public Domain Contributors" 
  />
</div>