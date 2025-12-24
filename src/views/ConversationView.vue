<template>
  <div class="conversation-view">
    <!-- Header -->
    <header class="conversation-header">
      <div class="brand">
        <h1 class="brand-name">Heara</h1>
        <p class="brand-tagline">Hear what truly matters</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="conversation-main">
      <!-- Mode Indicator -->
      <div class="mode-indicator">
        <MessageCircle :size="24" :stroke-width="2" />
        <span class="mode-name">Conversation</span>
      </div>

      <!-- Participants Control -->
      <div class="participants-section">
        <ParticipantsInput v-model="participants" :min="1" :max="50" />
      </div>

      <!-- Timer Display -->
      <TimerDisplay :seconds="elapsedTime" />

      <!-- Cost Counter -->
      <CostCounter v-if="hourlyRate" :total-cost="currentCost" :rate-per-minute="costPerMinute" />

      <!-- Observation Message (shown when > 45min) -->
      <div v-if="showObservation" class="observation-card">
        <p class="observation-message">This conversation has reached its natural point.</p>
        <p class="observation-suggestion">You may want to wrap up or refocus.</p>
      </div>

      <!-- Control Buttons -->
      <div class="controls">
        <Button v-if="!isRunning && elapsedTime === 0" variant="primary" @click="startConversation" :disabled="!hourlyRate">
          Begin
        </Button>
        
        <template v-else>
          <Button variant="ghost" @click="togglePause">
            <component :is="isRunning ? Pause : Play" :size="18" :stroke-width="2" />
            {{ isRunning ? 'Pause' : 'Resume' }}
          </Button>
          <Button variant="danger" @click="stopConversation">
            <Square :size="18" :stroke-width="2" />
            Stop
          </Button>
        </template>
      </div>

      <!-- Settings (only shown when not running) -->
      <div v-if="!isRunning && elapsedTime === 0" class="settings-card">
        <label class="settings-label">
          <span>Hourly rate (€)</span>
          <input 
            v-model.number="hourlyRate" 
            type="number" 
            min="0" 
            step="10"
            placeholder="Enter hourly rate"
            class="settings-input"
          />
        </label>
        <p class="settings-hint">Used to calculate conversation cost</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTimerStore } from '@/stores/timerStore'
import { storeToRefs } from 'pinia'
import { MessageCircle, Pause, Play, Square } from 'lucide-vue-next'
import TimerDisplay from '@/components/TimerDisplay.vue'
import CostCounter from '@/components/CostCounter.vue'
import ParticipantsInput from '@/components/ParticipantsInput.vue'
import Button from '@/components/Button.vue'

const timerStore = useTimerStore()
const { isRunning, elapsedTime } = storeToRefs(timerStore)

// Local state
const participants = ref(4)
const hourlyRate = ref<number | null>(50)

// Computed
const costPerMinute = computed(() => {
  if (!hourlyRate.value) return 0
  return (hourlyRate.value * participants.value) / 60
})

const currentCost = computed(() => {
  const minutes = elapsedTime.value / 60
  return costPerMinute.value * minutes
})

const showObservation = computed(() => {
  return elapsedTime.value > 45 * 60 // > 45 minutes
})

// Methods
function startConversation() {
  if (!hourlyRate.value) return
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
</script>

<style scoped>
.conversation-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
}

.conversation-header {
  margin-bottom: var(--space-8);
}

.brand {
  text-align: center;
}

.brand-name {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-1);
  letter-spacing: -0.02em;
}

.brand-tagline {
  font-size: var(--font-size-base);
  color: rgba(255, 255, 255, 0.85);
  font-weight: var(--font-weight-normal);
}

.conversation-main {
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.mode-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  color: white;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.mode-indicator svg {
  opacity: 0.9;
}

.participants-section {
  margin: var(--space-4) 0;
}

.observation-card {
  background: rgba(245, 158, 11, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid rgba(245, 158, 11, 0.3);
  text-align: center;
}

.observation-message {
  font-size: var(--font-size-lg);
  color: white;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

.observation-suggestion {
  font-size: var(--font-size-base);
  color: rgba(255, 255, 255, 0.85);
  font-weight: var(--font-weight-normal);
}

.controls {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin-top: var(--space-6);
}

.controls Button {
  min-width: 120px;
}

.settings-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.settings-label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: white;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
}

.settings-input {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-base);
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-base);
  transition: all var(--transition-base);
}

.settings-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.settings-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.settings-hint {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
  margin-top: var(--space-2);
  font-weight: var(--font-weight-normal);
}

@media (max-width: 640px) {
  .conversation-view {
    padding: var(--space-4);
  }
  
  .controls {
    flex-direction: column;
  }
  
  .controls Button {
    width: 100%;
  }
}
</style>
