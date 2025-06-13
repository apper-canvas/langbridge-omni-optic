import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StudySessionManager from '@/components/organisms/StudySessionManager'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Study = () => {
  const navigate = useNavigate()
  const [sessionActive, setSessionActive] = useState(false)
  const [language] = useState('spanish') // This would come from user settings

  const handleSessionComplete = (stats) => {
    setSessionActive(false)
    
    // Show completion celebration
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  const startSession = () => {
    setSessionActive(true)
  }

  if (sessionActive) {
    return (
      <div className="min-h-full bg-background">
        <div className="p-6 max-w-full overflow-hidden">
          <StudySessionManager
            language={language}
            onSessionComplete={handleSessionComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-background">
      <div className="p-6 max-w-full overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-heading font-bold text-surface-900 mb-4">
              Ready to Study?
            </h1>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Practice your flashcards with our spaced repetition system. 
              The more you practice, the better you'll remember!
            </p>
          </motion.div>

          {/* Study Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {/* Quick Review */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-surface-200 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Zap" className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-surface-900 mb-3">
                Quick Review
              </h2>
              <p className="text-surface-600 mb-6">
                Review cards that are due today. Perfect for daily practice sessions.
              </p>
              <Button
                onClick={startSession}
                size="lg"
                className="w-full"
              >
                Start Quick Review
              </Button>
            </div>

            {/* Intensive Session */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-surface-200 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Brain" className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-surface-900 mb-3">
                Intensive Session
              </h2>
              <p className="text-surface-600 mb-6">
                Extended study session with all available cards for deeper learning.
              </p>
              <Button
                onClick={startSession}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Start Intensive Session
              </Button>
            </div>
          </motion.div>

          {/* Study Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-info/5 border border-info/20 rounded-xl p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Lightbulb" className="w-5 h-5 text-info" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-surface-900 mb-3">
                  Study Tips for Better Results
                </h3>
                <ul className="space-y-2 text-surface-700">
                  <li className="flex items-start">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Be honest with your ratings - it helps the algorithm schedule cards optimally</span>
                  </li>
                  <li className="flex items-start">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use keyboard shortcuts (1-4) for faster reviewing</span>
                  </li>
                  <li className="flex items-start">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Study consistently every day for best retention</span>
                  </li>
                  <li className="flex items-start">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Take breaks if you feel overwhelmed - quality over quantity</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Keyboard Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <h3 className="font-heading font-semibold text-surface-900 mb-4">
              Keyboard Shortcuts
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-surface-200">
                <kbd className="px-2 py-1 bg-surface-100 rounded text-xs">Space</kbd>
                <span className="text-surface-600">Flip card</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-surface-200">
                <kbd className="px-2 py-1 bg-surface-100 rounded text-xs">1</kbd>
                <span className="text-surface-600">Again</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-surface-200">
                <kbd className="px-2 py-1 bg-surface-100 rounded text-xs">2</kbd>
                <span className="text-surface-600">Hard</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-surface-200">
                <kbd className="px-2 py-1 bg-surface-100 rounded text-xs">3</kbd>
                <span className="text-surface-600">Good</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-surface-200">
                <kbd className="px-2 py-1 bg-surface-100 rounded text-xs">4</kbd>
                <span className="text-surface-600">Easy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Study