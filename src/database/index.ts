import Dexie, { Table } from 'dexie'

// Session Types
export type SessionType = 'focus' | 'deep-focus' | 'conversation' | 'pause'

export interface Session {
    id?: number
    type: SessionType
    startedAt: Date
    completedAt?: Date          // When stopped (undefined if incomplete)
    elapsedSeconds: number
    participants: number
    hourlyRate: number
    totalCost: number
    isCompleted: boolean        // false = can be restored
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
class HearaDatabase extends Dexie {
    sessions!: Table<Session, number>
    settings!: Table<UserSettings, number>
    weeklyStats!: Table<WeeklyStats, number>

    constructor() {
        super('HearaDB')

        this.version(1).stores({
            sessions: '++id, type, isCompleted, startedAt',
            settings: '++id',
            weeklyStats: '++id, weekStart'
        })
    }
}

export const db = new HearaDatabase()

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

// Session Management Helpers

/**
 * Save a new session
 */
export async function saveSession(session: Omit<Session, 'id'>): Promise<number> {
    return await db.sessions.add(session)
}

/**
 * Update an existing session
 */
export async function updateSession(id: number, updates: Partial<Session>): Promise<void> {
    await db.sessions.update(id, updates)
}

/**
 * Get the last incomplete session (if any)
 * FIXED: Use filter instead of IndexedDB where clause for boolean
 */
export async function getIncompleteSession(): Promise<Session | undefined> {
    const sessions = await db.sessions.toArray()
    const incomplete = sessions
        .filter(s => !s.isCompleted)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())

    return incomplete[0]
}

/**
 * Mark a session as completed
 */
export async function completeSession(id: number): Promise<void> {
    await db.sessions.update(id, {
        isCompleted: true,
        completedAt: new Date()
    })
}

/**
 * Get recent completed sessions (limit = 10 by default)
 * FIXED: Use filter instead of IndexedDB where clause for boolean
 */
export async function getRecentSessions(limit: number = 10): Promise<Session[]> {
    const sessions = await db.sessions.toArray()
    return sessions
        .filter(s => s.isCompleted)
        .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
        .slice(0, limit)
}

/**
 * Get session by ID
 */
export async function getSessionById(id: number): Promise<Session | undefined> {
    return await db.sessions.get(id)
}
