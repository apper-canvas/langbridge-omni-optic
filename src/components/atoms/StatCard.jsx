import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  trendValue,
  className = '',
  onClick
}) => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10'
  }

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-surface-500'
  }

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1, translateY: -2 }}
      className={`
        bg-white rounded-xl p-6 shadow-sm border border-surface-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        transition-all duration-200
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-surface-900">
            {value}
          </p>
          
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-xs ${trendColors[trend]}`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                className="w-3 h-3 mr-1" 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard