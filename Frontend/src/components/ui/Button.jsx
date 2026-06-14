import { Link } from "react-router-dom"
import { InlineSpinner } from "./Feedback"

const variants = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  danger: "btn btn-danger",
  ghost: "btn btn-ghost",
}

export function Button({ variant = "primary", isLoading = false, className = "", children, to, ...props }) {
  const disabled = props.disabled || isLoading
  const classes = `${variants[variant]} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {isLoading ? <InlineSpinner className="shrink-0" /> : null}
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <button {...props} disabled={disabled} className={classes}>
      {isLoading ? <InlineSpinner className="shrink-0" /> : null}
      <span>{children}</span>
    </button>
  )
}