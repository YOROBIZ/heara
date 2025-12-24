<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1 class="app-title gradient-primary">⏱️ CostClock</h1>
      <p class="app-tagline">See what your time actually costs</p>
    </header>
    
    <main class="app-main">
      <div class="welcome-card">
        <h2>🚀 Project Initialized</h2>
        <p>CostClock MVP is ready for development</p>
        <div class="status-list">
          <div class="status-item success">✅ Vue 3 + TypeScript</div>
          <div class="status-item success">✅ Pinia State Management</div>
          <div class="status-item success">✅ Design System</div>
          <div class="status-item success">✅ PWA Configuration</div>
          <div class="status-item pending">⏳ Timer Component - Next</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Main App Component - Day 0 Scaffold
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--space-8);
}

.app-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.app-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-extrabold);
  color: white;
  margin-bottom: var(--space-2);
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-tagline {
  font-size: var(--font-size-xl);
  color: rgba(255, 255, 255, 0.9);
  font-weight: var(--font-weight-medium);
}

.app-main {
  max-width: 600px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-2xl);
  text-align: center;
}

.welcome-card h2 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-4);
  color: var(--color-text-primary);
}

.welcome-card p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.status-item {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-medium);
  text-align: left;
}

.status-item.success {
  background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
  color: #065f46;
}

.status-item.pending {
  background: linear-gradient(135deg, #fef5e7 0%, #fff9e6 100%);
  color: #92400e;
}
</style>
