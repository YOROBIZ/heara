import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '../dataStore'

// Mock the database module
vi.mock('@/database', () => ({
    db: {
        sessions: {
            toArray: vi.fn(() => Promise.resolve([])),
            clear: vi.fn(() => Promise.resolve()),
            add: vi.fn(() => Promise.resolve(1))
        },
        transaction: vi.fn((_mode, _tables, callback) => callback())
    }
}))

describe('dataStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('handles invalid JSON file gracefully', async () => {
        const store = useDataStore()
        const file = new File(['invalid json'], 'backup.json', { type: 'application/json' })

        await store.importData(file)

        expect(store.error).toContain('Unexpected token')
        expect(store.successMessage).toBeNull()
    })

    it('rejects backup missing sessions array', async () => {
        const store = useDataStore()
        const data = { version: 1, source: 'CostClock' } // Missing sessions
        const file = new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' })

        await store.importData(file)

        expect(store.error).toBe('Invalid backup file: missing sessions array')
    })

    it('imports valid backup correctly', async () => {
        const store = useDataStore()
        // Mock window.location.reload
        const originalReload = window.location.reload
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { reload: vi.fn() }
        })

        const validData = {
            version: 1,
            source: 'CostClock',
            sessions: [
                { id: 1, startedAt: new Date().toISOString(), elapsedSeconds: 60, participants: 4, hourlyRate: 50 }
            ]
        }
        const file = new File([JSON.stringify(validData)], 'backup.json', { type: 'application/json' })

        await store.importData(file)

        expect(store.error).toBeNull()
        expect(store.successMessage).toContain('Restored 1 sessions')

        // Restore window.location
        window.location.reload = originalReload
    })
})
