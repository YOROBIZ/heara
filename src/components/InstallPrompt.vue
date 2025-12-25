<template>
  <div v-if="showPrompt" class="install-prompt">
    <div class="install-content">
      <Download :size="16" :stroke-width="2" />
      <span class="install-text">Install App</span>
    </div>
    <button @click="install" class="install-btn" aria-label="Install Heara">
      Install
    </button>
    <button @click="dismiss" class="dismiss-btn" aria-label="Dismiss">
      <X :size="14" :stroke-width="2" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download, X } from 'lucide-vue-next'

const showPrompt = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
    console.log('[PWA] Install prompt available')
  })

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully')
    showPrompt.value = false
  })
})

async function install() {
  if (!deferredPrompt) {
    console.warn('[PWA] No install prompt available')
    return
  }
  
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  console.log(`[PWA] Install outcome: ${outcome}`)
  
  if (outcome === 'accepted') {
    deferredPrompt = null
    showPrompt.value = false
  }
}

function dismiss() {
  showPrompt.value = false
  deferredPrompt = null
}
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 90%;
}

.install-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: white;
}

.install-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.install-btn {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: var(--space-2) var(--space-4);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.install-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.dismiss-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-base);
}

.dismiss-btn:hover {
  color: white;
}

@media (max-width: 480px) {
  .install-text {
    display: none;
  }
}
</style>
