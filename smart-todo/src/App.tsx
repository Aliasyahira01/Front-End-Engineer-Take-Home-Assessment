import { useEffect, useState } from 'react'
import './App.css'
import type { Task } from './types/task'
import FilterTabs from './components/FilterTabs'
import TaskItem from './components/TaskItem'
import { reconcileTaskStates } from './logic/dependency'

function App() {
  const [tasks, setTasks] = useState<Task[]>([]) // Stores tasks fetched from backend
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL') // Current filter selected by user
  const [newTaskTitle, setNewTaskTitle] = useState('') // New task input

  //fetch tasks (similar to ngOnInit)
  useEffect(() => {
    fetch('http://localhost:8000/tasks')
      .then(res => res.json())
      .then((data: Task[]) => {
        setTasks(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // DEPENDENCY RECONCILIATION
  useEffect(() => {
    if (tasks.length === 0) return
    const reconciled = reconcileTaskStates(tasks)

    // Prevent infinite loop
    const changed = JSON.stringify(tasks) !== JSON.stringify(reconciled)
    if (changed) {
      setTasks(reconciled)
    }
  }, [tasks])

  // UPDATE TASK STATE
  const updateTaskState = async (
    taskId: number,
    state: Task['state']
  ) => {
    await fetch(
      `http://localhost:8000/tasks/${taskId}/state/${state}`,
      { method: 'POST' }
    )

    // Update local state
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, state } : t
      )
    )
  }

  // ADD TASK
  const addTask = async () => {
    const title = newTaskTitle.trim()
    if (!title) return

    try {
      const res = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          state: 'BACKLOG'
        })
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to create task')
      }

      const createdTask = await res.json()

      // Add new task to UI
      setTasks(prev => [...prev, createdTask])

      // Clear input
      setNewTaskTitle('')
    } catch (err) {
      console.error('❌ Failed to add task:', err)
      alert('Failed to add task. Please check console.')
    }
  }

  // DELETE TASK 
  const deleteTask = async (taskId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) return

    try {
      const res = await fetch(
        `http://localhost:8000/tasks/${taskId}`,
        { method: 'DELETE' }
      )

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to delete task')
      }

      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('❌ Failed to delete task:', err)
      alert('Failed to delete task')
    }
  }

  // FILTER TASKS
  const filteredTasks = tasks.filter(task =>
    filter === 'ALL' ? true : task.state === filter
  )

  if (loading) {
    return <p>Loading tasks...</p>
  }

  return (
    <div className="app-container">
      {/* ===== HEADER ===== */}
      <div className="header">
        <h1>My Tasks</h1>
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="controls" style={{marginBottom: 45}}>
        <div className="status-filter">
          <label>Status:</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            style={{ padding: '9px 10px' }}
          >
            <option value="ALL">ALL</option>
            <option value="BACKLOG">BACKLOG</option>
            <option value="TODO">TO DO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div className="button-and-field">
          <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="New Task Title"/>
          <button className="add-btn" onClick={addTask} disabled={!newTaskTitle.trim()}>
            + Add Task
          </button>
        </div>
      </div>

      {/* ===== TASK LIST ===== */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><img src="https://png.pngtree.com/png-vector/20241110/ourmid/pngtree-yellow-folder-icon-with-documents-representing-data-storage-and-file-management-png-image_14349861.png"
              alt="No tasks" width={150} height={100}/>
            </div>
            <h3>No tasks found</h3>
            <p>
              {filter === 'ALL'
                ? 'Create your first task to get started.'
                : `No tasks in "${filter}" status.`}
            </p>
          </div>
        ) : (
          <ul className="task-grid">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                allTasks={tasks}
                onUpdateState={updateTaskState}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
