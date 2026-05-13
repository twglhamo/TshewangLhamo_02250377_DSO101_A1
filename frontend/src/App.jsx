import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Fetch all tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${apiUrl}/api/tasks`)
      setTasks(response.data)
    } catch (err) {
      setError('Failed to load tasks. Please check your connection.')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      setError('Please enter a task title')
      return
    }

    try {
      const response = await axios.post(`${apiUrl}/api/tasks`, {
        title: newTaskTitle,
      })
      setTasks([response.data, ...tasks])
      setNewTaskTitle('')
      setError('')
    } catch (err) {
      setError('Failed to create task.')
      console.error('Error adding task:', err)
    }
  }

  const toggleTaskComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${apiUrl}/api/tasks/${id}`, {
        completed: !completed,
      })
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
      setError('')
    } catch (err) {
      setError('Failed to update task.')
      console.error('Error toggling task:', err)
    }
  }

  const startEdit = (id, title) => {
    setEditingId(id)
    setEditingTitle(title)
  }

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) {
      setError('Please enter a task title')
      return
    }

    try {
      const response = await axios.put(`${apiUrl}/api/tasks/${id}`, {
        title: editingTitle,
      })
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
      setEditingId(null)
      setEditingTitle('')
      setError('')
    } catch (err) {
      setError('Failed to update task.')
      console.error('Error saving task:', err)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))
      setError('')
    } catch (err) {
      setError('Failed to delete task.')
      console.error('Error deleting task:', err)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      maxWidth: '600px',
      width: '100%',
      marginTop: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#333',
      textAlign: 'center',
    },
    inputContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
    },
    input: {
      flex: 1,
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
    button: {
      padding: '10px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    taskList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderBottom: '1px solid #eee',
      transition: 'background-color 0.2s',
    },
    taskItemLast: {
      borderBottom: 'none',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
    },
    taskTitle: {
      flex: 1,
      fontSize: '16px',
      color: '#333',
      wordBreak: 'break-word',
    },
    taskTitleCompleted: {
      textDecoration: 'line-through',
      color: '#999',
    },
    taskActions: {
      display: 'flex',
      gap: '8px',
    },
    smallButton: {
      padding: '6px 12px',
      fontSize: '12px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
    },
    editInput: {
      flex: 1,
      padding: '8px 10px',
      border: '1px solid #007bff',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'inherit',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
    },
    spinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #007bff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '10px',
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '14px',
      border: '1px solid #f5c6cb',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#999',
    },
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        button:hover {
          filter: brightness(0.9);
        }
      `}</style>
      
      <div style={styles.card}>
        <h1 style={styles.title}>My To-Do List check </h1>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputContainer}>
          <input
            id="newTaskInput"
            name="newTask"
            type="text"
            style={styles.input}
            placeholder="Enter a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button style={styles.button} onClick={addTask}>
            Add Task
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div style={styles.emptyState}>No tasks yet. Add one to get started!</div>
        ) : (
          <ul style={styles.taskList}>
            {tasks.map((task, index) => (
              <li
                key={task.id}
                style={{
                  ...styles.taskItem,
                  ...(index === tasks.length - 1 ? styles.taskItemLast : {}),
                }}
              >
                {editingId === task.id ? (
                  <>
                    <input
                      id="editTaskInput"
                      name="editTask"
                      type="text"
                      style={styles.editInput}
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      autoFocus
                    />
                    <div style={styles.taskActions}>
                      <button
                        style={{ ...styles.smallButton, backgroundColor: '#28a745' }}
                        onClick={() => saveEdit(task.id)}
                      >
                        Save
                      </button>
                      <button
                        style={styles.smallButton}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id, task.completed)}
                    />
                    <span
                      style={{
                        ...styles.taskTitle,
                        ...(task.completed ? styles.taskTitleCompleted : {}),
                      }}
                    >
                      {task.title}
                    </span>
                    <div style={styles.taskActions}>
                      <button
                        style={styles.smallButton}
                        onClick={() => startEdit(task.id, task.title)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...styles.smallButton, ...styles.deleteButton }}
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
