//Pure business logic //No React, no UI, no hooks

import type { Task } from '../types/task'

/**
 * Determines whether a task is blocked.
 * A task is blocked if ANY of its blockers is NOT DONE.
 */
export const isTaskBlocked = (
  task: Task,
  tasks: Task[]
): boolean => {

  // No blockers = task is not blocked
  if (!task.blockers || task.blockers.length === 0) {
    return false
  }

  // Check each blocker
  return task.blockers.some(blockerId => {
    // Find the blocker task in full task list
    const blocker = tasks.find(t => t.id === blockerId)

    // If blocker exists and is not DONE → task is blocked
    return blocker ? blocker.state !== 'DONE' : false
  })
}

/**
 * Returns the effective UI state of a task.
 * BLOCKED is a derived state (not stored in backend).
 */
export const getEffectiveState = (task: Task, tasks: Task[]): Task['state'] | 'BLOCKED' => {
  // If blocked → UI shows BLOCKED
  if (isTaskBlocked(task, tasks)) {
    return 'BLOCKED'
  }

  // Otherwise show backend state
  return task.state
}

/**
 * Returns all tasks that directly depend on a given task
 */
export const getDirectDependents = (
  taskId: number,
  tasks: Task[]
): Task[] => {
  return tasks.filter(t => t.blockers.includes(taskId))
}

/**
 * Recursively reconciles task states based on dependency rules
 *
 * Rules:
 * - If task is blocked → force BACKLOG
 * - If task is actionable and was BACKLOG → move to TODO
 * - Propagate changes to all downstream dependents
 */
export const reconcileTaskStates = (tasks: Task[]): Task[] => {
  // clone to avoid mutating React state directly
  const updatedTasks = tasks.map(t => ({ ...t }))

  const taskMap = new Map<number, Task>()
  updatedTasks.forEach(t => taskMap.set(t.id, t))

  const visited = new Set<number>()

  const reconcile = (task: Task) => {
    if (visited.has(task.id)) return
    visited.add(task.id)

    const blocked = isTaskBlocked(task, updatedTasks)

    // Automatic transitions
    if (blocked && task.state !== 'BACKLOG') {
      task.state = 'BACKLOG'
    }

    if (!blocked && task.state === 'BACKLOG' && task.blockers.length > 0) {
    task.state = 'TODO'
    }

    // Recurse into dependents
    const dependents = getDirectDependents(task.id, updatedTasks)
    dependents.forEach(dep => reconcile(dep))
  }

  // Start reconciliation from ALL tasks
  updatedTasks.forEach(task => reconcile(task))

  return updatedTasks
}
