# Add History integration to ConversationView.vue

$file = "c:\Users\hp\Desktop\Hack\CostClock\src\views\ConversationView.vue"
$content = Get-Content -Path $file -Raw

# 1. Add modal overlay at the start of template
$content = $content -replace '(<template>\r\n  <div class="conversation-view">)', '$1\r\n    <!-- History Modal Overlay -->\r\n    <div v-if="showHistory" class="history-overlay" @click="closeHistory">\r\n      <div class="history-modal" @click.stop>\r\n        <button class="history-close" @click="closeHistory" aria-label="Close history">\r\n          <X :size="20" :stroke-width="2" />\r\n        </button>\r\n        <SessionHistory />\r\n      </div>\r\n    </div>\r\n'

# 2. Add History button to header
$content = $content -replace '(        </div>\r\n      </div>\r\n\r\n      <!-- Mode Indicator -->)', '        </div>\r\n        <button class="history-btn" @click="showHistory = true" aria-label="View history">\r\n          <Clock :size="18" :stroke-width="2" />\r\n          <span>History</span>\r\n        </button>\r\n      </div>\r\n\r\n      <!-- Mode Indicator -->'

# 3. Add imports
$content = $content -replace "import \{ MessageCircle, Pause, Play, Minus, Plus, HardDrive \} from 'lucide-vue-next'", "import { MessageCircle, Pause, Play, Minus, Plus, HardDrive, Clock, X } from 'lucide-vue-next'"
$content = $content -replace "import \{ completeSession \} from '@/database'", "import { completeSession } from '@/database'\r\nimport SessionHistory from '@/components/SessionHistory.vue'"

# 4. Add state
$content = $content -replace '(const restoredSessionId = ref<number \| null>\(null\))', '$1\r\nconst showHistory = ref(false)'

# 5. Add closeHistory function
$content = $content -replace '(  participants\.value = 4\r\n  hourlyRate\.value = 50\r\n})\r\n</script>', '$1\r\n\r\nfunction closeHistory() {\r\n  showHistory.value = false\r\n}\r\n</script>'

Set-Content -Path $file -Value $content
Write-Host "Integration complete!"
