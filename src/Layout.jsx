import { useState, useContext } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'
import { userService } from '@/services'
import { AuthContext } from './App'
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  // Get user data for header display
  const userData = userService.getCurrentUser()
  const languages = ['Spanish', 'French', 'German']

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40 backdrop-blur">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-full overflow-hidden">
          {/* Logo and Brand */}
          <div className="flex items-center min-w-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Languages" className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-heading font-bold text-surface-900 hidden sm:block">
                LangBridge
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-4 h-4 mr-2" />
                {route.label}
              </NavLink>
            ))}
          </nav>

{/* Header Actions */}
          <div className="flex items-center space-x-4 min-w-0">
            {/* Language Selector */}
            <select className="px-3 py-1.5 text-sm border border-surface-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              {languages.map(lang => (
                <option key={lang} value={lang.toLowerCase()}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Streak Counter */}
            <div className="flex items-center bg-accent/10 px-3 py-1.5 rounded-lg">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <ApperIcon name="Flame" className="w-4 h-4 text-accent mr-2" />
              </motion.div>
              <span className="text-sm font-medium text-surface-900">
                {userData?.streak || 0} day streak
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  const { logout } = useContext(AuthContext) || {};
                  logout?.();
                }
              }}
              className="flex items-center px-3 py-1.5 text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon 
                name={mobileMenuOpen ? "X" : "Menu"} 
                className="w-5 h-5 text-surface-600" 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-16 right-0 bottom-0 w-64 bg-white border-l border-surface-200 z-50 lg:hidden"
            >
              <div className="p-4 space-y-2">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                    {route.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout