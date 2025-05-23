"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Plus, Download, Upload, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"
import Column from "./column"
import TaskDetailSidebar from "./task-detail-sidebar"
import AutomationRules from "./automation-rules"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import type { Task, Column as ColumnType, Rule } from "@/types/kanban"
import { generateId } from "@/lib/utils"
import { useDatabase } from "@/hooks/use-database"

// Mock data for initial setup when no data exists in database
const generateMockTasks = (): { [key: string]: Task[] } => {
  // Helper to create a date string (past or future)
  const createDate = (daysFromNow: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toISOString()
  }

  // To Do tasks
  const todoTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Research competitor products",
      description: "Analyze top 5 competitor products and create a comparison report",
      status: "To Do",
      dueDate: createDate(5),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Identify top competitors", completed: false },
        { id: `subtask-${generateId()}`, title: "Create comparison criteria", completed: false },
        { id: `subtask-${generateId()}`, title: "Gather product information", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Estimated Hours", value: "8" },
      ],
      createdAt: createDate(-2),
    },
    {
      id: `task-${generateId()}`,
      title: "Design new landing page",
      description: "Create wireframes and mockups for the new product landing page",
      status: "To Do",
      dueDate: createDate(7),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Research design trends", completed: false },
        { id: `subtask-${generateId()}`, title: "Create wireframes", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Assigned To", value: "Sarah" },
      ],
      createdAt: createDate(-1),
    },
    {
      id: `task-${generateId()}`,
      title: "Update documentation",
      description: "Update the user documentation with the latest features",
      status: "To Do",
      dueDate: createDate(3),
      subtasks: [],
      customFields: [{ id: `field-${generateId()}`, name: "Priority", value: "Low" }],
      createdAt: createDate(-3),
    },
  ]

  // In Progress tasks
  const inProgressTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Implement authentication flow",
      description: "Create login, registration, and password reset functionality",
      status: "In Progress",
      dueDate: createDate(2),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Design authentication screens", completed: true },
        { id: `subtask-${generateId()}`, title: "Implement login functionality", completed: true },
        { id: `subtask-${generateId()}`, title: "Implement registration", completed: false },
        { id: `subtask-${generateId()}`, title: "Implement password reset", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Assigned To", value: "Michael" },
        { id: `field-${generateId()}`, name: "Story Points", value: "8" },
      ],
      createdAt: createDate(-5),
    },
    {
      id: `task-${generateId()}`,
      title: "Optimize database queries",
      description: "Improve performance of slow database queries on the dashboard",
      status: "In Progress",
      dueDate: createDate(1),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Identify slow queries", completed: true },
        { id: `subtask-${generateId()}`, title: "Add indexes", completed: false },
        { id: `subtask-${generateId()}`, title: "Rewrite complex queries", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Estimated Hours", value: "6" },
      ],
      createdAt: createDate(-4),
    },
  ]

  // Blocked tasks
  const blockedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Fix payment integration",
      description: "Resolve issues with the Stripe payment integration",
      status: "Blocked",
      dueDate: createDate(-1), // Overdue
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Investigate error logs", completed: true },
        { id: `subtask-${generateId()}`, title: "Contact Stripe support", completed: true },
        { id: `subtask-${generateId()}`, title: "Update API integration", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Critical" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Waiting for API documentation" },
      ],
      createdAt: createDate(-7),
    },
    {
      id: `task-${generateId()}`,
      title: "Finalize third-party integrations",
      description: "Complete integration with analytics and marketing tools",
      status: "Blocked",
      dueDate: createDate(-2), // Overdue
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Set up Google Analytics", completed: true },
        { id: `subtask-${generateId()}`, title: "Integrate Mailchimp", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Waiting for API keys" },
      ],
      createdAt: createDate(-6),
    },
  ]

  // Completed tasks
  const completedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Create project proposal",
      description: "Draft and finalize the project proposal document",
      status: "Completed",
      dueDate: createDate(-5),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Research market needs", completed: true },
        { id: `subtask-${generateId()}`, title: "Define project scope", completed: true },
        { id: `subtask-${generateId()}`, title: "Create budget estimate", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Completed On", value: createDate(-6).split("T")[0] },
      ],
      createdAt: createDate(-10),
    },
    {
      id: `task-${generateId()}`,
      title: "Set up development environment",
      description: "Configure development, staging, and production environments",
      status: "Completed",
      dueDate: createDate(-8),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Set up local environment", completed: true },
        { id: `subtask-${generateId()}`, title: "Configure staging server", completed: true },
        { id: `subtask-${generateId()}`, title: "Set up CI/CD pipeline", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Completed By", value: "David" },
      ],
      createdAt: createDate(-12),
    },
    {
      id: `task-${generateId()}`,
      title: "Initial user research",
      description: "Conduct interviews and surveys with potential users",
      status: "Completed",
      dueDate: createDate(-15),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Create research questions", completed: true },
        { id: `subtask-${generateId()}`, title: "Recruit participants", completed: true },
        { id: `subtask-${generateId()}`, title: "Analyze results", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Participants", value: "12" },
      ],
      createdAt: createDate(-20),
    },
  ]

  return {
    "To Do": todoTasks,
    "In Progress": inProgressTasks,
    Blocked: blockedTasks,
    Completed: completedTasks,
  }
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [rules, setRules] = useState<Rule[]>([])
  const [activeTab, setActiveTab] = useState("board")
  const [isInitialized, setIsInitialized] = useState(false)
  const [triggerSave, setTriggerSave] = useState(0)

  // Database hook
  const database = useDatabase()

  // Initialize data from database or create default data
  useEffect(() => {
    const initializeData = async () => {
      const data = await database.loadData()
      
      if (data && data.columns.length > 0) {
        // Load existing data from database
        setColumns(data.columns)
        setRules(data.rules)
      } else {
        // No data in database, create default data
        const mockTasks = generateMockTasks()

        const initialColumns: ColumnType[] = [
          {
            id: "column-1",
            title: "To Do",
            tasks: mockTasks["To Do"],
            color: "bg-blue-50 dark:bg-blue-900/30",
          },
          {
            id: "column-2",
            title: "In Progress",
            tasks: mockTasks["In Progress"],
            color: "bg-yellow-50 dark:bg-yellow-900/30",
          },
          {
            id: "column-3",
            title: "Blocked",
            tasks: mockTasks["Blocked"],
            color: "bg-red-50 dark:bg-red-900/30",
          },
          {
            id: "column-4",
            title: "Completed",
            tasks: mockTasks["Completed"],
            color: "bg-green-50 dark:bg-green-900/30",
          },
        ]

        const initialRules: Rule[] = [
          {
            id: `rule-${generateId()}`,
            name: "Move overdue tasks to Blocked",
            condition: {
              type: "due-date",
              operator: "is-overdue",
            },
            action: {
              type: "move-to-column",
              targetColumnId: "column-3", // Blocked column
            },
            enabled: true,
          },
          {
            id: `rule-${generateId()}`,
            name: "Move completed tasks when all subtasks done",
            condition: {
              type: "subtasks-completed",
              operator: "all-completed",
            },
            action: {
              type: "move-to-column",
              targetColumnId: "column-4", // Completed column
            },
            enabled: true,
          },
        ]

        setColumns(initialColumns)
        setRules(initialRules)

        // Save initial data to database
        await Promise.all([
          database.saveColumns(initialColumns),
          database.saveRules(initialRules)
        ])
        
        toast.success("Welcome! Sample data has been created.")
      }
      
      setIsInitialized(true)
    }

    initializeData()
  }, []) // Removed database dependency to prevent infinite loop

  // Auto-save columns when they change (debounced)
  useEffect(() => {
    if (!isInitialized) return

    const timeoutId = setTimeout(() => {
      database.saveColumns(columns)
    }, 1000) // Save after 1 second of no changes

    return () => clearTimeout(timeoutId)
  }, [columns, database.saveColumns, isInitialized]) // Use specific function instead of database object

  // Immediate save trigger for new tasks
  useEffect(() => {
    if (!isInitialized || triggerSave === 0) return

    // Save immediately when triggerSave changes
    database.saveColumns(columns)
  }, [triggerSave, database.saveColumns, columns, isInitialized])

  // Auto-save rules when they change (debounced)
  useEffect(() => {
    if (!isInitialized) return

    const timeoutId = setTimeout(() => {
      database.saveRules(rules)
    }, 1000) // Save after 1 second of no changes

    return () => clearTimeout(timeoutId)
  }, [rules, database.saveRules, isInitialized]) // Use specific function instead of database object

  // Process automation rules
  useEffect(() => {
    if (rules.length === 0 || !isInitialized) return

    // Only process enabled rules
    const enabledRules = rules.filter((rule) => rule.enabled)
    if (enabledRules.length === 0) return

    const tasksToMove: { taskId: string; sourceColumnId: string; targetColumnId: string }[] = []

    // Check each task against each rule
    columns.forEach((column) => {
      column.tasks.forEach((task) => {
        enabledRules.forEach((rule) => {
          const { condition, action } = rule
          let conditionMet = false

          // Check if condition is met
          if (condition.type === "due-date" && condition.operator === "is-overdue") {
            conditionMet = Boolean(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed")
          } else if (condition.type === "subtasks-completed" && condition.operator === "all-completed") {
            conditionMet = task.subtasks.length > 0 && task.subtasks.every((subtask) => subtask.completed)
          } else if (condition.type === "custom-field" && condition.field) {
            const field = task.customFields.find((f) => f.name === condition.field)
            if (field) {
              if (condition.operator === "equals") {
                conditionMet = field.value === condition.value
              } else if (condition.operator === "not-equals") {
                conditionMet = field.value !== condition.value
              } else if (condition.operator === "contains") {
                conditionMet = field.value.includes(condition.value || "")
              }
            }
          }

          // If condition is met and task is not already in the target column
          if (conditionMet && action.type === "move-to-column") {
            const targetColumn = columns.find((col) => col.id === action.targetColumnId)
            if (targetColumn && task.status !== targetColumn.title) {
              tasksToMove.push({
                taskId: task.id,
                sourceColumnId: column.id,
                targetColumnId: action.targetColumnId,
              })
            }
          }
        })
      })
    })

    // Apply the moves
    if (tasksToMove.length > 0) {
      const newColumns = [...columns]

      tasksToMove.forEach(({ taskId, sourceColumnId, targetColumnId }) => {
        const sourceColIndex = newColumns.findIndex((col) => col.id === sourceColumnId)
        const targetColIndex = newColumns.findIndex((col) => col.id === targetColumnId)

        if (sourceColIndex !== -1 && targetColIndex !== -1) {
          const sourceCol = newColumns[sourceColIndex]
          const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId)

          if (taskIndex !== -1) {
            const task = { ...sourceCol.tasks[taskIndex], status: newColumns[targetColIndex].title }

            // Remove from source
            newColumns[sourceColIndex] = {
              ...sourceCol,
              tasks: sourceCol.tasks.filter((t) => t.id !== taskId),
            }

            // Add to target
            newColumns[targetColIndex] = {
              ...newColumns[targetColIndex],
              tasks: [...newColumns[targetColIndex].tasks, task],
            }

            // Update selected task if it's being moved
            if (selectedTask && selectedTask.id === taskId) {
              setSelectedTask(task)
            }

            toast.success("Task moved automatically", {
              description: `"${task.title}" moved to ${newColumns[targetColIndex].title} by rule: ${rules.find((r) => r.action.targetColumnId === targetColumnId)?.name}`,
            })
          }
        }
      })

      setColumns(newColumns)
    }
  }, [columns, rules, selectedTask, isInitialized])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Create new arrays for the columns
    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId)

    // Find the task being moved
    const task = sourceColumn.tasks.find((t) => t.id === draggableId)
    if (!task) return

    // Update task status to match destination column
    const updatedTask = { ...task, status: destColumn.title }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const newTasks = Array.from(sourceColumn.tasks)
      newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, updatedTask)

      newColumns[sourceColIndex] = {
        ...sourceColumn,
        tasks: newTasks,
      }
    } else {
      // Moving to a different column
      // Remove from source column
      newColumns[sourceColIndex] = {
        ...sourceColumn,
        tasks: sourceColumn.tasks.filter((t) => t.id !== draggableId),
      }

      // Add to destination column
      const destTasks = Array.from(destColumn.tasks)
      destTasks.splice(destination.index, 0, updatedTask)

      newColumns[destColIndex] = {
        ...destColumn,
        tasks: destTasks,
      }

      // Update selected task if it's the one being moved
      if (selectedTask && selectedTask.id === draggableId) {
        setSelectedTask(updatedTask)
      }

      
    }

    setColumns(newColumns)
  }

  const addTask = (columnId: string, task: Task) => {
    // Update state immediately for UI responsiveness
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: [...column.tasks, task],
            }
          : column
      )
    )

    // Trigger immediate save for new tasks
    setTriggerSave(prev => prev + 1)

    
  }

  const updateTask = (updatedTask: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      }))
    )

    // Update selected task if it's the one being updated
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask)
    }
  }

  const deleteTask = (taskId: string) => {
    const taskToDelete = columns.flatMap((col) => col.tasks).find((task) => task.id === taskId)
    
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }))
    )

    // Close sidebar if the deleted task was selected
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null)
    }

    
  }

  const duplicateTask = (task: Task, columnId?: string) => {
    const duplicatedTask: Task = {
      ...task,
      id: `task-${generateId()}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
    }

    // If columnId is provided, add to that column; otherwise, add to the same column
    const targetColumnId = columnId || columns.find((col) => col.tasks.some((t) => t.id === task.id))?.id

    if (targetColumnId) {
      addTask(targetColumnId, duplicatedTask)
    }
  }

  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: ColumnType = {
        id: `column-${generateId()}`,
        title: newColumnTitle.trim(),
        tasks: [],
        color: "bg-gray-50 dark:bg-gray-900/30",
      }

      setColumns([...columns, newColumn])
      setNewColumnTitle("")
      setIsAddingColumn(false)

      
    }
  }

  const updateColumn = (columnId: string, updates: Partial<ColumnType>) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => (column.id === columnId ? { ...column, ...updates } : column))
    )
  }

  const deleteColumn = (columnId: string) => {
    const columnToDelete = columns.find((col) => col.id === columnId)
    const hasActiveTasks = columnToDelete && columnToDelete.tasks.length > 0

    if (hasActiveTasks) {
      toast.error("Cannot delete column", {
        description: "Move all tasks to other columns before deleting",
      })
      return
    }

    setColumns((prevColumns) => prevColumns.filter((column) => column.id !== columnId))

    
  }

  const addRule = (rule: Rule) => {
    setRules((prevRules) => [...prevRules, rule])
    
  }

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    setRules((prevRules) => prevRules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)))
  }

  const deleteRule = (ruleId: string) => {
    const ruleToDelete = rules.find((rule) => rule.id === ruleId)
    
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== ruleId))
    
    
  }

  // Export data functionality
  const handleExportData = async () => {
    const data = await database.exportData()
    if (data) {
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `flowmate-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  // Import data functionality
  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const text = await file.text()
          const data = JSON.parse(text)
          
          const success = await database.importData(data)
          if (success) {
            // Reload data after import
            const newData = await database.loadData()
            if (newData) {
              setColumns(newData.columns)
              setRules(newData.rules)
            }
          }
        } catch (error) {
          toast.error("Import failed", {
            description: "Invalid file format or corrupted data"
          })
        }
      }
    }
    input.click()
  }

  // Clear all data functionality
  const handleClearAllData = async () => {
    const success = await database.clearAllData()
    if (success) {
      setColumns([])
      setRules([])
      setSelectedTask(null)
    }
  }

  // Show loading state
  if (database.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading FlowMate...</p>
        </div>
      </div>
    )
  }

  const renderBoardContent = () => (
    <>
      {/* Header with data management controls */}
      <div className="border-b">
        {/* Mobile-first responsive header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
          {/* App title and logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-violet-600" />
            <h1 className="text-xl sm:text-2xl font-bold">FlowMate</h1>
          </div>
          
          {/* Controls container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleExportData} className="flex-shrink-0">
                <Download className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Export</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleImportData} className="flex-shrink-0">
                <Upload className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Import</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Clear All</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all tasks, columns, and automation rules. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData} className="bg-red-600 hover:bg-red-700">
                      Clear All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            {/* Theme toggle */}
            <div className="flex justify-center sm:justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Board content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-6 min-w-max">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddTask={addTask}
                onTaskClick={setSelectedTask}
                onDuplicateTask={duplicateTask}
                onUpdateColumn={updateColumn}
                onDeleteColumn={() => deleteColumn(column.id)}
              />
            ))}

            {/* Add Column Button */}
            {isAddingColumn ? (
              <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="space-y-3">
                  <Label htmlFor="column-title">Column Title</Label>
                  <Input
                    id="column-title"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Enter column title..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addColumn()
                      } else if (e.key === "Escape") {
                        setIsAddingColumn(false)
                        setNewColumnTitle("")
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button onClick={addColumn} size="sm">
                      Add Column
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingColumn(false)
                        setNewColumnTitle("")
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="w-80 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Plus className="h-6 w-6 mr-2" />
                Add Column
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Task Detail Sidebar */}
      {selectedTask && (
        <TaskDetailSidebar
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onDuplicate={duplicateTask}
          columns={columns}
        />
      )}
    </>
  )

  const renderAutomationContent = () => (
    <div className="p-6">
      <AutomationRules
        rules={rules}
        columns={columns}
        onAddRule={addRule}
        onUpdateRule={updateRule}
        onDeleteRule={deleteRule}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-noise flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mt-4">
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="flex-1 flex flex-col mt-0">
          {renderBoardContent()}
        </TabsContent>

        <TabsContent value="automation" className="flex-1 flex flex-col mt-0">
          {renderAutomationContent()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
