import React, { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Clock, Trash2, Edit2 } from "lucide-react"
import { IoAdd } from "react-icons/io5"
import AddTask from './addtask'
import { motion, AnimatePresence } from "framer-motion"
import { FaCircleCheck } from "react-icons/fa6"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

function ShowTasks({ taskUpdateTrigger, onEditTask }) {
  const [tasks, setTasks] = useState([])
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  const isTaskCompleted = (task) => {
    const taskDateTime = new Date(task.date);
    taskDateTime.setHours(
      task.time.period === 'PM' && task.time.hours !== '12' 
        ? parseInt(task.time.hours) + 12 
        : task.time.period === 'AM' && task.time.hours === '12'
        ? 0
        : parseInt(task.time.hours),
      parseInt(task.time.minutes)
    );
    return new Date() > taskDateTime;
  };

  // Separate tasks into active and completed
  const activeTasks = tasks.filter(task => !isTaskCompleted(task));
  const completedTasks = tasks.filter(task => isTaskCompleted(task));

  useEffect(() => {
    // Load tasks from localStorage
    const loadTasks = () => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      setTasks(storedTasks)
    }

    loadTasks()
  }, [taskUpdateTrigger])

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const handleEdit = (task) => {
    onEditTask(task)
    // Reload tasks after editing
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    setTasks(storedTasks)
  }

  const handleTaskUpdate = () => {
    // Reload tasks after a new task is added
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    setTasks(storedTasks)
  }

  return (
    <>
      <AddTask 
        taskToEdit={null}
        onTaskUpdate={handleTaskUpdate}
      />

      <div className="max-w-5xl mx-auto p-6 w-full mt-12 mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Tasks Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Active Tasks
            </h2>
            <Separator className="mb-4" />
            
            <ScrollArea className="h-[500px] pr-4">
              {activeTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed">
                  <p>No active tasks scheduled</p>
                  <p className="text-sm mt-1">Create a new task to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="w-full border bg-gradient-to-b from-white to-gray-50/50 shadow-none transition-all duration-200 hover:border-gray-400 hover:from-gray-50 hover:to-white group relative overflow-hidden rounded-xl"
                    >
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex-shrink-0 flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary/5">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-base font-medium text-gray-900">{task.name}</span>
                            <p className="text-sm text-gray-500 max-w-md truncate">
                              {task.instructions}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-sm bg-transparent">
                            {format(new Date(task.date), "MMM d")} • {task.time.hours}:{task.time.minutes} {task.time.period}
                          </Badge>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <motion.button
                              onClick={() => handleEdit(task)}
                              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="Edit task"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Edit2 className="w-4 h-4 text-gray-600 hover:text-gray-900" />
                            </motion.button>
                            <motion.button
                              onClick={() => deleteTask(task.id)}
                              className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                              aria-label="Delete task"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </section>

          {/* Completed Tasks Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Completed Tasks
            </h2>
            <Separator className="mb-4" />
            
            <ScrollArea className="h-[500px] pr-4">
              {completedTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed">
                  <p>No completed tasks yet</p>
                  <p className="text-sm mt-1">Tasks will appear here once completed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="w-full border bg-gradient-to-b from-white to-gray-50/50 shadow-none transition-all duration-200 hover:border-gray-400 hover:from-gray-50 hover:to-white group relative overflow-hidden rounded-xl opacity-80"
                    >
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex-shrink-0 flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary/5">
                            <FaCircleCheck className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-base font-medium text-gray-900">{task.name}</span>
                            <p className="text-sm text-gray-500 max-w-md truncate">
                              {task.instructions}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-sm bg-transparent border-orange-300 text-orange-500">
                            Completed: {format(new Date(task.date), "MMM d")} • {task.time.hours}:{task.time.minutes} {task.time.period}
                          </Badge>
                          
                          <motion.button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Delete task"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </section>
        </div>
      </div>
    </>
  )
}

export default ShowTasks