<template>
  <figure class="video-embed">
    <div class="video-container" :style="aspectRatioStyle">
      <iframe
        v-if="isYouTube || isVimeo"
        :src="embedUrl"
        :title="title || 'Video Player'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen
      ></iframe>
      <video
        v-else-if="isLocal"
        ref="videoRef" 
        controls
        :autoplay="autoplay && !autoplayOnView" 
        :muted="muted || autoplayOnView" 
        :loop="loop"
        :preload="preload"
        :src="embedUrl"
        :title="title || 'Video Player'"
        crossorigin="anonymous" 
      >
        <track v-if="trackSrc" :src="trackSrc" kind="subtitles" :srclang="trackLang || 'en'" :label="trackLang ? trackLang.toUpperCase() : 'English'" />
        Your browser does not support the video tag.
      </video>
      <div v-else class="unsupported-source">
        Unsupported video source: {{ src }}
      </div>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps({
  // ... existing props ...
  src: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'local', // 'local', 'youtube', 'vimeo'
    validator: (value) => ['local', 'youtube', 'vimeo'].includes(value),
  },
  title: {
    type: String,
    default: '', // Provides a title for accessibility (e.g., for screen readers)
  },
  caption: {
    type: String,
    default: '',
  },
  aspectRatio: {
    type: String,
    default: '16/9', // Default aspect ratio (e.g., '16/9', '4/3', '1/1')
  },
  // Props specific to local videos
  autoplay: {
    type: Boolean,
    default: false, // Standard HTML5 autoplay (plays as soon as possible)
  },
  autoplayOnView: { // New prop
    type: Boolean,
    default: false,
    // If true, uses IntersectionObserver to play the video only when it's
    // at least 50% visible in the viewport. Video will be automatically muted
    // to comply with browser autoplay policies. Pauses when out of view.
  },
  muted: {
    type: Boolean,
    default: false, // Mutes the video. Note: autoplayOnView forces muted=true.
  },
  loop: {
    type: Boolean,
    default: false,
  },
  preload: {
    type: String,
    default: 'metadata', // 'auto', 'metadata', 'none'
  },
  trackSrc: { // New prop for captions
    type: String,
    default: '',
    // URL to the WebVTT (.vtt) caption file.
    // Place .vtt files in the `docs/public` directory (e.g., `docs/public/assets/captions/your-video.vtt`)
    // and reference them using the root path (e.g., `/assets/captions/your-video.vtt`).
  },
  trackLang: { // New prop for caption language
    type: String,
    default: 'en',
    // Language code for the caption track (e.g., 'en', 'es', 'fr').
  },
});

const videoRef = ref(null); // Ref for the video element
let observer = null;

// ... existing computed properties (isLocal, isYouTube, isVimeo, embedUrl, aspectRatioStyle) ...
const isLocal = computed(() => props.type === 'local');
const isYouTube = computed(() => props.type === 'youtube');
const isVimeo = computed(() => props.type === 'vimeo');

const embedUrl = computed(() => {
  if (isYouTube.value) {
    // Extract YouTube video ID from various URL formats
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = props.src.match(youtubeRegex);
    // Add common YouTube parameters for better embedding
    const params = 'rel=0&showinfo=0&iv_load_policy=3';
    const baseUrl = match ? `https://www.youtube.com/embed/${match[1]}` : props.src;
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params}`;
  } else if (isVimeo.value) {
    // Extract Vimeo video ID
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)/;
    const match = props.src.match(vimeoRegex);
    // Add common Vimeo parameters
    const params = 'title=0&byline=0&portrait=0';
    const baseUrl = match ? `https://player.vimeo.com/video/${match[2]}` : props.src;
     return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params}`;
  } else if (isLocal.value) {
    // Use VitePress withBase helper to handle base path correctly
    return withBase(props.src);
  }
  return props.src; // Fallback for unknown types or direct embed URLs
});

// Calculate padding-top for aspect ratio box
const aspectRatioStyle = computed(() => {
  const [width, height] = props.aspectRatio.split('/').map(Number);
  if (width && height) {
    const paddingTop = (height / width) * 100;
    return {
      paddingTop: `${paddingTop}%`,
    };
  }
  return {}; // Return empty object if aspect ratio is invalid
});

onMounted(() => {
  if (props.autoplayOnView && videoRef.value) {
    // Ensure video is muted for programmatic autoplay
    videoRef.value.muted = true;

    const observerOptions = {
      root: null, // relative to document viewport 
      rootMargin: '0px',
      threshold: 0.5 // 50% of the video needs to be visible
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Attempt to play, handle potential promise rejection
          videoRef.value.play().catch(error => {
            console.error("Video play failed:", error);
            // Might need user interaction if not muted or other restrictions apply
          });
        } else {
          videoRef.value.pause();
        }
      });
    }, observerOptions);

    observer.observe(videoRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});

</script>

<style scoped>
/* ... existing styles ... */
.video-embed {
  margin: 1.5em 0;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
  background-color: #eee; /* Placeholder background */
}

.video-container iframe,
.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-embed figcaption {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: #666;
  text-align: center;
}

.unsupported-source {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: red;
    font-weight: bold;
}
</style>