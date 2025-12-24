import Dexie, { Table } from 'dexie'

// Session Types
export type SessionType = 'focus' | 'deep-focus' | 'conversation' | 'pause'

export interface Session {
    id?: number
    type: SessionType
    startTime: number
    endTime?: number
    duration?: number
    participants?: number
    hourlyCost?: number
    totalCost?: number
    notes?: string
}

export interface UserSettings {
    id?: number
    annualSalary?: number
    hourlyRate?: number
    defaultParticipants: number
    weeklyDeepWorkGoal: number
    maxMeetingTime: number
}

export interface WeeklyStats {
    id?: number
    weekStart: number
    totalFocusTime: number
    totalMeetingTime: number
    totalDeepWorkTime: number
    totalBreakTime: number
    totalMeetingCost: number
    sessionsCount: number
}

// Database Class
class CostClockDatabase extends Dexie {
    sessions!: Table<Session, number>
    settings!: Table<UserSettings, number>
    weeklyStats!: Table<WeeklyStats, number>

    constructor() {
        super('CostClockDB')

        this.version(1).stores({
            sessions: '++id, type, startTime, endTime',
            settings: '++id',
            weeklyStats: '++id, weekStart'
        })
    }
}

export const db = new CostClockDatabase()

// Initialize default settings if not exists
export async function initializeSettings(): Promise<void> {
    const count = await db.settings.count()
    if (count === 0) {
        await db.settings.add({
            defaultParticipants: 4,
            weeklyDeepWorkGoal: 20, // hours
            maxMeetingTime: 45 // minutes
        })
    }
}
