import { InlineSpinner } from "./Feedback"

const variants = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  danger: "btn btn-danger",
  ghost: "btn btn-ghost",
}

export function Button({ variant = "primary", isLoading = false, className = "", children, ...props }) {
  const disabled = props.disabled || isLoading

  return (
    <button {...props} disabled={disabled} className={`${variants[variant]} ${className}`.trim()}>
      {isLoading ? <InlineSpinner className="shrink-0" /> : null}
      <span>{children}</span>
    </button>
  )
}