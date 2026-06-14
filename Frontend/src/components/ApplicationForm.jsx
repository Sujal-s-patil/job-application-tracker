import { Button } from "./ui/Button"
import { InputField, SelectField, TextareaField } from "./ui/Fields"
import { initialApplicationValues, validateApplication } from "../lib/applicationForm"

const statusOptions = ["applied", "interview", "accepted", "rejected"]

export default function ApplicationForm({
  title,
  description,
  submitLabel,
  cancelLabel,
  onCancel,
  onSubmit,
  values = initialApplicationValues,
  errors = {},
  onChange,
  isSubmitting = false,
}) {
  const statusChoices = statusOptions

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <p className="section-title">Application</p>
        <h1 className="page-heading text-2xl sm:text-3xl">{title}</h1>
        {description ? <p className="muted max-w-2xl">{description}</p> : null}
      </div>

      <div className="grid gap-5">
        <InputField
          id="title"
          name="title"
          label="Title"
          placeholder="Product Designer at Acme"
          value={values.title}
          onChange={onChange}
          error={errors.title}
          required
        />
        <InputField
          id="roleApplied"
          name="roleApplied"
          label="Role applied for"
          placeholder="Product Designer"
          value={values.roleApplied}
          onChange={onChange}
          error={errors.roleApplied}
          required
        />
        <TextareaField
          id="jobDescription"
          name="jobDescription"
          label="Job description"
          placeholder="Summarize the role, responsibilities, or a useful reminder."
          value={values.jobDescription}
          onChange={onChange}
          error={errors.jobDescription}
          required
        />
        <SelectField
          id="applicationStatus"
          name="applicationStatus"
          label="Application status"
          value={values.applicationStatus}
          onChange={onChange}
          error={errors.applicationStatus}
        >
          {statusChoices.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </SelectField>
        <TextareaField
          id="noteForApplied"
          name="noteForApplied"
          label="Applied note"
          placeholder="Add a follow-up note, contact detail, or reminder."
          value={values.noteForApplied}
          onChange={onChange}
          error={errors.noteForApplied}
        />
        <TextareaField
          id="noteForInterview"
          name="noteForInterview"
          label="Interview note"
          placeholder="Record feedback, interview date, or prep notes."
          value={values.noteForInterview}
          onChange={onChange}
          error={errors.noteForInterview}
        />
        <TextareaField
          id="noteForAccepted"
          name="noteForAccepted"
          label="Accepted note"
          placeholder="Keep onboarding, compensation, or acceptance details here."
          value={values.noteForAccepted}
          onChange={onChange}
          error={errors.noteForAccepted}
        />
        <TextareaField
          id="noteForRejected"
          name="noteForRejected"
          label="Rejected note"
          placeholder="Store rejection feedback or a next-step reminder."
          value={values.noteForRejected}
          onChange={onChange}
          error={errors.noteForRejected}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel ?? "Cancel"}
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}