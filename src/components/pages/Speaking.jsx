import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpeakingChallengeInterface from '@/components/organisms/SpeakingChallengeInterface'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Speaking = () => {
  const navigate = useNavigate()
  const [challengeActive, setChallengeActive] = useState(false)
  const [language] = useState('spanish') // This would come from user settings

  const handleChallengeComplete = () => {
    setChallengeActive(false)
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard')
    }, 1000)
  }

  const startChallenge = () => {
    setChallengeActive(true)
  }

  if (challengeActive) {
    return (
      <div className="min-h-full bg-background">
        <div className="p-6 max-w-full overflow-hidden">
          <SpeakingChallengeInterface
            language={language}
            onChallengeComplete={handleChallengeComplete}
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
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Mic" className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-surface-900 mb-4">
              Speaking Practice
            </h1>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Improve your pronunciation and fluency with daily speaking challenges. 
              Practice makes perfect!
            </p>
          </motion.div>

          {/* Challenge Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-surface-200 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-surface-900 mb-2">
                  Daily Challenges
                </h3>
                <p className="text-sm text-surface-600">
                  New speaking prompts every day to keep you practicing
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Volume2" className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-surface-900 mb-2">
                  Record & Review
                </h3>
                <p className="text-sm text-surface-600">
                  Record yourself speaking and listen back to improve
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-heading font-semibold text-surface-900 mb-2">
                  Track Progress
                </h3>
                <p className="text-sm text-surface-600">
                  Build your speaking streak and see your improvement
                </p>
              </div>
            </div>
          </motion.div>

          {/* Start Challenge Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <Button
              onClick={startChallenge}
              size="lg"
              className="px-12 py-4 text-lg"
              icon="Play"
            >
              Start Today's Challenge
            </Button>
          </motion.div>

          {/* Speaking Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Tips Card */}
            <div className="bg-info/5 border border-info/20 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Lightbulb" className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-surface-900 mb-3">
                    Speaking Tips
                  </h3>
                  <ul className="space-y-2 text-surface-700 text-sm">
                    <li>• Speak at a natural, comfortable pace</li>
                    <li>• Don't worry about perfect pronunciation</li>
                    <li>• Focus on expressing your ideas clearly</li>
                    <li>• Practice regularly for best results</li>
                    <li>• Record yourself to track improvement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Microphone Setup */}
            <div className="bg-warning/5 border border-warning/20 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Settings" className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-surface-900 mb-3">
                    Microphone Setup
                  </h3>
                  <ul className="space-y-2 text-surface-700 text-sm">
                    <li>• Make sure your microphone is connected</li>
                    <li>• Allow microphone access when prompted</li>
                    <li>• Find a quiet environment to record</li>
                    <li>• Test your audio before starting</li>
                    <li>• Speak clearly into the microphone</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Speaking