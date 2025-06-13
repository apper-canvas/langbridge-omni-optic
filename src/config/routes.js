import Dashboard from '@/components/pages/Dashboard'
import Study from '@/components/pages/Study'
import Speaking from '@/components/pages/Speaking'
import MyCards from '@/components/pages/MyCards'
import Progress from '@/components/pages/Progress'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  study: {
    id: 'study',
    label: 'Study',
    path: '/study',
    icon: 'Brain',
    component: Study
  },
  speaking: {
    id: 'speaking',
    label: 'Speaking Practice',
    path: '/speaking',
    icon: 'Mic',
    component: Speaking
  },
  cards: {
    id: 'cards',
    label: 'My Cards',
    path: '/cards',
    icon: 'CreditCard',
    component: MyCards
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  }
}

export const routeArray = Object.values(routes)
export default routes