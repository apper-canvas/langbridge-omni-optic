const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletonTypes = {
    card: 'h-32 bg-surface-200 rounded-xl',
    list: 'h-16 bg-surface-200 rounded-lg',
    text: 'h-4 bg-surface-200 rounded',
    stat: 'h-24 bg-surface-200 rounded-lg'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={skeletonTypes[type]}></div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader