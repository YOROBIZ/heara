import { db } from './src/database/index.ts'

async function injectMockData() {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday
    const monday = new Date(new Date().setDate(diff))

    const sessions = [
        // Monday: Long meeting
        {
            type: 'conversation',
            startedAt: new Date(new Date(monday).setHours(10, 0, 0)),
            completedAt: new Date(new Date(monday).setHours(11, 0, 0)),
            elapsedSeconds: 3600,
            participants: 5,
            hourlyRate: 100,
            totalCost: 500,
            isCompleted: true
        },
        // Tuesday: Deep Focus
        {
            type: 'deep-focus',
            startedAt: new Date(new Date(monday).setDate(monday.getDate() + 1)).setHours(9, 0, 0),
            completedAt: new Date(new Date(monday).setDate(monday.getDate() + 1)).setHours(12, 0, 0),
            elapsedSeconds: 10800,
            participants: 1,
            hourlyRate: 50,
            totalCost: 0,
            isCompleted: true
        },
        // Wednesday: High cost meeting
        {
            type: 'conversation',
            startedAt: new Date(new Date(monday).setDate(monday.getDate() + 2)).setHours(14, 0, 0),
            completedAt: new Date(new Date(monday).setDate(monday.getDate() + 2)).setHours(14, 30, 0),
            elapsedSeconds: 1800,
            participants: 10,
            hourlyRate: 150,
            totalCost: 750,
            isCompleted: true
        }
    ]

    for (const s of sessions) {
        await db.sessions.add(s)
    }
    console.log("Mock data injected for current week!")
}

injectMockData()
