// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import YouTubeEmbed from './YouTubeEmbed.vue'
import VideoEmbed from './components/VideoEmbed.vue' // Import the new component
import './custom.css' // Optional: if you have custom global styles

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component('YouTubeEmbed', YouTubeEmbed)
    app.component('VideoEmbed', VideoEmbed) // Register the new component
  }
}
