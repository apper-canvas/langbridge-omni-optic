const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let currentUser = {
  id: "user-1",
  email: "learner@langbridge.com",
  dailyGoal: 20,
  streak: 7,
  selectedLanguage: "spanish",
  joinedDate: new Date('2024-01-15').toISOString()
}

export const userService = {
  async getCurrentUser() {
    await delay(200)
    return { ...currentUser }
  },

  async updateUser(updates) {
    await delay(300)
    currentUser = { ...currentUser, ...updates }
    return { ...currentUser }
  },

  async updateStreak(increment = true) {
    await delay(200)
    if (increment) {
      currentUser.streak += 1
    } else {
      currentUser.streak = 0
    }
    return { ...currentUser }
  },

  async setDailyGoal(goal) {
    await delay(200)
    currentUser.dailyGoal = goal
    return { ...currentUser }
  },

  async setLanguage(language) {
    await delay(200)
    currentUser.selectedLanguage = language
    return { ...currentUser }
  }
}