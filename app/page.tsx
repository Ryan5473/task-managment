"use client";

import { Suspense } from "react"
import { Calendar } from "lucide-react"
import KanbanBoard from "@/components/kanban-board"
import MobileWarning from "@/components/mobile-warning"
import Footer from "@/components/footer"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

// Loading component for better UX
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <Calendar className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Loading FlowMate</h2>
          <p className="text-sm text-muted-foreground">Preparing your workspace...</p>
        </div>
      </div>
    </div>
  )
}

export default function Home(): React.JSX.Element {
  const isMobile = useMobileDetection()

  // Show mobile warning if user is on a mobile device
  if (isMobile) {
    return (
      <>
        <MobileWarning />
        <Footer />
        <noscript>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">JavaScript Required</h1>
              <p className="text-muted-foreground">
                FlowMate requires JavaScript to function properly. Please enable JavaScript in your browser.
              </p>
            </div>
          </div>
        </noscript>
      </>
    )
  }

  // Show kanban board for desktop users
  return (
    <>
      <main className="min-h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <KanbanBoard />
        </Suspense>
      </main>
      
      <Footer />
      
      {/* Accessibility improvements */}
      <div className="sr-only">
        <h1>FlowMate - Kanban Board Application</h1>
        <p>A modern task management application with drag and drop functionality</p>
      </div>
      
      {/* NoScript fallback */}
      <noscript>
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-4">
            <Calendar className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-2xl font-bold text-foreground">JavaScript Required</h1>
            <p className="text-muted-foreground">
              FlowMate is a dynamic application that requires JavaScript to function properly. 
              Please enable JavaScript in your browser to use all features.
            </p>
          </div>
        </div>
      </noscript>
    </>
  )
}
