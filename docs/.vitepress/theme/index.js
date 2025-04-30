// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import YouTubeEmbed from './YouTubeEmbed.vue'
import VideoEmbed from './components/VideoEmbed.vue'
import './custom.css'
import './embed.css'  // Import our embed-specific CSS

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component('YouTubeEmbed', YouTubeEmbed)
    app.component('VideoEmbed', VideoEmbed)
    
    // Load our embed script on the client-side
    if (typeof window !== 'undefined') {
      import('./embed.js')
    }
  }
}
