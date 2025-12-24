<template>
  <div class="timer-display">
    <div class="timer-value">{{ formattedTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  seconds: number
}>()

const formattedTime = computed(() => {
  const mins = Math.floor(props.seconds / 60)
  const secs = props.seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})
</script>

<style scoped>
.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--space-8) 0;
}

.timer-value {
  font-size: clamp(3rem, 12vw, 4.5rem);
  font-weight: var(--font-weight-bold);
  color: white;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
