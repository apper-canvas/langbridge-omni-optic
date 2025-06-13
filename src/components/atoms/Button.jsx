import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100',
    success: 'bg-success hover:bg-success/90 text-white shadow-sm',
    warning: 'bg-warning hover:bg-warning/90 text-white shadow-sm',
    error: 'bg-error hover:bg-error/90 text-white shadow-sm'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02, translateY: -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={disabled || loading ? undefined : onClick}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSizes[size]} animate-spin ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`} 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
      )}
    </motion.button>
  )
}

export default Button