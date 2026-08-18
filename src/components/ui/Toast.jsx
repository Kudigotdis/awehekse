import { useState, useEffect, createContext, useContext } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts(t => t.filter(toast => toast.id !== id))
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-lg animate-slide-up ${
              toast.type === 'success' ? 'bg-tov-green text-white' :
              toast.type === 'error' ? 'bg-tov-red text-white' :
              toast.type === 'warning' ? 'bg-amber-500 text-white' :
              'bg-stone-800 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
