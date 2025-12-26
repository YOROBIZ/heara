import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/design-tokens.css'

const app = createApp(App)
const pinia = createPinia()

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
    onNeedRefresh() {
        console.log('[PWA] New content available, click on reload button to update.')
    },
    onOfflineReady() {
        console.log('[PWA] App ready to work offline')
    },
})

console.log('[PWA] Service Worker registered', updateSW)

app.use(pinia)
app.mount('#app')
