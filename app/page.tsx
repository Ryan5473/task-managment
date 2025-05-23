"use client";

import KanbanBoard from "@/components/kanban-board"
import MobileWarning from "@/components/mobile-warning"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

export default function Home(): React.JSX.Element {
  const isMobile = useMobileDetection()

  // Show mobile warning if user is on a mobile device
  if (isMobile) {
    return <MobileWarning />
  }

  // Show kanban board for desktop users
  return (
    <main className="min-h-screen bg-noise">
      <KanbanBoard />
    </main>
  )
}
