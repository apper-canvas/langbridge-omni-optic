import speakingChallengesData from '../mockData/speakingChallenges.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let speakingChallenges = [...speakingChallengesData]
let completedChallenges = []

export const speakingChallengeService = {
  async getAll() {
    await delay(300)
    return [...speakingChallenges]
  },

  async getById(id) {
    await delay(200)
    const challenge = speakingChallenges.find(c => c.id === id)
    return challenge ? { ...challenge } : null
  },

  async getDailyChallenge(language) {
    await delay(250)
    const today = new Date().toDateString()
    const languageChallenges = speakingChallenges.filter(c => c.language === language)
    
    // Check if already completed today
    const todayCompleted = completedChallenges.find(c => 
      new Date(c.completedAt).toDateString() === today
    )
    
    if (todayCompleted) {
      return { ...todayCompleted, isCompleted: true }
    }
    
    // Return a random challenge for today
    const randomChallenge = languageChallenges[
      Math.floor(Math.random() * languageChallenges.length)
    ]
    
    return { ...randomChallenge, isCompleted: false }
  },

  async getByLanguage(language) {
    await delay(300)
    return speakingChallenges.filter(c => c.language === language)
  },

  async create(challengeData) {
    await delay(300)
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      language: challengeData.language || 'spanish',
      prompt: challengeData.prompt,
      difficulty: challengeData.difficulty || 'beginner',
      audioUrl: challengeData.audioUrl || null,
      completedAt: null,
      ...challengeData
    }
    speakingChallenges.push(newChallenge)
    return { ...newChallenge }
  },

  async completeChallenge(challengeId, audioBlob = null) {
    await delay(400)
    const challenge = speakingChallenges.find(c => c.id === challengeId)
    if (!challenge) throw new Error('Challenge not found')
    
    const completedChallenge = {
      ...challenge,
      completedAt: new Date().toISOString(),
      audioUrl: audioBlob ? `data:audio/wav;base64,${Date.now()}` : null
    }
    
    // Add to completed challenges
    completedChallenges.push(completedChallenge)
    
    return { ...completedChallenge }
  },

  async getCompletedChallenges(limit = 10) {
    await delay(250)
    return [...completedChallenges]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit)
  },

  async getStreakInfo() {
    await delay(200)
    // Calculate consecutive days with completed challenges
    const sortedCompleted = [...completedChallenges]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < sortedCompleted.length; i++) {
      const completedDate = new Date(sortedCompleted[i].completedAt)
      const daysDiff = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }
    
    return {
      currentStreak: streak,
      totalCompleted: completedChallenges.length,
      lastCompleted: completedChallenges.length > 0 ? completedChallenges[0].completedAt : null
    }
  },

  async update(id, updates) {
    await delay(300)
    const index = speakingChallenges.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Challenge not found')
    
    speakingChallenges[index] = { ...speakingChallenges[index], ...updates }
    return { ...speakingChallenges[index] }
  },

  async delete(id) {
    await delay(200)
    const index = speakingChallenges.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Challenge not found')
    
    speakingChallenges.splice(index, 1)
    return true
  }
}