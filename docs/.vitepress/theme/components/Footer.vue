<template>
  <footer class="cc-footer">
    <div class="container">
      <div class="license">
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
          <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
        </a>
        <p>
          This work is licensed under a 
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
          </a>.
        </p>
      </div>
      <div class="copyright">
        <p>&copy; {{ currentYear }} Digital Multimedia Design Program</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.cc-footer {
  padding: 2rem 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 2rem;
  text-align: center;
}

.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

.license {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.license p {
  margin: 0;
  font-size: 0.9rem;
}

.copyright p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

@media (min-width: 768px) {
  .license {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
}
</style>