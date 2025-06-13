import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'

const FlashCard = ({ 
  card, 
  onRate, 
  showAnswer = false,
  onFlip,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFlip = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setIsFlipped(!isFlipped)
    onFlip && onFlip(!isFlipped)
    
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handleRate = (rating) => {
    if (isAnimating) return
    onRate(rating)
  }

  const difficultyButtons = [
    { rating: 'again', label: 'Again', color: 'error', key: '1' },
    { rating: 'hard', label: 'Hard', color: 'warning', key: '2' },
    { rating: 'good', label: 'Good', color: 'primary', key: '3' },
    { rating: 'easy', label: 'Easy', color: 'success', key: '4' }
  ]

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Flashcard */}
      <motion.div
        className="flip-card w-full h-64 mb-6 cursor-pointer"
        onClick={handleFlip}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`flip-card-inner h-full ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front bg-white border-2 border-surface-200 hover:border-primary/50 transition-colors">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-surface-500 mb-2">
                {card.category}
              </div>
              <div className="text-2xl font-medium text-surface-900 break-words">
                {card.front}
              </div>
              <div className="text-sm text-surface-500 mt-4">
                Click to reveal answer
              </div>
            </div>
          </div>
          
          {/* Back */}
          <div className="flip-card-back bg-primary text-white">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-primary-200 mb-2">
                Translation
              </div>
              <div className="text-2xl font-medium break-words">
                {card.back}
              </div>
              <div className="text-sm text-primary-200 mt-4">
                How well did you know this?
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rating Buttons */}
      {isFlipped && (
        <motion.div 
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {difficultyButtons.map((button, index) => (
            <motion.div
              key={button.rating}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Button
                variant={button.color}
                onClick={() => handleRate(button.rating)}
                className="min-w-[80px]"
              >
                <span className="block">
                  <span className="text-xs opacity-75">{button.key}</span>
                  <br />
                  {button.label}
                </span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Keyboard Shortcuts Helper */}
      {isFlipped && (
        <div className="text-center mt-4 text-xs text-surface-500">
          Use keyboard: 1 (Again) • 2 (Hard) • 3 (Good) • 4 (Easy) • Space (Flip)
        </div>
      )}
    </div>
  )
}

export default FlashCard