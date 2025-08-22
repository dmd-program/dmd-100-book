// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './embed.css'
import './embed.js'
import '../../../vitepress-plugin/styles.css'
import { h } from 'vue'
import LicenseFooter from './components/LicenseFooter.vue'
import VideoEmbed from './components/VideoEmbed.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the license component so it can be used in markdown
    app.component('LicenseFooter', LicenseFooter)
    // Register the VideoEmbed component for video embeds
    app.component('VideoEmbed', VideoEmbed)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Add the LicenseFooter component to the end of the content area
      'doc-after': () => h(LicenseFooter)
    })
  }
}
