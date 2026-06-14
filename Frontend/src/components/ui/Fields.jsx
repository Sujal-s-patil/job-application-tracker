function FieldFrame({ label, hint, error, children, htmlFor }) {
  return (
    <div className="field-group">
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error ? <p className="field-error" id={`${htmlFor}-error`}>{error}</p> : hint ? <p className="field-help" id={`${htmlFor}-hint`}>{hint}</p> : null}
    </div>
  )
}

export function InputField({ label, hint, error, className = "", ...props }) {
  return (
    <FieldFrame label={label} hint={hint} error={error} htmlFor={props.id}>
      <input
        {...props}
        className={className}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
      />
    </FieldFrame>
  )
}

export function TextareaField({ label, hint, error, className = "", ...props }) {
  return (
    <FieldFrame label={label} hint={hint} error={error} htmlFor={props.id}>
      <textarea
        {...props}
        className={className}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
      />
    </FieldFrame>
  )
}

export function SelectField({ label, hint, error, className = "", children, ...props }) {
  return (
    <FieldFrame label={label} hint={hint} error={error} htmlFor={props.id}>
      <select
        {...props}
        className={className}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
      >
        {children}
      </select>
    </FieldFrame>
  )
}