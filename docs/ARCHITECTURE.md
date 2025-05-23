# FlowMate Architecture Documentation

## Overview

FlowMate is built using a modern React/Next.js architecture with a client-side database approach. This document provides a comprehensive overview of the system architecture, data flow, and component relationships.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Next.js App   │    │   IndexedDB     │
│                 │◄──►│                 │◄──►│                 │
│ - React UI      │    │ - App Router    │    │ - Dexie ORM     │
│ - Client State  │    │ - API Routes    │    │ - Local Storage │
│ - Theme System  │    │ - SSR/SSG       │    │ - Offline-first │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Layers

#### Presentation Layer
- **Next.js 15**: React framework with App Router
- **React 19**: User interface library
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible components
- **Lucide React**: Icon library

#### State Management Layer
- **React State**: Local component state management
- **Custom Hooks**: Centralized business logic
- **Context API**: Theme and global state management

#### Data Layer
- **Dexie**: IndexedDB wrapper for local persistence
- **IndexedDB**: Browser-native database
- **TypeScript**: Type-safe data models

#### Utility Layer
- **date-fns**: Date manipulation utilities
- **clsx**: Conditional class name utility
- **@hello-pangea/dnd**: Drag and drop functionality

## Data Architecture

### Database Schema

```typescript
// Core Entities
interface Task {
  id: string
  title: string
  description?: string
  status: string
  dueDate: string | null
  subtasks: Subtask[]
  customFields: CustomField[]
  createdAt: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
}

interface Rule {
  id: string
  name: string
  condition: RuleCondition
  action: RuleAction
  enabled: boolean
}
```

### Data Flow

1. **Component Interaction**: User interacts with UI components
2. **Hook Invocation**: Components call `use-database` hook methods
3. **Database Operation**: Hook performs CRUD operations via Dexie
4. **State Update**: Hook updates React state with new data
5. **UI Rerender**: Components rerender with updated state

```
User Action → Component → Hook → Database → State Update → UI Update
```

## Component Architecture

### Component Hierarchy

```
App (layout.tsx)
├── ThemeProvider
└── KanbanBoard
    ├── ThemeToggle
    ├── Column (multiple)
    │   └── TaskCard (multiple)
    ├── TaskDetailSidebar
    │   ├── SubtaskList
    │   └── CustomFieldList
    └── AutomationRules
        ├── RuleList
        └── RuleEditor
```

### Component Categories

#### **Layout Components**
- `layout.tsx`: Root layout with providers and global styles
- `page.tsx`: Main page rendering the Kanban board

#### **Core Components**
- `KanbanBoard`: Main application orchestrator
- `Column`: Kanban column with drag-drop capabilities
- `TaskCard`: Individual task representation
- `TaskDetailSidebar`: Comprehensive task editing interface

#### **Feature Components**
- `AutomationRules`: Rule management interface
- `ThemeToggle`: Dark/light mode switcher
- `ThemeProvider`: Theme context provider

#### **UI Components** (Radix-based)
- Form controls (Input, Button, Select)
- Overlay components (Dialog, Popover, Sheet)
- Feedback components (Toast, Alert)

## State Management Strategy

### Local State Pattern

FlowMate uses a **hook-based state management** approach:

```typescript
// Central data hook
const useDatabase = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [columns, setColumns] = useState<Column[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  
  // CRUD operations
  // State synchronization
  // Database persistence
}
```

### Benefits of This Approach

1. **Simplicity**: No external state management library needed
2. **Type Safety**: Full TypeScript integration
3. **Performance**: Granular updates and React optimizations
4. **Offline-first**: Local storage ensures data persistence

## Data Persistence Strategy

### IndexedDB with Dexie

```typescript
// Database configuration
class KanbanDatabase extends Dexie {
  tasks!: Table<Task>
  columns!: Table<Column>
  rules!: Table<Rule>

  constructor() {
    super("KanbanDatabase")
    this.version(1).stores({
      tasks: "id, title, status, dueDate, createdAt",
      columns: "id, title",
      rules: "id, name, enabled"
    })
  }
}
```

### Offline-First Design

- All data operations work offline
- No network dependencies for core functionality
- Export/import for data portability
- Browser storage limits handled gracefully

## Automation System Architecture

### Rule Engine Design

```typescript
// Rule processing pipeline
const processRules = async (tasks: Task[], rules: Rule[]) => {
  for (const rule of rules.filter(r => r.enabled)) {
    const matchingTasks = tasks.filter(task => 
      evaluateCondition(task, rule.condition)
    )
    
    for (const task of matchingTasks) {
      await executeAction(task, rule.action)
    }
  }
}
```

### Condition Evaluation

Rules support multiple condition types:
- **Due Date Conditions**: Time-based triggers
- **Subtask Conditions**: Completion-based triggers  
- **Custom Field Conditions**: Value-based triggers

### Action Execution

Currently supports:
- **Move to Column**: Automated task movement
- **Future Actions**: Assignee changes, notifications, etc.

## Performance Considerations

### Optimization Strategies

1. **React Optimizations**
   - `React.memo` for expensive components
   - `useCallback` for stable function references
   - `useMemo` for computed values

2. **Database Optimizations**
   - Indexed queries for fast lookups
   - Batch operations for bulk updates
   - Lazy loading for large datasets

3. **Bundle Optimizations**
   - Dynamic imports for large components
   - Tree shaking for unused code
   - Code splitting at route level

### Memory Management

- Database connections properly closed
- Event listeners cleaned up in useEffect
- Large objects properly dereferenced

## Security Considerations

### Data Privacy

- **Local Storage**: All data stays on user's device
- **No Server Communication**: No data transmitted externally
- **Export Security**: JSON exports are plain text

### Input Validation

- TypeScript type checking at compile time
- Runtime validation for user inputs
- XSS protection through React's built-in escaping

## Extensibility Points

### Adding New Features

1. **New Data Types**: Extend database schema and TypeScript types
2. **New Components**: Follow existing component patterns
3. **New Automation Actions**: Extend rule action system
4. **New UI Components**: Build on Radix UI primitives

### Integration Possibilities

- **Cloud Sync**: Add server-side persistence
- **Real-time Collaboration**: WebSocket integration
- **External APIs**: Task import/export with other tools
- **Mobile Apps**: React Native adaptation

## Testing Strategy

### Recommended Testing Approach

1. **Unit Tests**: Utils, hooks, and pure functions
2. **Component Tests**: React Testing Library for UI logic
3. **Integration Tests**: Database operations and workflows
4. **E2E Tests**: Playwright for full user journeys

### Critical Test Areas

- Database operations and data integrity
- Drag and drop functionality
- Automation rule execution
- Data export/import operations

## Development Workflow

### Code Organization Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Combine simple components
3. **Prop Drilling Avoidance**: Use context for deeply nested data
4. **Type-First Development**: Define types before implementation

### File Naming Conventions

- Components: `kebab-case.tsx`
- Hooks: `use-feature-name.ts`
- Utilities: `feature-name.ts`
- Types: `feature-name.ts`

---

This architecture provides a solid foundation for a maintainable, scalable task management application while keeping complexity manageable and performance optimal. 