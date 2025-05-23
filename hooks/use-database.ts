import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { dbService } from "@/lib/database"
import type { Task, Column, Rule } from "@/types/kanban"

/**
 * Custom hook for managing database operations and state synchronization
 * Handles the conversion between flat database storage and nested component state
 */
export function useDatabase() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load all data from the database and reconstruct the nested structure
   */
  const loadData = useCallback(async (): Promise<{
    columns: Column[]
    rules: Rule[]
  } | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const [tasks, columnData, rules] = await Promise.all([
        dbService.getAllTasks(),
        dbService.getAllColumns(),
        dbService.getAllRules()
      ])

      // Reconstruct columns with their tasks (sorted by creation order)
      const columns = columnData.map(column => ({
        ...column,
        tasks: tasks
          .filter(task => task.status === column.title)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }))

      return { columns, rules }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data"
      setError(errorMessage)
      console.error("Error loading data:", err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Save all columns and their tasks to the database
   */
  const saveColumns = useCallback(async (columns: Column[]): Promise<boolean> => {
    try {
      // Extract all tasks from columns and flatten them
      const allTasks: Task[] = columns.flatMap(column => column.tasks)
      
      // Save columns without tasks (we store tasks separately)
      const columnsToSave: Column[] = columns.map(column => ({
        ...column,
        tasks: [] // Remove tasks from column data since we store them separately
      }))

      // First, clear existing data
      const [existingTasks, existingColumns] = await Promise.all([
        dbService.getAllTasks(),
        dbService.getAllColumns()
      ])

      // Delete existing data first
      await Promise.all([
        ...existingTasks.map(task => dbService.deleteTask(task.id)),
        ...existingColumns.map(column => dbService.deleteColumn(column.id))
      ])

      // Then add new data
      await Promise.all([
        ...columnsToSave.map(column => dbService.addColumn(column)),
        ...allTasks.map(task => dbService.addTask(task))
      ])

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save data"
      setError(errorMessage)
      console.error("Error saving columns:", err)
      toast.error("Failed to save changes", {
        description: errorMessage
      })
      return false
    }
  }, [])

  /**
   * Save automation rules to the database
   */
  const saveRules = useCallback(async (rules: Rule[]): Promise<boolean> => {
    try {
      // First, get and delete existing rules
      const existingRules = await dbService.getAllRules()
      await Promise.all(existingRules.map(rule => dbService.deleteRule(rule.id)))
      
      // Then add new rules
      await Promise.all(rules.map(rule => dbService.addRule(rule)))
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save rules"
      setError(errorMessage)
      console.error("Error saving rules:", err)
      toast.error("Failed to save automation rules", {
        description: errorMessage
      })
      return false
    }
  }, [])

  /**
   * Add a single task to the database
   */
  const addTask = useCallback(async (task: Task): Promise<boolean> => {
    try {
      await dbService.addTask(task)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add task"
      setError(errorMessage)
      console.error("Error adding task:", err)
      toast.error("Failed to add task", {
        description: errorMessage
      })
      return false
    }
  }, [])

  /**
   * Update a single task in the database
   */
  const updateTask = useCallback(async (task: Task): Promise<boolean> => {
    try {
      await dbService.updateTask(task)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task"
      setError(errorMessage)
      console.error("Error updating task:", err)
      toast.error("Failed to update task", {
        description: errorMessage
      })
      return false
    }
  }, [])

  /**
   * Delete a single task from the database
   */
  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      await dbService.deleteTask(taskId)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task"
      setError(errorMessage)
      console.error("Error deleting task:", err)
      toast.error("Failed to delete task", {
        description: errorMessage
      })
      return false
    }
  }, [])

  /**
   * Export all data from the database
   */
  const exportData = useCallback(async (): Promise<{
    tasks: Task[]
    columns: Column[]
    rules: Rule[]
  } | null> => {
    try {
      const data = await dbService.exportData()
      toast.success("Data exported successfully")
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export data"
      setError(errorMessage)
      console.error("Error exporting data:", err)
      toast.error("Failed to export data", {
        description: errorMessage
      })
      return null
    }
  }, [])

  /**
   * Import data into the database (replaces all existing data)
   */
  const importData = useCallback(async (data: {
    tasks: Task[]
    columns: Column[]
    rules: Rule[]
  }): Promise<boolean> => {
    try {
      await dbService.importData(data)
      toast.success("Data imported successfully")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to import data"
      setError(errorMessage)
      console.error("Error importing data:", err)
      toast.error("Failed to import data", {
        description: errorMessage
      })
      return false
    }
  }, [])

  /**
   * Clear all data from the database
   */
  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      await dbService.clearAllData()
      toast.success("All data cleared successfully")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear data"
      setError(errorMessage)
      console.error("Error clearing data:", err)
      toast.error("Failed to clear data", {
        description: errorMessage
      })
      return false
    }
  }, [])

  return {
    // State
    isLoading,
    error,
    
    // Operations
    loadData,
    saveColumns,
    saveRules,
    addTask,
    updateTask,
    deleteTask,
    exportData,
    importData,
    clearAllData,
    
    // Utility to clear error state
    clearError: () => setError(null)
  }
} 