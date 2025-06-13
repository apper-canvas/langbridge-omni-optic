import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import { flashcardService } from '@/services'
import ApperIcon from '@/components/ApperIcon'

const MyCards = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const categories = ['all', 'greetings', 'basic', 'advanced', 'phrases']
  const languages = ['all', 'spanish', 'french', 'german']

  const loadCards = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allCards = await flashcardService.getAll()
      setCards(allCards)
    } catch (err) {
      setError(err.message || 'Failed to load cards')
      toast.error('Failed to load flashcards')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to delete this card?')) return

    try {
      await flashcardService.delete(cardId)
      setCards(cards.filter(c => c.id !== cardId))
      toast.success('Card deleted successfully')
    } catch (err) {
      toast.error('Failed to delete card')
    }
  }

  const handleSaveCard = async (cardData) => {
    try {
      if (editingCard) {
        const updatedCard = await flashcardService.update(editingCard.id, cardData)
        setCards(cards.map(c => c.id === editingCard.id ? updatedCard : c))
        toast.success('Card updated successfully')
      } else {
        const newCard = await flashcardService.create(cardData)
        setCards([...cards, newCard])
        toast.success('Card created successfully')
      }
      setShowAddModal(false)
      setEditingCard(null)
    } catch (err) {
      toast.error(editingCard ? 'Failed to update card' : 'Failed to create card')
    }
  }

  // Filter cards based on search and filters
  const filteredCards = cards.filter(card => {
    const matchesSearch = searchTerm === '' || 
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory
    const matchesLanguage = selectedLanguage === 'all' || card.language === selectedLanguage
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  useEffect(() => {
    loadCards()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-surface-200 rounded w-64"></div>
              <div className="h-10 bg-surface-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} type="card" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <ErrorState 
            message={error}
            onRetry={loadCards}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">
              My Flashcards
            </h1>
            <p className="text-surface-600 mt-1">
              {cards.length} cards total • {filteredCards.length} shown
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            icon="Plus"
          >
            Add New Card
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedLanguage('all')
              }}
              icon="RotateCcw"
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <EmptyState
            icon="CreditCard"
            title={cards.length === 0 ? "No flashcards yet" : "No cards match your filters"}
            description={cards.length === 0 
              ? "Create your first flashcard to get started with your language learning journey."
              : "Try adjusting your search terms or filters to find the cards you're looking for."
            }
            actionLabel={cards.length === 0 ? "Create First Card" : undefined}
            onAction={cards.length === 0 ? () => setShowAddModal(true) : undefined}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, translateY: -4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {card.language}
                      </span>
                      <span className="text-xs px-2 py-1 bg-surface-100 text-surface-600 rounded-full">
                        {card.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingCard(card)
                          setShowAddModal(true)
                        }}
                        className="p-1 hover:bg-surface-100 rounded"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4 text-surface-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1 hover:bg-error/10 text-error rounded"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-surface-500 uppercase tracking-wide mb-1">
                        Front
                      </div>
                      <div className="text-lg font-medium text-surface-900 break-words">
                        {card.front}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-surface-500 uppercase tracking-wide mb-1">
                        Back
                      </div>
                      <div className="text-surface-700 break-words">
                        {card.back}
                      </div>
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div className="mt-4 pt-4 border-t border-surface-100">
                    <div className="flex items-center justify-between text-xs text-surface-500">
                      <span>Interval: {card.interval} days</span>
                      <span>Difficulty: {card.difficulty.toFixed(1)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Add/Edit Card Modal */}
        <CardModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingCard(null)
          }}
          onSave={handleSaveCard}
          card={editingCard}
        />
      </div>
    </div>
  )
}

// Card Modal Component
const CardModal = ({ isOpen, onClose, onSave, card }) => {
  const [formData, setFormData] = useState({
    front: '',
    back: '',
    language: 'spanish',
    category: 'basic'
  })

  useEffect(() => {
    if (card) {
      setFormData({
        front: card.front,
        back: card.back,
        language: card.language,
        category: card.category
      })
    } else {
      setFormData({
        front: '',
        back: '',
        language: 'spanish',
        category: 'basic'
      })
    }
  }, [card])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.front.trim() || !formData.back.trim()) {
      toast.error('Please fill in both front and back of the card')
      return
    }
    
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              {card ? 'Edit Flashcard' : 'Add New Flashcard'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Language & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="greetings">Greetings</option>
                  <option value="advanced">Advanced</option>
                  <option value="phrases">Phrases</option>
                </select>
              </div>
            </div>

            {/* Front */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Front (Original Language)
              </label>
              <textarea
                value={formData.front}
                onChange={(e) => setFormData({...formData, front: e.target.value})}
                placeholder="Enter the word or phrase in the target language"
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="2"
              />
            </div>

            {/* Back */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Back (Translation)
              </label>
              <textarea
                value={formData.back}
                onChange={(e) => setFormData({...formData, back: e.target.value})}
                placeholder="Enter the translation"
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="2"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                {card ? 'Update Card' : 'Create Card'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MyCards