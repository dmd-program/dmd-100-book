import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { h } from 'vue'
import EmbedController from './EmbedController.vue' // Import the new hash-based controller

export default {
  ...DefaultTheme,
  // Use the Layout slot to add the EmbedController component
  Layout: h(DefaultTheme.Layout, null, {
    // Render the EmbedController in a layout slot to ensure it runs
    'layout-bottom': () => h(EmbedController)
  }),
  enhanceApp({ app, router, siteData }) {
    // Cleaned up enhanceApp - embed logic is now in EmbedController
    console.log('enhanceApp running'); // Log to confirm enhanceApp itself runs
  }
}
