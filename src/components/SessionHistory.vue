<template>
  <div class="session-history">
    <div class="history-header">
      <h3 class="history-title">Recent Sessions</h3>
      <p class="history-subtitle">Last 10 completed conversations</p>
    </div>

    <div v-if="loading" class="history-loading">
      Loading...
    </div>

    <div v-else-if="sessions.length === 0" class="history-empty">
      <p>No sessions yet</p>
    </div>

    <div v-else class="history-list">
      <div 
        v-for="session in sessions" 
        :key="session.id"
        class="session-item"
      >
        <div class="session-date">
          {{ formatDate(session.completedAt) }}
        </div>
        <div class="session-details">
          <span class="session-duration">{{ formatDuration(session.elapsedSeconds) }}</span>
          <span class="session-separator">·</span>
          <span class="session-cost">€{{ session.totalCost.toFixed(2) }}</span>
          <span class="session-separator">·</span>
          <span class="session-participants">{{ session.participants }} {{ session.participants === 1 ? 'participant' : 'participants' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecentSessions } from '@/database'
import type { Session } from '@/database'

const sessions = ref<Session[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    sessions.value = await getRecentSessions(10)
  } catch (error) {
    console.error('Failed to load sessions:', error)
  } finally {
    loading.value = false
  }
})

function formatDate(date?: Date): string {
  if (!date) return 'Unknown'
  
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays === 1) {
    return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}
</script>

<style scoped>
.session-history {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-6);
}

.history-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.history-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-1);
}

.history-subtitle {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-normal);
}

.history-loading,
.history-empty {
  text-align: center;
  padding: var(--space-8);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.session-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all var(--transition-base);
}

.session-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.session-date {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
}

.session-details {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.85);
}

.session-separator {
  color: rgba(255, 255, 255, 0.4);
}

.session-duration {
  font-weight: var(--font-weight-medium);
}

.session-cost {
  font-weight: var(--font-weight-semibold);
  color: white;
}

.session-participants {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .session-history {
    padding: var(--space-4);
  }

  .session-details {
    flex-wrap: wrap;
  }
}
</style>
