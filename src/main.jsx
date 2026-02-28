import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const isBackend = window.location.pathname.startsWith('/backend')

const RootComponent = isBackend
  ? lazy(() => import('./components/backend/BackendDashboard'))
  : lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={
      <div className="carpet-bg min-h-screen flex items-center justify-center">
        <div className="text-teal-400 font-body">Loading...</div>
      </div>
    }>
      <RootComponent />
    </Suspense>
  </StrictMode>,
)
