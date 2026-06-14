import { useEffect, useRef, useState } from "react"
import { NotificationContext } from "./notificationContext"

function createNotification(message, tone = "info") {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    tone,
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timersRef = useRef(new Map())

  const removeNotification = (id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id))

    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }

  const notify = (message, tone = "info") => {
    const notification = createNotification(message, tone)
    setNotifications((current) => [...current, notification])

    const timer = window.setTimeout(() => removeNotification(notification.id), 3800)
    timersRef.current.set(notification.id, timer)
  }

  useEffect(() => {
    return () => {
      const timers = timersRef.current
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = { notify, removeNotification }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[3000] flex w-[min(92vw,24rem)] flex-col gap-3" aria-live="polite">
        {notifications.map((notification) => {
          const toneClasses =
            notification.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : notification.tone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-slate-200 bg-white text-slate-900"

          return (
            <div
              key={notification.id}
              role={notification.tone === "error" ? "alert" : "status"}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] ${toneClasses}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-6">{notification.message}</p>
                <button
                  type="button"
                  className="btn btn-ghost -mr-2 -mt-1 h-8 px-2 text-xs"
                  onClick={() => removeNotification(notification.id)}
                  aria-label="Dismiss notification"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </NotificationContext.Provider>
  )
}