import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { seedAll } from './core/seed/contentSeeder'
import './index.css'
import App from './App.jsx'

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW()
  },
  onOfflineReady() {
    console.log('App ready for offline use')
  },
  onRegistrationError(err) {
    console.error('SW registration error:', err)
  }
})

seedAll().then(result => {
  if (result.seeded) {
    console.log('[Seed] Database populated:', result.counts)
  }
}).catch(err => {
  console.error('[Seed] Startup seed failed:', err)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
