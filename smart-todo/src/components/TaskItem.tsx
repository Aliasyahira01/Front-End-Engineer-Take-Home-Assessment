// Single task display (UI-focused)
import type { Task } from '../types/task'
import { isTaskBlocked, getEffectiveState } from '../logic/dependency'

// Status color mapping (UI only)
const STATUS_COLOR: Record<string, string> = {
  BACKLOG: '#9ca3af',
  TODO: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  DONE: '#22c55e',
  BLOCKED: '#ef4444'
}

type Props = {
  task: Task
  allTasks: Task[]
  onUpdateState: (id: number, state: Task['state']) => void
  onDelete: (id: number) => void
}

export default function TaskItem({
  task,
  allTasks,
  onUpdateState,
  onDelete
}: Props) {

  const blocked = isTaskBlocked(task, allTasks)
  const effectiveState = getEffectiveState(task, allTasks)
  const statusColor = STATUS_COLOR[effectiveState]

  return (
    <li className={`task-card ${blocked ? 'blocked' : ''}`}>
      {/* ===== TITLE ===== */}
      <strong className="task-title">{task.title}</strong>

      {/* ===== STATUS ===== */}
      <div className="task-status">
        <span
          className="status-dot"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 8px ${statusColor}`
          }}
        />
        <span>Status: {effectiveState}</span>
      </div>

      {/* ===== ACTION ICONS ===== */}
      <div className="task-actions">

        {/* START */}
        {!blocked && task.state === 'BACKLOG' && (
          <button
            title="Start task"
            className="icon-btn start"
            onClick={() => onUpdateState(task.id, 'IN_PROGRESS')}
          >
            {/* Play icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
            </svg> 

            Start Task
          </button>
        )}

        {/* MARK DONE */}
        {!blocked && task.state === 'IN_PROGRESS' && (
          <button
            title="Mark as done"
            className="icon-btn success"
            onClick={() => onUpdateState(task.id, 'DONE')}
          >
            {/* Check icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>

            Mark Done
          </button>
        )}

        {/* DELETE */}
        {task.state !== 'DONE' && (
            <button
            title="Delete task"
            className="icon-btn danger"
            onClick={() => {
                if (confirm('Delete this task?')) {
                onDelete(task.id)
                }
            }}
            >
            {/* Trash icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1z" />
            </svg>

            Delete Task
            </button>
        )}
      </div>

      {/* ===== BLOCKED MESSAGE ===== */}
      {blocked && (
        <div className="blocked-text">
          ⛔ Blocked by unfinished dependencies
        </div>
      )}
    </li>
  )
}
