"use client"

import { useState, useEffect, useRef } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Plus, Download, Upload, Trash2, Calendar, Settings } from "lucide-react"
import { toast } from "sonner"
import Column from "./column"
import TaskDetailSidebar from "./task-detail-sidebar"
import AutomationRules from "./automation-rules"
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
      title: "Plan quarterly marketing strategy",
      description: "Develop comprehensive marketing plan for Q2 including digital campaigns and budget allocation",
      status: "To Do",
      dueDate: createDate(10),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Analyze Q1 performance metrics", completed: false },
        { id: `subtask-${generateId()}`, title: "Define target audience segments", completed: false },
        { id: `subtask-${generateId()}`, title: "Allocate budget across channels", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Budget", value: "$25,000" },
      ],
      createdAt: createDate(-1),
    },
    {
      id: `task-${generateId()}`,
      title: "Upgrade server infrastructure",
      description: "Migrate to cloud-based infrastructure to improve scalability and performance",
      status: "To Do",
      dueDate: createDate(14),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Evaluate cloud providers", completed: false },
        { id: `subtask-${generateId()}`, title: "Design migration plan", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Team Lead", value: "Alex Chen" },
      ],
      createdAt: createDate(-2),
    },
    {
      id: `task-${generateId()}`,
      title: "Create employee handbook",
      description: "Develop comprehensive handbook covering policies, procedures, and company culture",
      status: "To Do",
      dueDate: createDate(21),
      subtasks: [],
      customFields: [{ id: `field-${generateId()}`, name: "Priority", value: "Low" }],
      createdAt: createDate(-1),
    },
  ]

  // In Progress tasks
  const inProgressTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Develop mobile app prototype",
      description: "Create interactive prototype for iOS and Android mobile application",
      status: "In Progress",
      dueDate: createDate(7),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Complete user flow diagrams", completed: true },
        { id: `subtask-${generateId()}`, title: "Design app interface mockups", completed: true },
        { id: `subtask-${generateId()}`, title: "Build interactive prototype", completed: false },
        { id: `subtask-${generateId()}`, title: "Conduct usability testing", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Developer", value: "Jordan Kim" },
        { id: `field-${generateId()}`, name: "Sprint Points", value: "13" },
      ],
      createdAt: createDate(-8),
    },
    {
      id: `task-${generateId()}`,
      title: "Implement customer feedback system",
      description: "Build automated system to collect and analyze customer feedback across all touchpoints",
      status: "In Progress",
      dueDate: createDate(5),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Design feedback collection forms", completed: true },
        { id: `subtask-${generateId()}`, title: "Set up analytics dashboard", completed: false },
        { id: `subtask-${generateId()}`, title: "Create automated reporting", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Estimated Days", value: "12" },
      ],
      createdAt: createDate(-6),
    },
  ]

  // Blocked tasks
  const blockedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Launch e-commerce platform",
      description: "Deploy new online store with payment processing and inventory management",
      status: "Blocked",
      dueDate: createDate(-3), // Overdue
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Complete security audit", completed: true },
        { id: `subtask-${generateId()}`, title: "Obtain payment processor approval", completed: true },
        { id: `subtask-${generateId()}`, title: "Configure SSL certificates", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Critical" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Awaiting legal compliance review" },
      ],
      createdAt: createDate(-12),
    },
    {
      id: `task-${generateId()}`,
      title: "Integrate CRM with email marketing",
      description: "Connect customer relationship management system with automated email campaigns",
      status: "Blocked",
      dueDate: createDate(-1), // Overdue
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Map data fields between systems", completed: true },
        { id: `subtask-${generateId()}`, title: "Test data synchronization", completed: false },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Blocker", value: "Waiting for vendor API documentation" },
      ],
      createdAt: createDate(-9),
    },
  ]

  // Completed tasks
  const completedTasks: Task[] = [
    {
      id: `task-${generateId()}`,
      title: "Rebrand company identity",
      description: "Complete visual rebrand including logo, colors, and brand guidelines",
      status: "Completed",
      dueDate: createDate(-7),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Research brand positioning", completed: true },
        { id: `subtask-${generateId()}`, title: "Design new logo concepts", completed: true },
        { id: `subtask-${generateId()}`, title: "Create brand style guide", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "High" },
        { id: `field-${generateId()}`, name: "Completed Date", value: createDate(-8).split("T")[0] },
      ],
      createdAt: createDate(-15),
    },
    {
      id: `task-${generateId()}`,
      title: "Optimize website performance",
      description: "Improve site loading speed and user experience across all devices",
      status: "Completed",
      dueDate: createDate(-10),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Audit current performance", completed: true },
        { id: `subtask-${generateId()}`, title: "Implement image optimization", completed: true },
        { id: `subtask-${generateId()}`, title: "Enable content delivery network", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Performance Gain", value: "45% faster load time" },
      ],
      createdAt: createDate(-18),
    },
    {
      id: `task-${generateId()}`,
      title: "Conduct team building workshop",
      description: "Organize quarterly team building event to improve collaboration and morale",
      status: "Completed",
      dueDate: createDate(-20),
      subtasks: [
        { id: `subtask-${generateId()}`, title: "Survey team preferences", completed: true },
        { id: `subtask-${generateId()}`, title: "Book venue and activities", completed: true },
        { id: `subtask-${generateId()}`, title: "Facilitate workshop session", completed: true },
      ],
      customFields: [
        { id: `field-${generateId()}`, name: "Priority", value: "Medium" },
        { id: `field-${generateId()}`, name: "Participants", value: "24 team members" },
      ],
      createdAt: createDate(-25),
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
  const [rules, setRules] = useState<Rule[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [triggerSave, setTriggerSave] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeTab, setActiveTab] = useState("board")
  // Add state to track manual moves and prevent automation conflicts
  const [isManualMoveInProgress, setIsManualMoveInProgress] = useState(false)
  
  // Use a ref to track manual move state immediately (synchronously)
  const manualMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isManualMoveRef = useRef(false)

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
            color: "bg-blue-300 dark:bg-blue-900/30",
          },
          {
            id: "column-2",
            title: "In Progress",
            tasks: mockTasks["In Progress"],
            color: "bg-yellow-300 dark:bg-yellow-900/30",
          },
          {
            id: "column-3",
            title: "Blocked",
            tasks: mockTasks["Blocked"],
            color: "bg-red-300 dark:bg-red-900/30",
          },
          {
            id: "column-4",
            title: "Completed",
            tasks: mockTasks["Completed"],
            color: "bg-green-300 dark:bg-green-900/30",
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
    // Check the ref immediately for manual move status
    if (rules.length === 0 || !isInitialized || isManualMoveInProgress || isManualMoveRef.current) return

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
  }, [columns, rules, selectedTask, isInitialized, isManualMoveInProgress])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Clear any existing timeout and set manual move flag immediately
    if (manualMoveTimeoutRef.current) {
      clearTimeout(manualMoveTimeoutRef.current)
    }
    
    // Set flags immediately (ref updates synchronously)
    isManualMoveRef.current = true
    setIsManualMoveInProgress(true)

    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) {
      // Reset flags if operation fails
      isManualMoveRef.current = false
      setIsManualMoveInProgress(false)
      return
    }

    // Create new arrays for the columns
    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId)

    // Find the task being moved
    const task = sourceColumn.tasks.find((t) => t.id === draggableId)
    if (!task) {
      // Reset flags if operation fails
      isManualMoveRef.current = false
      setIsManualMoveInProgress(false)
      return
    }

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

    

    // Clear the manual move flag after a delay to allow automation to resume
    manualMoveTimeoutRef.current = setTimeout(() => {
      isManualMoveRef.current = false
      setIsManualMoveInProgress(false)
    }, 2000) // Increased to 2 seconds for better reliability
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
      // Update columns to keep structure but remove tasks
      setColumns(prevColumns => prevColumns.map(column => ({
        ...column,
        tasks: []
      })))
      setSelectedTask(null)
    }
  }

  // Show loading state
  if (database.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <Calendar className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading FlowMate</h2>
            <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  const renderBoardContent = () => (
    <>
      {/* Board Content */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-6 min-w-max pb-6">
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

            {/* Enhanced Add Column Button */}
            {isAddingColumn ? (
              <div className="w-80 bg-card rounded-xl shadow-sm border border-border p-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="column-title" className="text-sm font-medium">
                      Column Title
                    </Label>
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
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addColumn} size="sm" className="flex-1" disabled={!newColumnTitle.trim()}>
                      Add Column
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingColumn(false)
                        setNewColumnTitle("")
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="w-80 h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-2">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-medium">Add Column</span>
                <span className="text-xs opacity-70">Click to create a new column</span>
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
    <div className="p-6 max-w-6xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header - Now at the top */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 gap-6">
          {/* Brand Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">FlowMate</h1>
              <p className="text-sm text-muted-foreground">Streamline your workflow</p>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>{columns.length} columns</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{columns.reduce((acc, col) => acc + col.tasks.length, 0)} tasks</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImportData} className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Tasks</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all tasks while keeping your columns and automation rules intact. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
             
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Now below the header */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Tab Navigation */}
        <div className="bg-card/30 backdrop-blur-sm border-b border-border">
          <div className="flex justify-center py-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted/50">
              <TabsTrigger value="board" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Calendar className="h-4 w-4" />
                Kanban Board
              </TabsTrigger>
              <TabsTrigger value="automation" className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
                Automation
                {isManualMoveInProgress && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Automation paused during manual move" />
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="board" className="flex-1 flex flex-col m-0">
          {renderBoardContent()}
        </TabsContent>

        <TabsContent value="automation" className="flex-1 flex flex-col m-0">
          {renderAutomationContent()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
