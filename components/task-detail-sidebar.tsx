"use client"

import { useState } from "react"
import { X, Calendar, Trash2, Plus, CheckSquare, Square, Edit, Copy, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Task, Column, Subtask, CustomField } from "@/types/kanban"
import { formatDate, generateId } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskDetailSidebarProps {
  task: Task
  onClose: () => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  onDuplicate: (task: Task) => void
  columns: Column[]
}

export default function TaskDetailSidebar({
  task,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  columns,
}: TaskDetailSidebarProps) {
  const [editedTask, setEditedTask] = useState<Task>({ ...task })
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [newCustomFieldName, setNewCustomFieldName] = useState("")
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("")
  const [isAddingCustomField, setIsAddingCustomField] = useState(false)

  const handleTitleSave = () => {
    if (editedTask.title.trim()) {
      onUpdate(editedTask)
      setIsEditingTitle(false)
    }
  }

  const handleDescriptionSave = () => {
    onUpdate(editedTask)
    setIsEditingDescription(false)
  }

  const handleStatusChange = (status: string) => {
    const updatedTask = { ...editedTask, status }
    setEditedTask(updatedTask)
    onUpdate(updatedTask)
  }

  const handleDueDateChange = (date: Date | undefined) => {
    const updatedTask = {
      ...editedTask,
      dueDate: date ? date.toISOString() : null,
    }
    setEditedTask(updatedTask)
    onUpdate(updatedTask)
  }

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = editedTask.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
    )

    const updatedTask = { ...editedTask, subtasks: updatedSubtasks }
    setEditedTask(updatedTask)
    onUpdate(updatedTask)
  }

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return

    const newSubtask: Subtask = {
      id: `subtask-${generateId()}`,
      title: newSubtaskTitle,
      completed: false,
    }

    const updatedTask = {
      ...editedTask,
      subtasks: [...editedTask.subtasks, newSubtask],
    }

    setEditedTask(updatedTask)
    onUpdate(updatedTask)
    setNewSubtaskTitle("")
    setIsAddingSubtask(false)
  }

  const deleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = editedTask.subtasks.filter((subtask) => subtask.id !== subtaskId)

    const updatedTask = { ...editedTask, subtasks: updatedSubtasks }
    setEditedTask(updatedTask)
    onUpdate(updatedTask)
  }

  const addCustomField = () => {
    if (!newCustomFieldName.trim()) return

    const newField: CustomField = {
      id: `field-${generateId()}`,
      name: newCustomFieldName,
      value: newCustomFieldValue,
    }

    const updatedTask = {
      ...editedTask,
      customFields: [...editedTask.customFields, newField],
    }

    setEditedTask(updatedTask)
    onUpdate(updatedTask)
    setNewCustomFieldName("")
    setNewCustomFieldValue("")
    setIsAddingCustomField(false)
  }

  const updateCustomField = (fieldId: string, value: string) => {
    const updatedFields = editedTask.customFields.map((field) => (field.id === fieldId ? { ...field, value } : field))

    const updatedTask = { ...editedTask, customFields: updatedFields }
    setEditedTask(updatedTask)
    onUpdate(updatedTask)
  }

  const deleteCustomField = (fieldId: string) => {
    const updatedFields = editedTask.customFields.filter((field) => field.id !== fieldId)

    const updatedTask = { ...editedTask, customFields: updatedFields }
    setEditedTask(updatedTask)
    onUpdate(updatedTask)
  }

  const handleDeleteTask = () => {
    onDelete(task.id)
  }

  const handleDuplicateTask = () => {
    onDuplicate(task)
  }

  // Calculate progress
  const completedSubtasks = editedTask.subtasks.filter(subtask => subtask.completed).length
  const totalSubtasks = editedTask.subtasks.length
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  // Check if overdue
  const isOverdue = editedTask.dueDate && new Date(editedTask.dueDate) < new Date() && editedTask.status !== "Completed"

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card shadow-2xl border-l border-border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Task Details</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="hover:bg-background/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            {isEditingTitle ? (
              <div className="space-y-3">
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-lg font-medium"
                  placeholder="Task title"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleTitleSave} className="flex-1">
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingTitle(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-xl font-semibold text-card-foreground leading-tight flex-1">
                    {editedTask.title}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Progress indicator */}
                {totalSubtasks > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{completedSubtasks}/{totalSubtasks} subtasks</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Status</Label>
              <Select value={editedTask.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.title}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full justify-start text-left font-normal ${
                      isOverdue ? "border-red-500 text-red-600 dark:text-red-400" : ""
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editedTask.dueDate ? (
                      <span className={isOverdue ? "font-medium" : ""}>
                        {formatDate(editedTask.dueDate)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                    onSelect={handleDueDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Due Date Warning */}
          {isOverdue && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  This task is overdue
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-foreground">Description</Label>
              {!isEditingDescription && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditingDescription(true)}
                  className="text-xs gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              )}
            </div>

            {isEditingDescription ? (
              <div className="space-y-3">
                <Textarea
                  value={editedTask.description || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  placeholder="Add a description..."
                  rows={4}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleDescriptionSave} className="flex-1">
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg border border-border/50 min-h-[80px] flex items-center">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {editedTask.description || "No description provided."}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Subtasks */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">Subtasks</h4>
                {totalSubtasks > 0 && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddingSubtask(true)}
                className="text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>

            {isAddingSubtask && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50 space-y-3">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Subtask title"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addSubtask} className="flex-1">
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingSubtask(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {editedTask.subtasks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No subtasks yet.</p>
                </div>
              ) : (
                editedTask.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => toggleSubtask(subtask.id)}
                    >
                      {subtask.completed ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <span
                      className={`text-sm flex-1 ${
                        subtask.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {subtask.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => deleteSubtask(subtask.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Custom Fields */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-foreground">Custom Fields</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddingCustomField(true)}
                className="text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>

            {isAddingCustomField && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={newCustomFieldName}
                    onChange={(e) => setNewCustomFieldName(e.target.value)}
                    placeholder="Field name"
                  />
                  <Input
                    value={newCustomFieldValue}
                    onChange={(e) => setNewCustomFieldValue(e.target.value)}
                    placeholder="Field value"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addCustomField} className="flex-1">
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingCustomField(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {editedTask.customFields.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No custom fields yet.</p>
                </div>
              ) : (
                editedTask.customFields.map((field) => (
                  <div key={field.id} className="p-3 bg-muted/30 rounded-lg border border-border/30">
                    <div className="flex items-center justify-between gap-3">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <div className="text-sm font-medium text-foreground">{field.name}</div>
                        <Input
                          value={field.value || ""}
                          onChange={(e) => updateCustomField(field.id, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => deleteCustomField(field.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-border bg-muted/30 space-y-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleDuplicateTask}>
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{editedTask.title}&quot;? This action cannot be undone and will permanently delete the task and all its subtasks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Task
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* Task metadata */}
        <div className="text-xs text-muted-foreground text-center">
          Created {new Date(editedTask.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
