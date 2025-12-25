import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSessionsForDateRange } from '@/database'
import type { Session } from '@/database'

export const useAnalyticsStore = defineStore('analytics', () => {
    const weeklySessions = ref<Session[]>([])
    const isLoading = ref(false)

    // Calculate current week (Monday 00:00 to Sunday 23:59)
    const currentWeekRange = computed(() => {
        const now = new Date()
        const day = now.getDay() // 0 (Sun) to 6 (Sat)
        const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday

        const monday = new Date(now.setDate(diff))
        monday.setHours(0, 0, 0, 0)

        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        sunday.setHours(23, 59, 59, 999)

        return { start: monday, end: sunday }
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
            const { start, end } = currentWeekRange.value
            weeklySessions.value = await getSessionsForDateRange(start, end)
        } catch (error) {
            console.error('Failed to load weekly analytics:', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        weeklySessions,
        isLoading,
        currentWeekRange,
        meetingTime,
        focusTime,
        totalMeetingCost,
        focusPercentage,
        weeklyInsight,
        loadWeeklyData
    }
})
