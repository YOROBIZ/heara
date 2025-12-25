import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSessionsForDateRange } from '@/database'
import type { Session } from '@/database'

export const useAnalyticsStore = defineStore('analytics', () => {
    const weeklySessions = ref<Session[]>([])
    const isLoading = ref(false)

    // Calculate last 7 days (rolling window - shows data immediately!)
    const last7DaysRange = computed(() => {
        const now = new Date()
        now.setHours(23, 59, 59, 999) // End of today

        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 6) // 7 days total (including today)
        sevenDaysAgo.setHours(0, 0, 0, 0)

        console.log('[Analytics] Date range:', sevenDaysAgo, 'to', now)
        return { start: sevenDaysAgo, end: now }
    })

    // Meeting time in seconds
    const meetingTime = computed(() => {
        return weeklySessions.value
            .filter(s => s.type === 'conversation')
            .reduce((acc, s) => acc + s.elapsedSeconds, 0)
    })

    // Focus time in seconds (focus + deep-focus)
    const focusTime = computed(() => {
        return weeklySessions.value
            .filter(s => s.type === 'focus' || s.type === 'deep-focus')
            .reduce((acc, s) => acc + s.elapsedSeconds, 0)
    })

    // Total meeting cost
    const totalMeetingCost = computed(() => {
        return weeklySessions.value
            .filter(s => s.type === 'conversation')
            .reduce((acc, s) => acc + s.totalCost, 0)
    })

    // Focus percentage
    const focusPercentage = computed(() => {
        const total = meetingTime.value + focusTime.value
        if (total === 0) return 0
        return Math.round((focusTime.value / total) * 100)
    })

    // Rule-based weekly insight (PM-approved order: focus% before cost)
    const weeklyInsight = computed(() => {
        if (weeklySessions.value.length === 0) {
            return "Start your first session to see your weekly mirror."
        }

        const focusPct = focusPercentage.value
        const cost = totalMeetingCost.value

        // Priority 1: High focus
        if (focusPct > 70) {
            return "Exceptional focus. You're protecting deep work."
        }

        // Priority 2: Low focus
        if (focusPct < 40 && meetingTime.value > 0) {
            return "Meetings consuming capacity. Review recurring syncs."
        }

        // Priority 3: High cost
        if (cost > 1000) {
            return `Significant investment (€${cost.toFixed(0)}). Ensure every minute counts.`
        }

        // Default: balanced
        return "Balanced week. Keep prioritizing high-leverage conversations."
    })

    // Load weekly data
    async function loadWeeklyData() {
        isLoading.value = true
        try {
            const { start, end } = last7DaysRange.value
            console.log('[Analytics] Loading data for last 7 days:', start, 'to', end)
            weeklySessions.value = await getSessionsForDateRange(start, end)
            console.log('[Analytics] Loaded sessions:', weeklySessions.value.length, weeklySessions.value)
        } catch (error) {
            console.error('Failed to load weekly analytics:', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        weeklySessions,
        isLoading,
        last7DaysRange,
        meetingTime,
        focusTime,
        totalMeetingCost,
        focusPercentage,
        weeklyInsight,
        loadWeeklyData
    }
})
