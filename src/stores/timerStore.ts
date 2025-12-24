import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, SessionType } from '@/database'

export const useTimerStore = defineStore('timer', () => {
    // State
    const currentSession = ref<Session | null>(null)
    const isRunning = ref(false)
    const elapsedTime = ref(0)
    const currentMode = ref<SessionType>('focus')

    // Timer interval reference
    let intervalId: number | null = null

    // Computed
    const formattedTime = computed(() => {
        const minutes = Math.floor(elapsedTime.value / 60)
        const seconds = elapsedTime.value % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    })

    const currentCost = computed(() => {
        if (!currentSession.value?.hourlyCost || !currentSession.value?.participants) {
            return 0
        }
        const hours = elapsedTime.value / 3600
        return currentSession.value.hourlyCost * currentSession.value.participants * hours
    })

    // Actions
    function startTimer(mode: SessionType, participants?: number, hourlyRate?: number) {
        if (isRunning.value) return

        currentMode.value = mode
        currentSession.value = {
            type: mode,
            startTime: Date.now(),
            participants,
            hourlyCost: hourlyRate
        }

        isRunning.value = true
        elapsedTime.value = 0

        intervalId = window.setInterval(() => {
            elapsedTime.value++
        }, 1000)
    }

    function pauseTimer() {
        if (!isRunning.value) return

        isRunning.value = false
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    function resumeTimer() {
        if (isRunning.value || !currentSession.value) return

        isRunning.value = true
        intervalId = window.setInterval(() => {
            elapsedTime.value++
        }, 1000)
    }

    function stopTimer() {
        pauseTimer()

        if (currentSession.value) {
            currentSession.value.endTime = Date.now()
            currentSession.value.duration = elapsedTime.value
            currentSession.value.totalCost = currentCost.value
        }

        // Will save to DB later
        const completedSession = currentSession.value

        // Reset state
        currentSession.value = null
        elapsedTime.value = 0

        return completedSession
    }

    function switchMode(mode: SessionType) {
        if (isRunning.value) {
            stopTimer()
        }
        currentMode.value = mode
    }

    return {
        // State
        currentSession,
        isRunning,
        elapsedTime,
        currentMode,

        // Computed
        formattedTime,
        currentCost,

        // Actions
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        switchMode
    }
})
