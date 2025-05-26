import Dexie, { type EntityTable } from "dexie"
import type { Task, Column, Rule } from "@/types/kanban"

/**
 * Database interface defining the structure of our IndexedDB database
 */
interface FlowMateDatabase {
  tasks: EntityTable<Task, "id">
  columns: EntityTable<Column, "id">
  rules: EntityTable<Rule, "id">
}

/**
 * FlowMate Database class extending Dexie
 * Manages local storage for tasks, columns, and automation rules
 */
class FlowMateDB extends Dexie {
  tasks!: EntityTable<Task, "id">
  columns!: EntityTable<Column, "id">
  rules!: EntityTable<Rule, "id">

  constructor() {
    super("FlowMateDB")
    
    // Define database schema
    this.version(1).stores({
      tasks: "id, title, status, dueDate, createdAt",
      columns: "id, title",
      rules: "id, name, enabled"
    })
  }
}

// Create and export database instance
export const db = new FlowMateDB()

/**
 * Database service functions for managing data persistence
 */
export const dbService = {
  // Task operations
  async getAllTasks(): Promise<Task[]> {
    try {
      return await db.tasks.toArray()
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return []
    }
  },

  async addTask(task: Task): Promise<void> {
    try {
      await db.tasks.add(task)
    } catch (error) {
      console.error("Error adding task:", error)
      throw new Error("Failed to add task")
    }
  },

  async updateTask(task: Task): Promise<void> {
    try {
      await db.tasks.put(task)
    } catch (error) {
      console.error("Error updating task:", error)
      throw new Error("Failed to update task")
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await db.tasks.delete(taskId)
    } catch (error) {
      console.error("Error deleting task:", error)
      throw new Error("Failed to delete task")
    }
  },

  async getTasksByColumn(columnTitle: string): Promise<Task[]> {
    try {
      return await db.tasks.where("status").equals(columnTitle).toArray()
    } catch (error) {
      console.error("Error fetching tasks by column:", error)
      return []
    }
  },

  // Column operations
  async getAllColumns(): Promise<Column[]> {
    try {
      return await db.columns.toArray()
    } catch (error) {
      console.error("Error fetching columns:", error)
      return []
    }
  },

  async addColumn(column: Column): Promise<void> {
    try {
      await db.columns.add(column)
    } catch (error) {
      console.error("Error adding column:", error)
      throw new Error("Failed to add column")
    }
  },

  async updateColumn(column: Column): Promise<void> {
    try {
      await db.columns.put(column)
    } catch (error) {
      console.error("Error updating column:", error)
      throw new Error("Failed to update column")
    }
  },

  async deleteColumn(columnId: string): Promise<void> {
    try {
      // First delete all tasks in this column
      const tasks = await this.getAllTasks()
      const columnTasks = tasks.filter(task => {
        // Find column by ID to get its title
        return db.columns.get(columnId).then(col => col?.title === task.status)
      })
      
      await Promise.all(columnTasks.map(task => this.deleteTask(task.id)))
      
      // Then delete the column
      await db.columns.delete(columnId)
    } catch (error) {
      console.error("Error deleting column:", error)
      throw new Error("Failed to delete column")
    }
  },

  // Rule operations
  async getAllRules(): Promise<Rule[]> {
    try {
      return await db.rules.toArray()
    } catch (error) {
      console.error("Error fetching rules:", error)
      return []
    }
  },

  async addRule(rule: Rule): Promise<void> {
    try {
      await db.rules.add(rule)
    } catch (error) {
      console.error("Error adding rule:", error)
      throw new Error("Failed to add rule")
    }
  },

  async updateRule(rule: Rule): Promise<void> {
    try {
      await db.rules.put(rule)
    } catch (error) {
      console.error("Error updating rule:", error)
      throw new Error("Failed to update rule")
    }
  },

  async deleteRule(ruleId: string): Promise<void> {
    try {
      await db.rules.delete(ruleId)
    } catch (error) {
      console.error("Error deleting rule:", error)
      throw new Error("Failed to delete rule")
    }
  },

  // Utility operations
  async clearAllData(): Promise<void> {
    try {
      // Only clear tasks, keep columns and rules
      await db.tasks.clear()
    } catch (error) {
      console.error("Error clearing data:", error)
      throw new Error("Failed to clear data")
    }
  },

  async exportData(): Promise<{
    tasks: Task[]
    columns: Column[]
    rules: Rule[]
  }> {
    try {
      const [tasks, columns, rules] = await Promise.all([
        this.getAllTasks(),
        this.getAllColumns(),
        this.getAllRules()
      ])
      
      return { tasks, columns, rules }
    } catch (error) {
      console.error("Error exporting data:", error)
      throw new Error("Failed to export data")
    }
  },

  async importData(data: {
    tasks: Task[]
    columns: Column[]
    rules: Rule[]
  }): Promise<void> {
    try {
      await this.clearAllData()
      
      await Promise.all([
        db.tasks.bulkAdd(data.tasks),
        db.columns.bulkAdd(data.columns),
        db.rules.bulkAdd(data.rules)
      ])
    } catch (error) {
      console.error("Error importing data:", error)
      throw new Error("Failed to import data")
    }
  }
} 