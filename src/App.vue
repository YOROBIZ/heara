<template>
  <ConversationView />
</template>

<script setup lang="ts">
import ConversationView from './views/ConversationView.vue'
import { onMounted } from 'vue'
import { initializeSettings } from './database'

// Initialize database settings on app mount
onMounted(async () => {
  await initializeSettings()
})
</script>

<style>
/* Remove default app styles, ConversationView handles full screen */
#app {
  min-height: 100vh;
}
</style>
