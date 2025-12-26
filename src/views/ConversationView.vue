<template>
  <div class="conversation-view">
    <!-- History Modal Overlay -->
    <div v-if="showHistory" class="history-overlay" @click="closeHistory">
      <div class="history-modal" @click.stop>
        <button class="history-close" @click="closeHistory" aria-label="Close history">
          <X :size="20" :stroke-width="2" />
        </button>
        <SessionHistory />
      </div>
    </div>

    <!-- Insights Modal Overlay -->
    <div v-if="showInsights" class="history-overlay" @click="closeInsights">
      <div class="history-modal" @click.stop>
        <button class="history-close" @click="closeInsights" aria-label="Close insights">
          <X :size="20" :stroke-width="2" />
        </button>
        <WeeklySummary />
      </div>
    </div>

    <!-- Main Card (Glassmorphism with deep shadow) -->
    <div class="conversation-card">
      <!-- Header -->
      <div class="card-header">
        <div class="brand">
          <h1 class="brand-name">Heara</h1>
          <p class="brand-tagline">Hear what truly matters</p>
        </div>
        <div class="header-actions">
          <button class="history-btn" @click="showInsights = true" aria-label="View insights" title="Weekly Insights">
            <BarChart2 :size="16" :stroke-width="2" />
          </button>
          <button class="history-btn" @click="showHistory = true" aria-label="View history">
            <Clock :size="18" :stroke-width="2" />
            <span>History</span>
          </button>
        </div>
      </div>

      <!-- Mode Indicator -->
      <div class="mode-bar">
        <div class="mode-info">
          <MessageCircle :size="16" :stroke-width="2" class="mode-icon" />
          <span class="mode-label">Conversation Mode</span>
        </div>
        <span class="participants-count">{{ participants }} participants</span>
      </div>

      <!-- Restore Session Banner (shown when incomplete session exists) -->
      <div v-if="showRestoreBanner" class="restore-banner">
        <p class="restore-message">Resume last conversation?</p>
        <div class="restore-actions">
          <button class="btn-restore" @click="doRestoreSession">
            <Play :size="16" :stroke-width="2" />
            Resume
          </button>
          <button class="btn-dismiss" @click="dismissRestore">
            Start fresh
          </button>
        </div>
      </div>

      <!-- Timer (Hero Element) -->
      <div class="timer-hero">
        <div class="timer-display">{{ formattedTime }}</div>
      </div>

      <!-- Cost Display -->
      <div v-if="hourlyRate" class="cost-display">
        <div class="cost-main">€{{ formattedCost }}</div>
        <div class="cost-rate">+€{{ formattedRate }}/min</div>
      </div>

      <!-- Observation Card (shown when > 45min) -->
      <div v-if="showObservation" class="observation-card">
        <p class="observation-title">This conversation has reached its natural point.</p>
        <p class="observation-subtitle">You may want to wrap up or refocus.</p>
      </div>

      <!-- Control Bar -->
      <div class="control-bar">
        <!-- Pause Button (left, circular) -->
        <button 
          v-if="isRunning || elapsedTime > 0" 
          class="btn-circular"
          @click="togglePause"
        >
          <component :is="isRunning ? Pause : Play" :size="20" :stroke-width="2.5" />
          <span class="btn-label">{{ isRunning ? 'Pause' : 'Resume' }}</span>
        </button>

        <!-- Start/Stop Button (center, primary) -->
        <button 
          v-if="!isRunning && elapsedTime === 0"
          class="btn-circular btn-circular-primary"
          @click="startConversation"
          :disabled="!hourlyRate"
        >
          <Play :size="24" :stroke-width="2.5" />
          <span class="btn-label">Begin</span>
        </button>
        <button 
          v-else
          class="btn-stop"
          @click="stopConversation"
        >
          Stop
        </button>

        <!-- Participants Control (right, subtle) -->
        <div v-if="isRunning || elapsedTime > 0" class="participants-controls">
          <button class="btn-adjust" @click="decrementParticipants" :disabled="participants <= 1">
            <Minus :size="16" :stroke-width="2.5" />
          </button>
          <button class="btn-adjust" @click="incrementParticipants" :disabled="participants >= 50">
            <Plus :size="16" :stroke-width="2.5" />
          </button>
          <span class="participants-label">Participants +/-</span>
        </div>
      </div>

      <!-- Settings (only shown before start) -->
      <div v-if="!isRunning && elapsedTime === 0" class="settings-section">
        <!-- Participants Selector -->
        <div class="participants-selector">
          <label class="participants-selector-label">Participants</label>
          <div class="participants-input-group">
            <button class="btn-adjust-large" @click="decrementParticipants" :disabled="participants <= 1">
              <Minus :size="20" :stroke-width="2.5" />
            </button>
            <div class="participants-display">
              <span class="participants-number">{{ participants }}</span>
              <span class="participants-text">{{ participants === 1 ? 'participant' : 'participants' }}</span>
            </div>
            <button class="btn-adjust-large" @click="incrementParticipants" :disabled="participants >= 50">
              <Plus :size="20" :stroke-width="2.5" />
            </button>
          </div>
        </div>

        <!-- Hourly Rate Input -->
        <label class="settings-label">
          <span>Hourly rate (€)</span>
          <input 
            v-model.number="hourlyRate" 
            type="number" 
            min="0" 
            step="10"
            placeholder="50"
            class="settings-input"
          />
        </label>
        <p class="settings-hint">Used to calculate conversation cost</p>
        <div class="settings-device-hint">
          <HardDrive :size="14" :stroke-width="2" />
          <span>Saved on this device</span>
        </div>
      </div>

      <!-- Data Management (Only shown when stopped) -->
      <div v-if="!isRunning && elapsedTime === 0" class="data-management-section">
        <div class="divider"></div>
        <h3 class="data-title">Data Management</h3>
        <div class="data-actions">
          <button class="data-btn" @click="dataStore.exportData" :disabled="dataStore.isExporting">
            <Download :size="14" />
            <span>{{ dataStore.isExporting ? 'Exporting...' : 'Export Backup' }}</span>
          </button>
          
          <div class="import-wrapper">
            <input 
              type="file" 
              ref="fileInput" 
              accept=".json" 
              class="hidden-input"
              @change="handleImport"
            >
            <button class="data-btn secondary" @click="triggerFileInput" :disabled="dataStore.isImporting">
              <Upload :size="14" />
              <span>{{ dataStore.isImporting ? 'Restoring...' : 'Import Backup' }}</span>
            </button>
          </div>
        </div>
        
        <!-- Feedback Messages -->
        <div v-if="dataStore.error" class="data-message error">
          {{ dataStore.error }}
        </div>
        <div v-if="dataStore.successMessage" class="data-message success">
          {{ dataStore.successMessage }}
        </div>
      </div>

      <!-- Signature -->
      <div class="app-signature">
        by Yoro Ndiaye Software developper
      </div>
    </div>

    <!-- PWA Install Prompt -->
    <InstallPrompt />
    <!-- Import Confirmation Modal -->
    <div v-if="showImportModal" class="history-overlay" @click.self="cancelImport">
      <div class="confirmation-modal">
        <div class="confirmation-content">
          <div class="warning-icon">
            <AlertTriangle :size="48" />
          </div>
          <h3 class="confirmation-title">Replace All Data?</h3>
          <p class="confirmation-text">
            This action will <strong>permanently delete</strong> all current sessions and replace them with the backup.
          </p>
          <p class="confirmation-subtext">This cannot be undone.</p>
          
          <div class="confirmation-actions">
            <button class="btn-cancel" @click="cancelImport">Cancel</button>
            <button class="btn-confirm" @click="confirmImport">
              Replace Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTimerStore } from '@/stores/timerStore'
import { storeToRefs } from 'pinia'
import { MessageCircle, Pause, Play, Minus, Plus, HardDrive, Clock, X, BarChart2, Download, Upload, AlertTriangle } from 'lucide-vue-next'
import { completeSession } from '@/database'
import SessionHistory from '@/components/SessionHistory.vue'
import WeeklySummary from '@/components/WeeklySummary.vue'
import InstallPrompt from '@/components/InstallPrompt.vue'
import { useDataStore } from '@/stores/dataStore'

const timerStore = useTimerStore()
const dataStore = useDataStore()
const { isRunning, elapsedTime, currentSessionId } = storeToRefs(timerStore)

const fileInput = ref<HTMLInputElement | null>(null)
const showImportModal = ref(false)
const pendingImportFile = ref<File | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    pendingImportFile.value = target.files[0]
    showImportModal.value = true
    target.value = '' // Reset input
  }
}

function confirmImport() {
  if (pendingImportFile.value) {
    dataStore.importData(pendingImportFile.value)
    showImportModal.value = false
    pendingImportFile.value = null
  }
}

function cancelImport() {
  showImportModal.value = false
  pendingImportFile.value = null
}

// Local state
const participants = ref(4)
const hourlyRate = ref<number | null>(50)
const showRestoreBanner = ref(false)
const restoredSessionId = ref<number | null>(null)
const showHistory = ref(false)
const showInsights = ref(false)

// Load last session on mount
onMounted(async () => {
  const lastSession = await timerStore.loadLastSession()
  if (lastSession) {
    showRestoreBanner.value = true
    restoredSessionId.value = lastSession.id || null
    // Update local state from restored session
    participants.value = lastSession.participants
    hourlyRate.value = lastSession.hourlyRate
  }
})

// Computed
const formattedTime = computed(() => {
  const mins = Math.floor(elapsedTime.value / 60)
  const secs = elapsedTime.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const costPerMinute = computed(() => {
  if (!hourlyRate.value) return 0
  return (hourlyRate.value * participants.value) / 60
})

const currentCost = computed(() => {
  const minutes = elapsedTime.value / 60
  return costPerMinute.value * minutes
})

const formattedCost = computed(() => currentCost.value.toFixed(2))
const formattedRate = computed(() => costPerMinute.value.toFixed(2))

const showObservation = computed(() => {
  return elapsedTime.value > 45 * 60 // > 45 minutes
})

// Methods
function startConversation() {
  if (!hourlyRate.value) return
  showRestoreBanner.value = false
  timerStore.startTimer('conversation', participants.value, hourlyRate.value)
}

function togglePause() {
  if (isRunning.value) {
    timerStore.pauseTimer()
  } else {
    timerStore.resumeTimer()
  }
}

function stopConversation() {
  timerStore.stopTimer()
}

function incrementParticipants() {
  if (participants.value < 50) participants.value++
}

function decrementParticipants() {
  if (participants.value > 1) participants.value--
}

// Restore methods
function doRestoreSession() {
  showRestoreBanner.value = false
  // Session is already restored in store, just hide banner
  // User can click Resume to continue
}

async function dismissRestore() {
  showRestoreBanner.value = false
  // Mark the restored session as complete
  if (restoredSessionId.value) {
    await completeSession(restoredSessionId.value)
  }
  // Reset to clean state
  elapsedTime.value = 0
  if (currentSessionId.value) {
    currentSessionId.value = null
  }
  participants.value = 4
  hourlyRate.value = 50
}

function closeHistory() {
  showHistory.value = false
}

function closeInsights() {
  showInsights.value = false
}
</script>

<style scoped>
.conversation-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #8b9ce8 0%, #6a7dd4 50%, #5264c4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

/* History Modal Overlay */
.history-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.history-modal {
  background: linear-gradient(180deg, #8b9ce8 0%, #6a7dd4 50%, #5264c4 100%);
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.history-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all var(--transition-base);
  z-index: 10;
}

.history-close:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

/* Main Card - Glassmorphism with deep shadow */
.conversation-card {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, 
    rgba(120, 140, 230, 0.4) 0%, 
    rgba(100, 110, 200, 0.35) 50%,
    rgba(90, 100, 180, 0.3) 100%
  );
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: 32px;
  padding: var(--space-8);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: var(--space-6);
  position: relative;
  padding-top: var(--space-8); /* Increased from space-2 to space-8 for more room */
}

.header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: var(--space-2);
  align-items: center;
  z-index: 20;
}

.brand {
  /* Ensure brand has significant space from top buttons */
  margin-top: var(--space-4); 
}

.brand-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-1);
  letter-spacing: -0.01em;
}

.history-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: var(--space-2) var(--space-3);
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.history-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-1px);
}

.brand-tagline {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.75);
  font-weight: var(--font-weight-normal);
}

/* Mode Bar */
.mode-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-8);
}

.mode-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.mode-icon {
  color: white;
  opacity: 0.9;
}

.mode-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: white;
}

.participants-count {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
  font-weight: var(--font-weight-medium);
}

/* Restore Session Banner */
.restore-banner {
  background: rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  border: 1px solid rgba(102, 126, 234, 0.3);
  text-align: center;
}

.restore-message {
  font-size: var(--font-size-sm);
  color: white;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-3);
}

.restore-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  align-items: center;
}

.btn-restore {
  padding: var(--space-2) var(--space-4);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-restore:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-dismiss {
  padding: var(--space-2) var(--space-4);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-dismiss:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Timer Hero - Massive focal point */
.timer-hero {
  text-align: center;
  margin: var(--space-12) 0 var(--space-8);
}

.timer-display {
  font-size: clamp(4rem, 15vw, 6rem);
  font-weight: var(--font-weight-bold);
  color: white;
  letter-spacing: -0.02em;
  line-height: 1;
  text-shadow: 
    0 4px 20px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(255, 200, 150, 0.4);
  font-variant-numeric: tabular-nums;
}

/* Cost Display */
.cost-display {
  text-align: center;
  margin-bottom: var(--space-8);
}

.cost-main {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-1);
  text-shadow: 0 2px 12px rgba(255, 255, 255, 0.25);
  font-variant-numeric: tabular-nums;
}

.cost-rate {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-medium);
}

/* Observation Card - Warm glow */
.observation-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.85) 0%, rgba(217, 119, 6, 0.75) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: 
    0 8px 24px rgba(245, 158, 11, 0.35),
    0 0 32px rgba(245, 158, 11, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 200, 100, 0.3);
  text-align: center;
}

.observation-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: white;
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.observation-subtitle {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
  font-weight: var(--font-weight-normal);
  line-height: 1.4;
}

/* Control Bar */
.control-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}

/* Circular Pause Button */
.btn-circular {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: var(--color-primary);
}

.btn-circular:hover:not(:disabled):not(.btn-circular-primary) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background: white;
}

.btn-circular:active {
  transform: translateY(0);
}

.btn-label {
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Primary Circular Button (Begin) */
.btn-circular-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-circular-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.55);
  filter: brightness(1.1);
}

.btn-circular-primary:active:not(:disabled) {
  transform: translateY(0);
  filter: brightness(1);
}

.btn-circular-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Stop Button - Warm amber */
.btn-stop {
  min-width: 140px;
  padding: var(--space-4) var(--space-8);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.5);
}

/* Participants Controls (subtle, right side) */
.participants-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-adjust {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-adjust:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.btn-adjust:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.participants-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: var(--space-1);
}

/* Settings Section */
.settings-section {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: var(--space-6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Participants Selector */
.participants-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.participants-selector-label {
  color: white;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  text-align: center;
}

.participants-input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.btn-adjust-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-adjust-large:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.btn-adjust-large:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.participants-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.participants-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: white;
  line-height: 1;
}

.participants-text {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-medium);
  margin-top: var(--space-1);
}

.settings-label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: white;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.settings-input {
  padding: var(--space-3) var(--space-4);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-base);
  transition: all var(--transition-base);
}

.settings-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.18);
}

.settings-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.settings-hint {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  margin-top: var(--space-2);
  font-weight: var(--font-weight-normal);
}

.settings-device-hint {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin-top: var(--space-3);
  font-weight: var(--font-weight-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

/* Data Management Styles */
.data-management-section {
  margin-top: var(--space-6);
  text-align: center;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: var(--space-4) 0;
}

.data-title {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: var(--space-3);
  font-weight: var(--font-weight-semibold);
}

.data-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
}

.data-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--transition-base);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.data-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden-input {
  display: none;
}

.data-message {
  margin-top: var(--space-2);
  font-size: var(--font-size-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
}

.data-message.success {
  color: #50ffa0;
  background: rgba(80, 255, 160, 0.1);
}

.data-message.error {
  color: #ff6b6b;
  background: rgba(255, 80, 80, 0.1);
}

/* Mobile Optimization (Portrait) */
@media (max-width: 480px) {
  .conversation-view {
    padding: var(--space-2);
    align-items: flex-start; /* Allow scrolling if needed */
    height: auto;
    min-height: 100vh;
  }

  .conversation-card {
    padding: var(--space-5);
    border-radius: 24px;
    max-width: 100%;
    margin-top: var(--space-2);
    margin-bottom: var(--space-2);
  }

  .card-header {
    padding-top: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .timer-hero {
    margin: var(--space-6) 0 var(--space-4);
  }

  .timer-display {
    font-size: clamp(3rem, 12vw, 4.5rem); /* Responsive font size */
  }

  .cost-main {
    font-size: var(--font-size-3xl);
  }

  .control-bar {
    gap: var(--space-3);
  }

  /* Stack controls but keep them usable */
  .btn-circular {
    width: 56px;
    height: 56px;
  }
  
  .btn-stop {
    width: 100%;
    padding: var(--space-3);
  }
}

/* Landscape Optimization (Mobile) */
@media (max-height: 600px) and (orientation: landscape) {
  .conversation-view {
    padding: var(--space-2);
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
  }

  .conversation-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
    max-width: 600px;
    align-items: center;
  }

  .card-header {
    grid-column: 1 / -1;
    margin-bottom: 0;
    padding-top: var(--space-2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  
  .header-actions {
    position: static;
  }
  
  .brand {
    margin-top: 0;
  }

  .timer-hero {
    margin: 0;
    text-align: left;
  }

  .timer-display {
    font-size: 3rem;
  }

  .cost-display {
    margin-bottom: 0;
    text-align: left;
  }

  .control-bar {
    grid-column: 1 / -1;
    margin-bottom: 0;
    justify-content: flex-start;
  }
  
  .mode-bar, .restore-banner, .observation-card, .settings-section, .data-management-section, .app-signature {
    grid-column: 1 / -1;
  }
}

/* Tablet and medium screens */
@media (min-width: 481px) and (max-width: 768px) {
  .conversation-card {
    max-width: 520px;
  }
}

/* Ensure card fits within viewport on all devices */
@media (max-height: 800px) {
  .conversation-card {
    margin: var(--space-2) auto;
  }
}

/* Confirmation Modal */
.confirmation-modal {
  background: rgba(30, 30, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: var(--space-8);
  width: 90%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.warning-icon {
  color: #ff6b6b;
  margin-bottom: var(--space-4);
  display: flex;
  justify-content: center;
}

.confirmation-title {
  color: white;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-3);
}

.confirmation-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin-bottom: var(--space-2);
}

.confirmation-subtext {
  color: #ff6b6b;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.btn-confirm {
  background: #ff4757;
  color: white;
  border: none;
  padding: var(--space-3);
  border-radius: 12px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-confirm:hover {
  background: #ff6b81;
  transform: translateY(-1px);
}

.btn-cancel {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--space-3);
  border-radius: 12px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

/* Signature */
.app-signature {
  text-align: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: var(--space-8);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
