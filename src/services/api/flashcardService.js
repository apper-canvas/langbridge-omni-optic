import flashcardsData from '../mockData/flashcards.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let flashcards = [...flashcardsData]

export const flashcardService = {
  async getAll() {
    await delay(300)
    return [...flashcards]
  },

  async getById(id) {
    await delay(200)
    const card = flashcards.find(c => c.id === id)
    return card ? { ...card } : null
  },

  async getByLanguage(language) {
    await delay(300)
    return flashcards.filter(c => c.language === language)
  },

  async getDueCards(language) {
    await delay(250)
    const now = new Date()
    return flashcards.filter(c => 
      c.language === language && 
      new Date(c.nextReview) <= now
    )
  },

  async create(cardData) {
    await delay(300)
    const newCard = {
      id: `card-${Date.now()}`,
      language: cardData.language || 'spanish',
      front: cardData.front,
      back: cardData.back,
      category: cardData.category || 'general',
      difficulty: 0,
      nextReview: new Date().toISOString(),
      interval: 1,
      easeFactor: 2.5,
      ...cardData
    }
    flashcards.push(newCard)
    return { ...newCard }
  },

  async update(id, updates) {
    await delay(300)
    const index = flashcards.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Card not found')
    
    flashcards[index] = { ...flashcards[index], ...updates }
    return { ...flashcards[index] }
  },

  async updateAfterReview(id, rating) {
    await delay(200)
    const index = flashcards.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Card not found')
    
    const card = flashcards[index]
    let newInterval = card.interval
    let newEaseFactor = card.easeFactor
    
    // Simplified spaced repetition algorithm
    switch(rating) {
      case 'again': // 0
        newInterval = 1
        newEaseFactor = Math.max(1.3, card.easeFactor - 0.2)
        break
      case 'hard': // 1
        newInterval = Math.max(1, Math.round(card.interval * 1.2))
        newEaseFactor = Math.max(1.3, card.easeFactor - 0.15)
        break
      case 'good': // 2
        newInterval = Math.round(card.interval * card.easeFactor)
        break
      case 'easy': // 3
        newInterval = Math.round(card.interval * card.easeFactor * 1.3)
        newEaseFactor = card.easeFactor + 0.15
        break
    }
    
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)
    
    flashcards[index] = {
      ...card,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview: nextReviewDate.toISOString(),
      difficulty: card.difficulty + (rating === 'again' ? 1 : rating === 'easy' ? -0.5 : 0)
    }
    
    return { ...flashcards[index] }
  },

  async delete(id) {
    await delay(200)
    const index = flashcards.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Card not found')
    
    flashcards.splice(index, 1)
    return true
  },

  async getStats(language) {
    await delay(200)
    const cards = flashcards.filter(c => c.language === language)
    const now = new Date()
    const due = cards.filter(c => new Date(c.nextReview) <= now).length
    const learned = cards.filter(c => c.interval > 7).length
    
    return {
      total: cards.length,
      due,
      learned,
      new: cards.filter(c => c.interval === 1).length
    }
  }
}