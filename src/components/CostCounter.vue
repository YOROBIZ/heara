<template>
  <div class="cost-counter">
    <div class="cost-main">€{{ formattedCost }}</div>
    <div class="cost-rate">{{ formattedRate }} per minute</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalCost: number
  ratePerMinute: number
}>()

const formattedCost = computed(() => {
  return props.totalCost.toFixed(2)
})

const formattedRate = computed(() => {
  return `€${props.ratePerMinute.toFixed(2)}`
})
</script>

<style scoped>
.cost-counter {
  text-align: center;
  margin: var(--space-6) 0;
}

.cost-main {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin-bottom: var(--space-2);
  font-variant-numeric: tabular-nums;
}

.cost-rate {
  font-size: var(--font-size-base);
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-medium);
}
</style>
