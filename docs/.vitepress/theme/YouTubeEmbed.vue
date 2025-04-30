<template>
  <div class="youtube-embed">
    <iframe 
      :src="embedUrl" 
      :title="title" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin" 
      allowfullscreen>
    </iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'YouTube video player'
  }
})

const embedUrl = computed(() => `https://www.youtube.com/embed/${props.videoId}`)
</script>

<style scoped>
.youtube-embed {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
  margin: 1em 0; /* Add some space around the embed */
}

.youtube-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
