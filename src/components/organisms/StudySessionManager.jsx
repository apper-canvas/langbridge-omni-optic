import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import FlashCard from '@/components/molecules/FlashCard'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/atoms/ProgressRing' 
import { flashcardService, studySessionService } from '@/services'
import ApperIcon from '@/components/ApperIcon'

const StudySessionManager = ({ language = 'spanish', onSessionComplete }) => {
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correct: 0,
    accuracy: 0
  })

  // Load due cards for study session
  const initializeSession = useCallback(async () => {
    setLoading(true)
    try {
      const dueCards = await flashcardService.getDueCards(language)
      
      if (dueCards.length === 0) {
        toast.info('No cards due for review right now!')
        onSessionComplete && onSessionComplete({ cardsStudied: 0, accuracy: 0 })
        return
      }

      setCards(dueCards)
      
      // Create new study session
      const newSession = await studySessionService.create({
        userId: 'user-1',
        startTime: new Date().toISOString(),
        cardsStudied: 0,
        accuracy: 0
      })
      
      setSession(newSession)
      toast.success(`Study session started! ${dueCards.length} cards to review.`)
    } catch (error) {
      toast.error('Failed to start study session')
    } finally {
      setLoading(false)
    }
  }, [language, onSessionComplete])

  // Handle card rating
  const handleCardRating = async (rating) => {
    if (!cards[currentCardIndex] || !session) return

    const currentCard = cards[currentCardIndex]
    
    try {
      // Update card with spaced repetition algorithm
      await flashcardService.updateAfterReview(currentCard.id, rating)
      
      // Update session stats
      const isCorrect = rating === 'good' || rating === 'easy'
      const newStats = {
        cardsStudied: sessionStats.cardsStudied + 1,
        correct: sessionStats.correct + (isCorrect ? 1 : 0),
        accuracy: Math.round(((sessionStats.correct + (isCorrect ? 1 : 0)) / (sessionStats.cardsStudied + 1)) * 100)
      }
      
      setSessionStats(newStats)
      
      // Show feedback
      if (isCorrect) {
        toast.success('Great job! 🎉')
      } else if (rating === 'hard') {
        toast.info('You\'ll see this card again soon')
      } else {
        toast.warning('Don\'t worry, practice makes perfect!')
      }
      
      // Move to next card or complete session
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
      } else {
        await completeSession(newStats)
      }
      
    } catch (error) {
      toast.error('Failed to process card rating')
    }
  }

  // Complete study session
  const completeSession = async (finalStats) => {
    if (!session) return

    try {
      await studySessionService.endSession(session.id, finalStats)
      toast.success(`Session complete! You studied ${finalStats.cardsStudied} cards with ${finalStats.accuracy}% accuracy.`)
      onSessionComplete && onSessionComplete(finalStats)
    } catch (error) {
      toast.error('Failed to save session')
    }
  }

  // End session early
  const endSessionEarly = async () => {
    if (!session) return

    try {
      await studySessionService.endSession(session.id, sessionStats)
      toast.info('Study session ended early')
      onSessionComplete && onSessionComplete(sessionStats)
    } catch (error) {
      toast.error('Failed to end session')
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!cards[currentCardIndex]) return

      switch(event.key) {
        case '1':
          handleCardRating('again')
          break
        case '2':
          handleCardRating('hard')
          break
        case '3':
          handleCardRating('good')
          break
        case '4':
          handleCardRating('easy')
          break
        case ' ':
          event.preventDefault()
          // Flip handled by FlashCard component
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentCardIndex, cards])

  // Initialize session on mount
  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-600">Preparing your study session...</p>
        </div>
      </div>
    )
  }

  if (!cards.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
          All caught up!
        </h3>
        <p className="text-surface-600 mb-6">
          No cards are due for review right now. Great job staying on top of your studies!
        </p>
        <Button onClick={() => onSessionComplete && onSessionComplete({ cardsStudied: 0, accuracy: 100 })}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / cards.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          {/* Progress Ring */}
          <ProgressRing 
            progress={progress} 
            size={80} 
            strokeWidth={6}
            color="#5B4FE5"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-surface-900">
                {currentCardIndex + 1}
              </div>
              <div className="text-xs text-surface-500">
                of {cards.length}
              </div>
            </div>
          </ProgressRing>
          
          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-surface-900">
                {sessionStats.cardsStudied}
              </div>
              <div className="text-sm text-surface-600">
                Studied
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-success">
                {sessionStats.accuracy}%
              </div>
              <div className="text-sm text-surface-600">
                Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* End Session Button */}
        <Button 
          variant="ghost" 
          onClick={endSessionEarly}
          icon="X"
        >
          End Session
        </Button>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <FlashCard
            card={currentCard}
            onRate={handleCardRating}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default StudySessionManager