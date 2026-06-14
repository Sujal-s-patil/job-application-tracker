import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export function Modal({ open, onClose, title, description, actions, children }) {
    const dialogRef = useRef(null)
    const previousFocusRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (open) {
            previousFocusRef.current = document.activeElement
            dialog.showModal()
        } else {
            dialog.close()
            previousFocusRef.current?.focus()
        }
    }, [open])

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        const handleCancel = (event) => {
            event.preventDefault()
            onClose()
        }

        dialog.addEventListener("cancel", handleCancel)
        return () => dialog.removeEventListener("cancel", handleCancel)
    }, [onClose])

    const handleBackdropClick = (event) => {
        if (event.target === dialogRef.current) {
            onClose()
        }
    }

    return createPortal(
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 m-auto w-full max-w-[480px] max-h-fit rounded-xl border-0 p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
        >
            <div className="flex flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold text-slate-900">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="text-sm text-slate-700">
                    {children}
                </div>

                {/* Footer */}
                {actions && (
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                        {actions}
                    </div>
                )}
            </div>
        </dialog>,
        document.body
    )
}