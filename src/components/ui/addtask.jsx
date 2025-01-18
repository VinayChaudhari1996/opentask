import React from 'react'
import { IoAdd } from 'react-icons/io5'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

function AddTask({ taskToEdit, onUpdate, onTaskUpdate }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(new Date())
  const [time, setTime] = React.useState(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const roundedMinutes = Math.round(minutes / 5) * 5
    return {
      hours: hours === 0 ? "12" : (hours > 12 ? (hours - 12).toString().padStart(2, '0') : hours.toString().padStart(2, '0')),
      minutes: roundedMinutes.toString().padStart(2, '0'),
      period: hours >= 12 ? "PM" : "AM"
    }
  })
  const [formData, setFormData] = React.useState({
    name: '',
    instructions: ''
  })
  const [errors, setErrors] = React.useState({})

  // Modify the useEffect to properly handle editing
  React.useEffect(() => {
    if (taskToEdit) {
      setOpen(true)
      setFormData({
        name: taskToEdit.name,
        instructions: taskToEdit.instructions || '' // Add fallback for instructions
      })
      setDate(new Date(taskToEdit.date))
      setTime(taskToEdit.time)
    } else {
      // Reset form when not editing
      setFormData({ name: '', instructions: '' })
      setDate(new Date())
      // Reset time to current time
      const now = new Date()
      const hours = now.getHours()
      const minutes = Math.round(now.getMinutes() / 5) * 5
      setTime({
        hours: hours === 0 ? "12" : (hours > 12 ? (hours - 12).toString().padStart(2, '0') : hours.toString().padStart(2, '0')),
        minutes: minutes.toString().padStart(2, '0'),
        period: hours >= 12 ? "PM" : "AM"
      })
    }
  }, [taskToEdit]) // Add taskToEdit as dependency

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Task name is required'
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required'
    if (!date) newErrors.date = 'Date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Modify handleSave to handle both create and update
  const handleSave = () => {
    if (validateForm()) {
      const taskData = {
        id: taskToEdit ? taskToEdit.id : Date.now(),
        name: formData.name,
        instructions: formData.instructions,
        date: date,
        time: time,
        status: 'active'
      }

      if (taskToEdit) {
        // Update existing task
        onUpdate(taskData)
      } else {
        // Create new task
        const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        localStorage.setItem('tasks', JSON.stringify([...existingTasks, taskData]))
        onTaskUpdate?.() // Call onTaskUpdate for new tasks
      }

      // Reset form and close dialog
      resetForm()
      setOpen(false)
    }
  }

  // Add new resetForm function
  const resetForm = () => {
    setFormData({ name: '', instructions: '' })
    setDate(new Date())
    const now = new Date()
    const hours = now.getHours()
    const minutes = Math.round(now.getMinutes() / 5) * 5
    setTime({
      hours: hours === 0 ? "12" : (hours > 12 ? (hours - 12).toString().padStart(2, '0') : hours.toString().padStart(2, '0')),
      minutes: minutes.toString().padStart(2, '0'),
      period: hours >= 12 ? "PM" : "AM"
    })
    setErrors({})
  }

  return (
    <>
      {!taskToEdit && (
        <button 
          onClick={() => {
            resetForm()
            setOpen(true)
          }}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center
          shadow-lg transition-all duration-200 hover:bg-black hover:shadow-xl cursor-pointer
          group fixed bottom-8 right-8 z-50"
        >
          <IoAdd className="w-8 h-8 text-gray-600 transition-colors duration-200 group-hover:text-white" />
        </button>
      )}

      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          if (!isOpen && !taskToEdit) {
            resetForm() // Reset form when closing dialog
          }
          setOpen(isOpen)
        }}
      >
        <DialogContent className="w-full max-w-2xl p-8 border shadow-none transition-all duration-200 hover:border-gray-400">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-base font-medium text-gray-900">Task Name*</label>
              <Input 
                placeholder="Check Apple stock price" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`h-12 text-base border shadow-none transition-all duration-200 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/10 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-base font-medium text-gray-900">Instructions*</label>
              <Textarea 
                placeholder="Search for Apple stock price and notify me if it is available."
                className={`min-h-[150px] text-base leading-relaxed border shadow-none transition-all duration-200 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/10 ${errors.instructions ? 'border-red-500' : ''}`}
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
              />
              {errors.instructions && <p className="text-sm text-red-500 mt-2">{errors.instructions}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-base font-medium text-gray-900">Schedule*</label>
              <div className="flex gap-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal text-base border shadow-none transition-all duration-200 hover:border-gray-400",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border shadow-none" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-lg border shadow-none"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal text-base",
                        !time && "text-muted-foreground"
                      )}
                    >
                      <Clock className="mr-3 h-5 w-5" />
                      {`${time.hours}:${time.minutes} ${time.period}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-6 border shadow-none" align="start">
                    <div className="flex items-center gap-4 px-2">
                      <Select
                        value={time.hours}
                        onValueChange={(value) => setTime(prev => ({ ...prev, hours: value }))}
                      >
                        <SelectTrigger className="w-16 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 p-2">
                          <SelectValue placeholder="HH">{time.hours}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                              {(i + 1).toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-xl font-light text-gray-400">:</span>

                      <Select
                        value={time.minutes}
                        onValueChange={(value) => setTime(prev => ({ ...prev, minutes: value }))}
                      >
                        <SelectTrigger className="w-16 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 p-2">
                          <SelectValue placeholder="MM">{time.minutes}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i * 5} value={(i * 5).toString().padStart(2, '0')}>
                              {(i * 5).toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={time.period}
                        onValueChange={(value) => setTime(prev => ({ ...prev, period: value }))}
                      >
                        <SelectTrigger className="w-16 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 p-2">
                          <SelectValue>{time.period}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <div className="space-x-3">
                <Button variant="outline" className="h-11 px-6 border shadow-none transition-all duration-200 hover:border-gray-400">
                  Pause
                </Button>
                <Button variant="outline" className="h-11 px-6 border shadow-none transition-all duration-200 hover:border-gray-400 hover:bg-red-50 hover:text-red-600">
                  Delete
                </Button>
              </div>
              <div className="space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="h-11 px-6 border shadow-none transition-all duration-200 hover:border-gray-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="h-11 px-8 bg-black hover:bg-gray-800 shadow-none transition-all duration-200"
                >
                  Save Task
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddTask