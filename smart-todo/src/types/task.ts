//model

// Defines all possible task states allowed by backend
export type TaskState = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'

// Task object returned from backend API
export type Task = {
  id: number
  title: string
  description?: string
  state: TaskState
  blockers: number[]
  dependents: number[]
}
