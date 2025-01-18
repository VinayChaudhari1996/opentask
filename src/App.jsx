import './App.css'
import AddTask from './components/ui/addtask'
import ShowTasks from './components/ui/showTasks'
import ShowTrigger from './components/ui/showTrigger'
import { useState, useCallback } from 'react'
import { Clock } from 'lucide-react'

function App() {
  const [taskUpdateTrigger, setTaskUpdateTrigger] = useState(0)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const handleTaskUpdate = useCallback(() => {
    setTaskUpdateTrigger(prev => prev + 1)
  }, [])

  const handleEditComplete = useCallback((updatedTask) => {
    // Update the task in localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTaskToEdit(null)
    handleTaskUpdate()
  }, [])

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white to-gray-50/50">
      <ShowTrigger />
      

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ShowTasks 
            taskUpdateTrigger={taskUpdateTrigger} 
            onEditTask={setTaskToEdit}
          />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <AddTask 
          taskToEdit={taskToEdit} 
          onUpdate={handleEditComplete}
          onTaskUpdate={handleTaskUpdate} 
        />
      </div>
    </div>
  )
}

export default App
