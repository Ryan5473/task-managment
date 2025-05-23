# FlowMate

A modern, efficient task management and productivity application built with Next.js. FlowMate features a Kanban board interface with drag-and-drop functionality, automation rules, and local data persistence.

## Features

- **Kanban Board**: Visual task management with customizable columns
- **Drag & Drop**: Intuitive task organization
- **Task Management**: Complete task details with subtasks, custom fields, and due dates
- **Automation Rules**: Automated task workflows based on conditions
- **Local Storage**: All data persists locally using IndexedDB
- **Data Management**: Export/import backups and clear data functionality
- **Dark Mode**: Theme toggle support
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see FlowMate.

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: IndexedDB via Dexie for local storage
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React

## Data Persistence

FlowMate uses IndexedDB for local data storage, ensuring your tasks, columns, and automation rules persist between sessions. No external server or account required - everything stays on your device.

## Automation

Create custom automation rules to streamline your workflow:
- Move overdue tasks automatically
- Auto-complete tasks when all subtasks are done
- Custom field-based conditions and actions

## Deploy on Vercel

The easiest way to deploy FlowMate is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
