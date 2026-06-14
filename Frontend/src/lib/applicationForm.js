export const initialApplicationValues = {
  title: "",
  roleApplied: "",
  jobDescription: "",
  applicationStatus: "applied",
  noteForApplied: "",
  noteForInterview: "",
  noteForAccepted: "",
  noteForRejected: "",
}

const statusOptions = ["applied", "interview", "accepted", "rejected"]

export function validateApplication(values) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = "Title is required."
  }

  if (!values.roleApplied.trim()) {
    errors.roleApplied = "Role applied for is required."
  }

  if (!values.jobDescription.trim()) {
    errors.jobDescription = "Job description is required."
  }

  if (!statusOptions.includes(values.applicationStatus)) {
    errors.applicationStatus = "Select a valid status."
  }

  return errors
}

export function normalizeApplicationValues(values) {
  return {
    title: values.title.trim(),
    roleApplied: values.roleApplied.trim(),
    jobDescription: values.jobDescription.trim(),
    applicationStatus: values.applicationStatus,
    noteForApplied: values.noteForApplied.trim(),
    noteForInterview: values.noteForInterview.trim(),
    noteForAccepted: values.noteForAccepted.trim(),
    noteForRejected: values.noteForRejected.trim(),
  }
}
