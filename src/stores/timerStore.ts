import { defineStore } from 'pinia'
// Timer Store - Manages timer state and persistence
import { ref, computed } from 'vue'
import type { SessionType } from '@/database'
import {
    saveSession,
    updateSession,
    completeSession,
    getIncompleteSession
} from '@/database'

export const useTimerStore = defineStore('timer', () => {
    // State
    const isRunning = ref(false)
    const elapsedTime = ref(0)
    const currentMode = ref<SessionType>('conversation')
    const currentSessionId = ref<number | null>(null)
    const participants = ref(4)
    const hourlyRate = ref(50)

    // Timer interval reference
    let intervalId: number | null = null
    let backupIntervalId: number | null = null

    // Computed
    const formattedTime = computed(() => {
        const minutes = Math.floor(elapsedTime.value / 60)
        const seconds = elapsedTime.value % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    })

    const currentCost = computed(() => {
        if (!hourlyRate.value || !participants.value) {
            return 0
        }
        const hours = elapsedTime.value / 3600
        return hourlyRate.value * participants.value * hours
    })

    // Actions
    async function startTimer(mode: SessionType, participantCount: number, rate: number) {
        currentMode.value = mode
        participants.value = participantCount
        hourlyRate.value = rate
        elapsedTime.value = 0
        isRunning.value = true

        // Create session in database
        const sessionId = await saveSession({
            type: mode,
            startedAt: new Date(),
            elapsedSeconds: 0,
            participants: participantCount,
            hourlyRate: rate,
            totalCost: 0,
            isCompleted: false
        })
        currentSessionId.value = sessionId

        startInterval()
    }

    async function pauseTimer() {
        isRunning.value = false
        stopInterval()

        // Save current progress
        if (currentSessionId.value) {
            await updateSession(currentSessionId.value, {
                elapsedSeconds: elapsedTime.value,
                totalCost: currentCost.value
            })
        }
    }

    function resumeTimer() {
        if (isRunning.value || elapsedTime.value === 0) return

        isRunning.value = true
        startInterval()
    }

    async function stopTimer() {
        isRunning.value = false
        stopInterval()

        // Mark session as completed
        if (currentSessionId.value) {
            await updateSession(currentSessionId.value, {
                elapsedSeconds: elapsedTime.value,
                totalCost: currentCost.value
            })
            await completeSession(currentSessionId.value)
            currentSessionId.value = null
        }

        // Reset state
        elapsedTime.value = 0
        participants.value = 4
        hourlyRate.value = 50
    }

    // Restore session state
    async function restoreSession(session: any) {
        console.log('[TimerStore] Restoring session:', session)
        currentMode.value = session.type
        elapsedTime.value = session.elapsedSeconds
        participants.value = session.participants
        hourlyRate.value = session.hourlyRate
        currentSessionId.value = session.id
        isRunning.value = false // Don't auto-resume (Option A)
        console.log('[TimerStore] Session restored. ID:', currentSessionId.value, 'Elapsed:', elapsedTime.value)
    }

    // Load last incomplete session on mount
    async function loadLastSession() {
        console.log('[TimerStore] Loading last session...')
        const session = await getIncompleteSession()
        if (session) {
            console.log('[TimerStore] Found incomplete session:', session)
            await restoreSession(session)
            return session
        }
        console.log('[TimerStore] No incomplete session found')
        return null
    }

    // Backup: auto-save every 5 seconds when running
    function startBackupSave() {
        backupIntervalId = window.setInterval(async () => {
            if (isRunning.value && currentSessionId.value) {
                await updateSession(currentSessionId.value, {
                    elapsedSeconds: elapsedTime.value,
                    totalCost: currentCost.value
                })
            }
        }, 5000) // 5 seconds
    }

    function stopBackupSave() {
        if (backupIntervalId) {
            clearInterval(backupIntervalId)
            backupIntervalId = null
        }
    }

    function startInterval() {
        intervalId = window.setInterval(() => {
            elapsedTime.value++
        }, 1000)
        startBackupSave()
    }

    function stopInterval() {
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
        stopBackupSave()
    }

    return {
        isRunning,
        elapsedTime,
        currentMode,
        participants,
        hourlyRate,
        currentSessionId,
        formattedTime,
        currentCost,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        restoreSession,
        loadLastSession
    }
})
