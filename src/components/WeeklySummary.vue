<template>
  <div class="weekly-summary">
    <div class="summary-header">
      <h3 class="summary-title">Last 7 Days</h3>
      <p class="summary-subtitle">{{ formatDate(range.start) }} — {{ formatDate(range.end) }}</p>
    </div>

    <div v-if="isLoading" class="summary-loading">
      Loading your week...
    </div>

    <div v-else class="summary-content">
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Meetings</span>
          <span class="metric-value">{{ formatDuration(meetingTime) }}</span>
          <span class="metric-sub">Cost: €{{ totalMeetingCost.toFixed(2) }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Focus</span>
          <span class="metric-value">{{ formatDuration(focusTime) }}</span>
          <span class="metric-sub">{{ focusPercentage }}% of total time</span>
        </div>
      </div>

      <!-- Ratio Bar -->
      <div class="ratio-container">
        <div class="ratio-labels">
          <span>Meetings</span>
          <span>Focus</span>
        </div>
        <div class="ratio-bar">
          <div 
            class="ratio-segment ratio-meetings" 
            :style="{ width: (100 - focusPercentage) + '%' }"
          ></div>
          <div 
            class="ratio-segment ratio-focus" 
            :style="{ width: focusPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- The Insight -->
      <div class="insight-card">
        <div class="insight-icon">
          <Sparkles :size="20" :stroke-width="2.5" />
        </div>
        <p class="insight-text">{{ weeklyInsight }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { Sparkles } from 'lucide-vue-next'

const analyticsStore = useAnalyticsStore()
const { 
  isLoading, 
  meetingTime, 
  focusTime, 
  totalMeetingCost, 
  focusPercentage, 
  weeklyInsight 
} = storeToRefs(analyticsStore)

// Fetch range for display
const range = analyticsStore.last7DaysRange

onMounted(() => {
  console.log('[WeeklySummary] Component mounted, loading data...')
  analyticsStore.loadWeeklyData()
})

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}
</script>

<style scoped>
.weekly-summary {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-6);
}

.summary-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.summary-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-1);
}

.summary-subtitle {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
}

.summary-loading {
  text-align: center;
  padding: var(--space-12);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.metric-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.metric-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-1);
}

.metric-sub {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.5);
}

.ratio-container {
  margin-bottom: var(--space-10);
}

.ratio-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
}

.ratio-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  overflow: hidden;
}

.ratio-segment {
  transition: width 0.3s ease;
}

.ratio-meetings {
  background: #f59e0b;
  opacity: 0.8;
}

.ratio-focus {
  background: #10b981;
}

.insight-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: var(--space-6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.insight-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.insight-text {
  font-size: var(--font-size-base);
  color: white;
  line-height: 1.5;
  font-weight: var(--font-weight-medium);
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
