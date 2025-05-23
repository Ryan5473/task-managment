# Component Documentation

This document provides detailed information about each component in the FlowMate application, including their purpose, props, usage patterns, and implementation details.

## Table of Contents

- [Core Components](#core-components)
- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Feature Components](#feature-components)
- [Component Patterns](#component-patterns)

## Core Components

### KanbanBoard

**File**: `components/kanban-board.tsx`

The main orchestrator component that manages the entire Kanban board functionality.

#### Features

- Manages board state (columns, tasks, rules)
- Handles drag and drop operations
- Coordinates with automation system
- Provides data management (export/import/clear)
- Manages UI state (sidebar visibility, theme)

#### Key Dependencies

```typescript
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { useDatabase } from "@/hooks/use-database"
import { Task, Column, Rule } from "@/types/kanban"
```

#### State Management

```typescript
const [selectedTask, setSelectedTask] = useState<Task | null>(null)
const [isSidebarOpen, setIsSidebarOpen] = useState(false)
const [isAutomationOpen, setIsAutomationOpen] = useState(false)
```

#### Main Methods

- `handleDragEnd(result: DropResult)`: Processes drag and drop operations
- `handleTaskSelect(task: Task)`: Opens task detail sidebar
- `handleDataExport()`: Exports board data as JSON
- `handleDataImport(data: BoardData)`: Imports board data
- `handleDataClear()`: Clears all board data

#### Usage Example

```tsx
// Simple usage - no props required
<KanbanBoard />
```

---

### Column

**File**: `components/column.tsx`

Represents an individual Kanban column with drag-and-drop capabilities.

#### Props

```typescript
interface ColumnProps {
  column: Column
  onTaskClick: (task: Task) => void
  onEditColumn: (id: string, title: string, color?: string) => void
  onDeleteColumn: (id: string) => void
  onAddTask: (columnId: string, task: Omit<Task, "id" | "createdAt">) => void
}
```

#### Features

- Renders task cards in droppable area
- Handles column editing (title, color)
- Provides task creation interface
- Manages column deletion with confirmation
- Responsive design for mobile devices

#### Key Interactions

- Click task card → Opens task detail sidebar
- Double-click column title → Edit mode
- Plus button → Create new task
- Menu → Edit/delete column options

#### Usage Example

```tsx
<Column
  column={column}
  onTaskClick={handleTaskSelect}
  onEditColumn={updateColumn}
  onDeleteColumn={deleteColumn}
  onAddTask={addTask}
/>
```

---

### TaskCard

**File**: `components/task-card.tsx`

Individual task representation within a column.

#### Props

```typescript
interface TaskCardProps {
  task: Task
  onClick: () => void
}
```

#### Features

- Displays task metadata (title, due date, progress)
- Shows completion indicators for subtasks
- Responsive hover and click states
- Accessibility support with proper ARIA labels

#### Visual Elements

- Task title (truncated if too long)
- Due date with overdue highlighting
- Subtask progress indicator
- Custom field count badge

#### Usage Example

```tsx
<TaskCard
  task={task}
  onClick={() => onTaskClick(task)}
/>
```

---

### TaskDetailSidebar

**File**: `components/task-detail-sidebar.tsx`

Comprehensive task editing interface displayed as a slide-over panel.

#### Props

```typescript
interface TaskDetailSidebarProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  columns: Column[]
}
```

#### Features

- **Task Metadata**: Title, description, status, due date
- **Subtask Management**: Add, edit, delete, toggle completion
- **Custom Fields**: Dynamic field creation and editing
- **Status Management**: Move between columns
- **Date Selection**: Due date picker with calendar
- **Deletion**: Task deletion with confirmation

#### Sections

1. **Header**: Task title, close button, delete action
2. **Basic Info**: Description, status, due date
3. **Subtasks**: Interactive subtask list
4. **Custom Fields**: Dynamic field management
5. **Actions**: Save, cancel, delete buttons

#### Usage Example

```tsx
<TaskDetailSidebar
  task={selectedTask}
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  onUpdateTask={updateTask}
  onDeleteTask={deleteTask}
  columns={columns}
/>
```

---

## Feature Components

### AutomationRules

**File**: `components/automation-rules.tsx`

Management interface for automation rules and workflow automation.

#### Features

- **Rule List**: View all automation rules
- **Rule Creation**: Create new rules with conditions and actions
- **Rule Editing**: Modify existing rules
- **Rule Toggling**: Enable/disable rules
- **Condition Builder**: Visual condition configuration
- **Action Configuration**: Set up automated actions

#### Rule Types Supported

1. **Due Date Rules**: Based on task due dates
2. **Subtask Rules**: Based on subtask completion
3. **Custom Field Rules**: Based on field values

#### Usage Example

```tsx
<AutomationRules
  rules={rules}
  columns={columns}
  onAddRule={addRule}
  onUpdateRule={updateRule}
  onDeleteRule={deleteRule}
/>
```

---

### ThemeToggle

**File**: `components/theme-toggle.tsx`

Simple toggle component for switching between light and dark themes.

#### Features

- Smooth theme transition
- System theme detection
- Icon animation
- Accessibility support

#### Usage Example

```tsx
<ThemeToggle />
```

---

### ThemeProvider

**File**: `components/theme-provider.tsx`

Context provider that wraps the application with theme capabilities.

#### Features

- Theme persistence
- System theme detection
- Theme context distribution

#### Usage Example

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

---

## Layout Components

### RootLayout

**File**: `app/layout.tsx`

Root layout component that wraps the entire application.

#### Features

- HTML document structure
- Global CSS imports
- Theme provider setup
- Font configuration
- Metadata configuration

#### Structure

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## UI Components

The UI components are built using Radix UI primitives and Tailwind CSS. They follow a consistent design system.

### Button

**File**: `components/ui/button.tsx`

Reusable button component with multiple variants.

#### Variants

- `default`: Primary button style
- `destructive`: Danger/warning actions
- `outline`: Secondary button style
- `secondary`: Muted button style
- `ghost`: Minimal button style
- `link`: Link-styled button

#### Sizes

- `default`: Standard size
- `sm`: Small size
- `lg`: Large size
- `icon`: Square icon button

#### Usage Example

```tsx
<Button variant="default" size="sm">
  Save Changes
</Button>
```

### Dialog

**File**: `components/ui/dialog.tsx`

Modal dialog component for overlays and confirmations.

#### Components

- `Dialog`: Root container
- `DialogTrigger`: Trigger element
- `DialogContent`: Dialog content area
- `DialogHeader`: Dialog header
- `DialogTitle`: Dialog title
- `DialogDescription`: Dialog description

#### Usage Example

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Input

**File**: `components/ui/input.tsx`

Text input component with consistent styling.

#### Features

- Consistent focus states
- Error state support
- Disabled state support
- Full accessibility support

#### Usage Example

```tsx
<Input
  type="text"
  placeholder="Enter task title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

---

## Component Patterns

### Hook Integration Pattern

Components consistently use the `use-database` hook for data operations:

```tsx
const MyComponent = () => {
  const { tasks, addTask, updateTask, deleteTask } = useDatabase()
  
  // Component logic
}
```

### Error Handling Pattern

Components implement graceful error handling:

```tsx
const handleAction = async () => {
  try {
    await riskyOperation()
    toast.success("Operation successful")
  } catch (error) {
    toast.error("Operation failed")
    console.error(error)
  }
}
```

### Loading State Pattern

Components show loading states during async operations:

```tsx
const [isLoading, setIsLoading] = useState(false)

const handleAsyncAction = async () => {
  setIsLoading(true)
  try {
    await asyncOperation()
  } finally {
    setIsLoading(false)
  }
}
```

### Memoization Pattern

Expensive components are memoized for performance:

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  const computedValue = useMemo(() => 
    expensiveComputation(data), [data]
  )
  
  return <div>{computedValue}</div>
})
```

### Event Handler Pattern

Event handlers are wrapped in useCallback for stability:

```tsx
const handleClick = useCallback((id: string) => {
  // Handle click logic
}, [dependency])
```

---

## Component Testing Guidelines

### Unit Testing

Test individual component behavior:

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import TaskCard from "./task-card"

test("renders task title", () => {
  const task = { id: "1", title: "Test Task", /* ... */ }
  render(<TaskCard task={task} onClick={jest.fn()} />)
  
  expect(screen.getByText("Test Task")).toBeInTheDocument()
})
```

### Integration Testing

Test component interactions:

```tsx
test("opens task detail on card click", () => {
  const handleClick = jest.fn()
  render(<TaskCard task={task} onClick={handleClick} />)
  
  fireEvent.click(screen.getByRole("button"))
  expect(handleClick).toHaveBeenCalledWith(task)
})
```

---

This component documentation provides a comprehensive guide for understanding and working with FlowMate's component architecture. Each component is designed to be reusable, maintainable, and follows consistent patterns throughout the application. 