# FlowMate

FlowMate is a modern, intuitive task management and productivity application designed to streamline your workflow and boost productivity. Built with Next.js 15 and TypeScript, it combines the power of a Kanban board interface with intelligent automation features, all while keeping your data secure with local storage.

![FlowMate Preview](/public/og.png)

## ✨ Why FlowMate?

FlowMate stands out with its perfect blend of simplicity and power:

- **Intuitive Interface**: Clean, modern UI with a focus on usability
- **Privacy-First**: All data stays on your device with IndexedDB storage
- **Smart Automation**: Create custom rules to automate your workflow
- **Type-Safe**: Built with TypeScript for reliability and developer experience
- **Modern Stack**: Leverages Next.js 15, React 19, and Tailwind CSS 4
- **Cross-Platform**: Responsive design works seamlessly across all devices

## 🚀 Features

- **Kanban Board**: Visual task management with customizable columns
- **Drag & Drop**: Intuitive task organization powered by @hello-pangea/dnd
- **Task Management**: Complete task details with subtasks, custom fields, and due dates
- **Automation Rules**: Automated task workflows based on conditions
- **Local Storage**: All data persists locally using IndexedDB via Dexie
- **Data Management**: Export/import backups and clear data functionality
- **Dark Mode**: Theme toggle support with next-themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type Safety**: Built with strict TypeScript for better developer experience

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Data Persistence](#data-persistence)
- [Automation System](#automation-system)
- [Component Documentation](#component-documentation)
- [Development Guidelines](#development-guidelines)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd day-planner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see FlowMate.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 🛠 Technology Stack

- **Framework**: Next.js 15 with React 19 and App Router
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS 4 with Radix UI components
- **Database**: IndexedDB via Dexie for local storage
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Theme Management**: next-themes
- **Notifications**: Sonner (react-hot-toast alternative)
- **Date Picker**: react-day-picker

## 📁 Project Structure

```
day-planner/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (Kanban board)
│   └── globals.css        # Global styles and Tailwind imports
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix + Tailwind)
│   ├── kanban-board.tsx  # Main Kanban board component
│   ├── task-detail-sidebar.tsx  # Task details panel
│   ├── column.tsx        # Kanban column component
│   ├── task-card.tsx     # Individual task card
│   ├── automation-rules.tsx     # Automation rules manager
│   ├── theme-provider.tsx       # Theme context provider
│   └── theme-toggle.tsx         # Dark/light mode toggle
├── hooks/                # Custom React hooks
│   ├── use-database.ts   # Database operations hook
│   └── use-toast.tsx     # Toast notifications hook
├── lib/                  # Utility libraries
│   ├── database.ts       # Dexie database configuration
│   └── utils.ts          # General utility functions
├── types/                # TypeScript type definitions
│   └── kanban.ts         # Core data models
└── public/               # Static assets
```

## 💾 Data Persistence

FlowMate uses **IndexedDB** for local data storage via the Dexie library, ensuring your tasks, columns, and automation rules persist between sessions without requiring external servers or accounts.

### Database Schema

The application stores the following entities:

- **Tasks**: Individual work items with metadata
- **Columns**: Board columns containing tasks
- **Rules**: Automation rules for workflow management

### Data Operations

All database operations are centralized in the `use-database` hook, providing:
- CRUD operations for tasks, columns, and rules
- Data export/import functionality
- Database reset capabilities
- Real-time updates across components

## ⚡ Automation System

Create custom automation rules to streamline your workflow:

### Supported Conditions
- **Due Date**: Trigger on overdue tasks
- **Subtasks**: When all subtasks are completed
- **Custom Fields**: Based on field values and operators

### Available Actions
- **Move to Column**: Automatically move tasks between columns

### Condition Operators
- `equals` / `not-equals`: Exact value matching
- `contains`: Partial text matching
- `greater-than` / `less-than`: Numeric/date comparisons
- `is-empty` / `is-not-empty`: Field presence checks
- `is-overdue`: Date-based checks
- `all-completed`: Subtask completion checks

## 📚 Component Documentation

### Core Components

#### `KanbanBoard`
The main application component managing the entire board state.

**Features:**
- Drag and drop functionality
- Column management (add, edit, delete)
- Task filtering and management
- Automation rules integration
- Data export/import

#### `TaskDetailSidebar`
Comprehensive task editing interface.

**Features:**
- Task metadata editing
- Subtask management
- Custom field support
- Due date selection
- Task deletion

#### `Column`
Individual board column component.

**Features:**
- Task list rendering
- Drag and drop zones
- Column actions (edit, delete)
- Task creation

#### `AutomationRules`
Automation management interface.

**Features:**
- Rule creation and editing
- Condition/action configuration
- Rule enabling/disabling
- Real-time rule execution

### UI Components

Built with Radix UI primitives and Tailwind CSS:
- Dialogs and modals
- Form controls
- Navigation components
- Feedback components

## 👨‍💻 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, no `any` types
- **Naming**: Use descriptive, camelCase names for variables and functions
- **Components**: PascalCase for component names
- **Files**: kebab-case for file names

### Best Practices

1. **Type Safety**: Always define proper TypeScript interfaces
2. **Error Handling**: Implement proper error boundaries and try-catch blocks
3. **Performance**: Use React.memo and useCallback for expensive operations
4. **Accessibility**: Follow ARIA guidelines and semantic HTML
5. **Testing**: Write unit tests for utility functions and hooks

### State Management

- Local component state with `useState`
- Database operations via `use-database` hook
- Theme management via `next-themes`
- No external state management library required

## 🔌 API Reference

### `use-database` Hook

Main hook for all database operations:

```typescript
const {
  tasks,
  columns,
  rules,
  addTask,
  updateTask,
  deleteTask,
  addColumn,
  updateColumn,
  deleteColumn,
  addRule,
  updateRule,
  deleteRule,
  exportData,
  importData,
  clearAllData
} = useDatabase()
```

### Database Functions

- `addTask(task: Omit<Task, "id" | "createdAt">): Promise<void>`
- `updateTask(id: string, updates: Partial<Task>): Promise<void>`
- `deleteTask(id: string): Promise<void>`
- `addColumn(column: Omit<Column, "id">): Promise<void>`
- `updateColumn(id: string, updates: Partial<Column>): Promise<void>`
- `deleteColumn(id: string): Promise<void>`

## 🚀 Deployment

### Vercel (Recommended)

FlowMate is optimized for deployment on Vercel:

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms

FlowMate can be deployed on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

### Build Configuration

The application uses:
- Static export capability
- Optimized bundle splitting
- Image optimization
- Automatic code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Setup

1. Follow the [Getting Started](#getting-started) guide
2. Make your changes
3. Test thoroughly
4. Ensure TypeScript compilation passes
5. Run linting: `npm run lint`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [documentation](#component-documentation)
- Review existing [issues](link-to-issues)
- Create a new issue with detailed information

---

**FlowMate** - Streamline your workflow with intelligent task management.
