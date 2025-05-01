// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { h } from 'vue'
import LicenseFooter from './components/LicenseFooter.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the license component so it can be used in markdown
    app.component('LicenseFooter', LicenseFooter)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Add the LicenseFooter component to the end of the content area
      'doc-after': () => h(LicenseFooter)
    })
  }
}
