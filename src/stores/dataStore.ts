import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/database'

export const useDataStore = defineStore('data', () => {
    const isExporting = ref(false)
    const isImporting = ref(false)
    const error = ref<string | null>(null)
    const successMessage = ref<string | null>(null)

    // Export all data to JSON
    async function exportData() {
        isExporting.value = true
        error.value = null
        try {
            const sessions = await db.sessions.toArray()
            const data = {
                version: 1,
                exportedAt: new Date().toISOString(),
                source: 'CostClock',
                sessions
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
            a.download = `heara-backup-${dateStr}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            successMessage.value = 'Backup exported successfully'
            setTimeout(() => successMessage.value = null, 3000)
        } catch (e: any) {
            console.error('Export failed:', e)
            error.value = 'Failed to export data'
            setTimeout(() => error.value = null, 3000)
        } finally {
            isExporting.value = false
        }
    }

    // Import data from JSON file (Wipe & Replace)
    async function importData(file: File) {
        isImporting.value = true
        error.value = null
        try {
            const text = await file.text()
            const data = JSON.parse(text)

            // Strict Validation
            if (!data.sessions || !Array.isArray(data.sessions)) {
                throw new Error('Invalid backup file: missing sessions array')
            }
            if (data.source !== 'CostClock') {
                // Optional: warn but allow, or strict block. Let's be strict for safety.
                // throw new Error('Invalid backup source')
            }

            // Wipe & Replace Transaction
            const count = await db.transaction('rw', db.sessions, async () => {
                await db.sessions.clear()

                let imported = 0
                for (const session of data.sessions) {
                    // Rehydrate Dates
                    session.startedAt = new Date(session.startedAt)
                    if (session.completedAt) session.completedAt = new Date(session.completedAt)
                    else if (session.endedAt) session.completedAt = new Date(session.endedAt) // Handle legacy field

                    // Insert
                    await db.sessions.add(session)
                    imported++
                }
                return imported
            })

            successMessage.value = `Restored ${count} sessions. Reloading...`

            // Reload window to reflect changes
            setTimeout(() => window.location.reload(), 1500)

        } catch (e: any) {
            console.error('Import failed:', e)
            error.value = e.message || 'Failed to import data'
            setTimeout(() => error.value = null, 3000)
        } finally {
            isImporting.value = false
        }
    }

    return {
        isExporting,
        isImporting,
        error,
        successMessage,
        exportData,
        importData
    }
})
