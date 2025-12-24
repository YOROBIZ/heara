<template>
  <div class="participants-input">
    <button class="adjust-btn" @click="decrement" :disabled="modelValue <= min" aria-label="Decrease participants">
      <span>−</span>
    </button>
    <div class="participants-value">
      <span class="count">{{ modelValue }}</span>
      <span class="label">{{ modelValue === 1 ? 'participant' : 'participants' }}</span>
    </div>
    <button class="adjust-btn" @click="increment" :disabled="modelValue >= max" aria-label="Increase participants">
      <span>+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
}>(), {
  min: 1,
  max: 50
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function increment() {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

function decrement() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>

<style scoped>
.participants-input {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  justify-content: center;
}

.adjust-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.adjust-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.adjust-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.adjust-btn span {
  line-height: 1;
  display: block;
}

.participants-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.count {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: white;
  line-height: 1;
  margin-bottom: var(--space-1);
}

.label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-medium);
}
</style>
