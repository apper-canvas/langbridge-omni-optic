import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
import StatCard from '@/components/atoms/StatCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import { studySessionService, flashcardService, speakingChallengeService, userService } from '@/services'
import ApperIcon from '@/components/ApperIcon'

const Progress = () => {
  const [progressData, setProgressData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('week') // week, month, year

  const loadProgressData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [sessions, cardStats, speakingStats, user] = await Promise.all([
        studySessionService.getRecentSessions(30),
        flashcardService.getStats('spanish'),
        speakingChallengeService.getStreakInfo(),
        userService.getCurrentUser()
      ])

      // Process sessions for chart data
      const chartData = processSessionsForChart(sessions)
      
      setProgressData({
        sessions,
        cardStats,
        speakingStats,
        user,
        chartData
      })
    } catch (err) {
      setError(err.message || 'Failed to load progress data')
      toast.error('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  const processSessionsForChart = (sessions) => {
    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.startTime).toDateString()
      if (!acc[date]) {
        acc[date] = {
          date,
          cardsStudied: 0,
          accuracy: 0,
          sessionCount: 0,
          totalAccuracy: 0
        }
      }
      acc[date].cardsStudied += session.cardsStudied
      acc[date].totalAccuracy += session.accuracy
      acc[date].sessionCount += 1
      acc[date].accuracy = Math.round(acc[date].totalAccuracy / acc[date].sessionCount)
      return acc
    }, {})

    // Convert to array and sort by date
    const chartData = Object.values(sessionsByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14) // Last 14 days

    return chartData
  }

  useEffect(() => {
    loadProgressData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonLoader count={4} type="stat" />
          </div>
          
          {/* Chart Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <SkeletonLoader count={1} type="card" className="h-80" />
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
            onRetry={loadProgressData}
          />
        </div>
      </div>
    )
  }

  if (!progressData) return null

  const { sessions, cardStats, speakingStats, user, chartData } = progressData

  // Calculate total study time
  const totalStudyTime = sessions.reduce((total, session) => {
    if (session.endTime) {
      const duration = new Date(session.endTime) - new Date(session.startTime)
      return total + duration
    }
    return total
  }, 0)

  const totalStudyHours = Math.round(totalStudyTime / (1000 * 60 * 60 * 100)) / 10

  // Average accuracy
  const averageAccuracy = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
    : 0

  // Chart options
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#5B4FE5', '#FF6B6B'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        colorStops: [
          { offset: 0, color: '#5B4FE5', opacity: 0.3 },
          { offset: 100, color: '#5B4FE5', opacity: 0.05 }
        ]
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 5
    },
    xaxis: {
      categories: chartData.map(d => new Date(d.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })),
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Cards Studied',
          style: { color: '#64748b' }
        },
        labels: {
          style: { colors: '#64748b' }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Accuracy (%)',
          style: { color: '#64748b' }
        },
        labels: {
          style: { colors: '#64748b' }
        },
        min: 0,
        max: 100
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value, { seriesIndex }) => {
          return seriesIndex === 0 ? `${value} cards` : `${value}%`
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  }

  const chartSeries = [
    {
      name: 'Cards Studied',
      type: 'column',
      data: chartData.map(d => d.cardsStudied)
    },
    {
      name: 'Accuracy',
      type: 'line',
      data: chartData.map(d => d.accuracy)
    }
  ]

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">
              Learning Progress
            </h1>
            <p className="text-surface-600 mt-1">
              Track your language learning journey and achievements
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Study Streak"
            value={`${user.streak} days`}
            icon="Flame"
            color="accent"
            trend="up"
            trendValue="+2 from last week"
          />
          
          <StatCard
            title="Total Cards"
            value={cardStats.total}
            icon="CreditCard"
            color="primary"
          />
          
          <StatCard
            title="Average Accuracy"
            value={`${averageAccuracy}%`}
            icon="Target"
            color="success"
            trend={averageAccuracy >= 80 ? "up" : "down"}
            trendValue={averageAccuracy >= 80 ? "Great job!" : "Keep practicing"}
          />
          
          <StatCard
            title="Study Time"
            value={`${totalStudyHours}h`}
            icon="Clock"
            color="info"
          />
        </motion.div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Study Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-surface-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                Study Activity
              </h2>
              <div className="flex items-center space-x-4 text-sm text-surface-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  Cards Studied
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                  Accuracy
                </div>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-80 text-surface-500">
                <div className="text-center">
                  <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-4 text-surface-300" />
                  <p>No study data available yet</p>
                  <p className="text-sm">Complete some study sessions to see your progress</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Progress Overview */}
          <div className="space-y-6">
            {/* Daily Goal Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Today's Goal
              </h3>
              
              <div className="flex items-center justify-center mb-4">
                <ProgressRing 
                  progress={Math.min((cardStats.learned / user.dailyGoal) * 100, 100)}
                  size={100}
                  strokeWidth={8}
                  color="#5B4FE5"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-surface-900">
                      {cardStats.learned}
                    </div>
                    <div className="text-xs text-surface-500">
                      of {user.dailyGoal}
                    </div>
                  </div>
                </ProgressRing>
              </div>
              
              <div className="text-center text-sm text-surface-600">
                {cardStats.learned >= user.dailyGoal ? (
                  <span className="text-success">🎉 Goal completed!</span>
                ) : (
                  <span>{user.dailyGoal - cardStats.learned} cards to go</span>
                )}
              </div>
            </motion.div>

            {/* Speaking Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Speaking Practice
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Current Streak</span>
                  <div className="flex items-center">
                    <ApperIcon name="Flame" className="w-4 h-4 text-accent mr-1" />
                    <span className="font-medium text-surface-900">
                      {speakingStats.currentStreak} days
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Total Challenges</span>
                  <span className="font-medium text-surface-900">
                    {speakingStats.totalCompleted}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-surface-100">
                  <div className="text-xs text-surface-500">
                    {speakingStats.lastCompleted ? (
                      `Last completed: ${new Date(speakingStats.lastCompleted).toLocaleDateString()}`
                    ) : (
                      'No challenges completed yet'
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card Mastery Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
                Card Mastery
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                    <span className="text-sm text-surface-600">Mastered</span>
                  </div>
                  <span className="font-medium text-surface-900">
                    {cardStats.learned}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                    <span className="text-sm text-surface-600">Learning</span>
                  </div>
                  <span className="font-medium text-surface-900">
                    {cardStats.total - cardStats.learned - cardStats.new}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-info rounded-full mr-2"></div>
                    <span className="text-sm text-surface-600">New</span>
                  </div>
                  <span className="font-medium text-surface-900">
                    {cardStats.new}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress