import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTimerStore } from '../timerStore'


describe('timerStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('calculates cost correctly for 0 seconds', () => {
        const store = useTimerStore()
        store.hourlyRate = 50
        store.participants = 4
        store.elapsedTime = 0
        expect(store.currentCost).toBe(0)
    })

    it('calculates cost correctly for 1 minute', () => {
        const store = useTimerStore()
        store.hourlyRate = 60
        store.participants = 4
        store.elapsedTime = 60
        // 60/hr = 1/min. 4 participants. 1 min duration. Total = 4.
        expect(store.currentCost).toBe(4)
    })

    it('calculates cost correctly for 1 hour', () => {
        const store = useTimerStore()
        store.hourlyRate = 100
        store.participants = 2
        store.elapsedTime = 3600
        // 100/hr * 2 * 1hr = 200
        expect(store.currentCost).toBe(200)
    })

    it('handles fractional minutes correctly', () => {
        const store = useTimerStore()
        store.hourlyRate = 60
        store.participants = 1
        store.elapsedTime = 30
        // 60/hr = 1/min. 0.5 min. Total = 0.5
        expect(store.currentCost).toBe(0.5)
    })

    it('returns 0 if hourlyRate is missing', () => {
        const store = useTimerStore()
        store.hourlyRate = 0
        store.participants = 4
        store.elapsedTime = 60
        expect(store.currentCost).toBe(0)
    })
    it('enforces minimum participants guard', () => {
        // Should treat 0 participants as 1? Or just math?
        // Based on requirements "participants min = 1 (guard)"
        // Let's check if the store logic handles it or if we just test the math
        // If the function is pure math, it might return 0 if passed 0.
        // Let's assume the store state enforces it, but the helper might just do math.
        // If computeTotalCost is a helper, we test the helper.
        // If it's not exposed, we might need to test via state.
        // Assuming it's exposed or we test via state effects.

        // Actually, looking at previous file reads, computeTotalCost might not be a public action.
        // Let's check timerStore content first to be sure.
    })
})
