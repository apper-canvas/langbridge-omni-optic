import studySessionsData from '../mockData/studySessions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let studySessions = [...studySessionsData]

export const studySessionService = {
  async getAll() {
    await delay(300)
    return [...studySessions]
  },

  async getById(id) {
    await delay(200)
    const session = studySessions.find(s => s.id === id)
    return session ? { ...session } : null
  },

  async getRecentSessions(limit = 10) {
    await delay(250)
    return [...studySessions]
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit)
  },

  async create(sessionData) {
    await delay(300)
    const newSession = {
      id: `session-${Date.now()}`,
      userId: sessionData.userId || 'user-1',
      startTime: new Date().toISOString(),
      endTime: null,
      cardsStudied: 0,
      accuracy: 0,
      ...sessionData
    }
    studySessions.push(newSession)
    return { ...newSession }
  },

  async update(id, updates) {
    await delay(300)
    const index = studySessions.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Session not found')
    
    studySessions[index] = { ...studySessions[index], ...updates }
    return { ...studySessions[index] }
  },

  async endSession(id, finalStats) {
    await delay(200)
    const index = studySessions.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Session not found')
    
    studySessions[index] = {
      ...studySessions[index],
      endTime: new Date().toISOString(),
      ...finalStats
    }
    
    return { ...studySessions[index] }
  },

  async getWeeklyStats() {
    await delay(300)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const recentSessions = studySessions.filter(s => 
      new Date(s.startTime) >= oneWeekAgo
    )
    
    const totalCards = recentSessions.reduce((sum, s) => sum + s.cardsStudied, 0)
    const totalTime = recentSessions.reduce((sum, s) => {
      if (s.endTime) {
        return sum + (new Date(s.endTime) - new Date(s.startTime))
      }
      return sum
    }, 0)
    
    return {
      sessionsCount: recentSessions.length,
      totalCards,
      totalTimeMinutes: Math.round(totalTime / (1000 * 60)),
      averageAccuracy: recentSessions.length > 0 
        ? recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length
        : 0
    }
  },

  async delete(id) {
    await delay(200)
    const index = studySessions.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Session not found')
    
    studySessions.splice(index, 1)
    return true
  }
}