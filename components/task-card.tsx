"use client"

import type React from "react"

import { Calendar, CheckSquare, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/kanban"
import { formatDate } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onClick: () => void
  onDuplicate: () => void
}

export default function TaskCard({ task, onClick, onDuplicate }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length

  // Determine if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed"

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDuplicate()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className="mb-3 p-4 bg-card rounded-lg shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-medium text-card-foreground text-sm leading-relaxed flex-1 min-w-0">
          {task.title}
        </h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
          onClick={handleDuplicate}
          title="Duplicate task"
          aria-label="Duplicate task"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {(task.dueDate || totalSubtasks > 0 || task.customFields.some(field => field.value)) && (
        <div className="flex flex-wrap gap-1.5">
          {task.dueDate && (
            <div
              className={`flex items-center text-xs px-2.5 py-1.5 rounded-full transition-colors ${
                isOverdue 
                  ? "text-red-700 bg-red-50 border border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-800" 
                  : "text-muted-foreground bg-muted/80 hover:bg-muted"
              }`}
            >
              <Calendar className="h-3 w-3 mr-1.5" />
              <span className="font-medium">{formatDate(task.dueDate)}</span>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="flex items-center text-xs text-muted-foreground bg-muted/80 hover:bg-muted transition-colors px-2.5 py-1.5 rounded-full">
              <CheckSquare className="h-3 w-3 mr-1.5" />
              <span className="font-medium">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}

          {task.customFields.map(
            (field) =>
              field.value && (
                <div 
                  key={field.id} 
                  className="text-xs text-muted-foreground bg-muted/80 hover:bg-muted transition-colors px-2.5 py-1.5 rounded-full"
                  title={`${field.name}: ${field.value}`}
                >
                  <span className="font-medium">{field.name}:</span>{" "}
                  <span>
                    {field.value.toString().length > 8
                      ? `${field.value.toString().substring(0, 8)}...`
                      : field.value.toString()}
                  </span>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  )
}
