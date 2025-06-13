import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StatCard from '@/components/atoms/StatCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import { userService, flashcardService, studySessionService, speakingChallengeService } from '@/services'
import ApperIcon from '@/components/ApperIcon'

const Dashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [user, cardStats, weeklyStats, speakingStreak] = await Promise.all([
        userService.getCurrentUser(),
        flashcardService.getStats('spanish'),
        studySessionService.getWeeklyStats(),
        speakingChallengeService.getStreakInfo()
      ])

      setDashboardData({
        user,
        cardStats,
        weeklyStats,
        speakingStreak
      })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-96"></div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonLoader count={4} type="stat" />
          </div>
          
          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonLoader count={2} type="card" />
            </div>
            <div className="space-y-6">
              <SkeletonLoader count={2} type="card" />
            </div>
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
            onRetry={loadDashboardData}
          />
        </div>
      </div>
    )
  }

  if (!dashboardData) return null

  const { user, cardStats, weeklyStats, speakingStreak } = dashboardData
  const dailyProgress = Math.min((cardStats.learned / user.dailyGoal) * 100, 100)

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
            Welcome back Chidanand! 👋
          </h1>
          <p className="text-surface-600">
            Ready to continue your language learning journey?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Cards Due Today"
            value={cardStats.due}
            icon="Clock"
            color="primary"
            onClick={() => navigate('/study')}
          />
          
          <StatCard
            title="Study Streak"
            value={`${user.streak} days`}
            icon="Flame"
            color="accent"
          />
          
          <StatCard
            title="Cards Learned"
            value={cardStats.learned}
            icon="BookOpen"
            color="success"
          />
          
          <StatCard
            title="Weekly Sessions"
            value={weeklyStats.sessionsCount}
            icon="TrendingUp"
            color="info"
          />
        </motion.div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Goal Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-surface-900">
                  Daily Goal Progress
                </h2>
                <span className="text-sm text-surface-500">
                  {cardStats.learned} / {user.dailyGoal} cards
                </span>
              </div>
              
              <div className="flex items-center space-x-8">
                <ProgressRing 
                  progress={dailyProgress}
                  size={120}
                  strokeWidth={8}
                  color="#5B4FE5"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-surface-900">
                      {Math.round(dailyProgress)}%
                    </div>
                    <div className="text-xs text-surface-500">
                      Complete
                    </div>
                  </div>
                </ProgressRing>
                
                <div className="flex-1">
                  <div className="space-y-4">
                    {dailyProgress >= 100 ? (
                      <div className="text-success">
                        <ApperIcon name="CheckCircle" className="w-5 h-5 inline mr-2" />
                        Goal completed! Excellent work! 🎉
                      </div>
                    ) : (
                      <div className="text-surface-700">
                        <ApperIcon name="Target" className="w-5 h-5 inline mr-2" />
                        {user.dailyGoal - cardStats.learned} more cards to reach your daily goal
                      </div>
                    )}
                    
                    <Button
                      onClick={() => navigate('/study')}
                      disabled={cardStats.due === 0}
                      className="w-full sm:w-auto"
                    >
                      {cardStats.due > 0 ? 'Start Studying' : 'All Caught Up!'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/speaking')}
                  className="p-4 border-2 border-surface-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Mic" className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-surface-900">Speaking Practice</h3>
                      <p className="text-sm text-surface-600">Daily challenge</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/cards')}
                  className="p-4 border-2 border-surface-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Plus" className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-surface-900">Add New Cards</h3>
                      <p className="text-sm text-surface-600">Create flashcards</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
                This Week
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Study Sessions</span>
                  <span className="font-medium text-surface-900">
                    {weeklyStats.sessionsCount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Cards Reviewed</span>
                  <span className="font-medium text-surface-900">
                    {weeklyStats.totalCards}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Study Time</span>
                  <span className="font-medium text-surface-900">
                    {weeklyStats.totalTimeMinutes}m
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Average Accuracy</span>
                  <span className="font-medium text-success">
                    {Math.round(weeklyStats.averageAccuracy)}%
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/progress')}
                className="w-full mt-4"
              >
                View Detailed Progress
              </Button>
            </motion.div>
            
            {/* Speaking Challenge Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-surface-900">
                  Speaking Challenge
                </h2>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ApperIcon name="Mic" className="w-6 h-6 text-accent" />
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Speaking Streak</span>
                  <span className="font-medium text-accent">
                    {speakingStreak.currentStreak} days
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Total Completed</span>
                  <span className="font-medium text-surface-900">
                    {speakingStreak.totalCompleted}
                  </span>
                </div>
                
                <Button
                  onClick={() => navigate('/speaking')}
                  className="w-full"
                  variant="secondary"
                >
                  Today's Challenge
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard