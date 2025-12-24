<template>
  <button :class="['btn', `btn-${variant}`, { 'btn-loading': loading }]" :disabled="disabled || loading" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost' | 'danger' | 'calm'
  disabled?: boolean
  loading?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-family-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Danger/Stop Button (Heara: calm amber, not harsh red) */
.btn-danger {
  background: var(--color-warning);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-warning-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

/* Calm Button (for subtle actions) */
.btn-calm {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-calm:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
}

.btn-loading {
  pointer-events: none;
}
</style>
