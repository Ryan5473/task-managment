"use client";

import React from "react";
import { Monitor, Smartphone, ArrowRight } from "lucide-react";

/**
 * Component that displays a warning message for mobile users
 * Encourages users to use the app on a PC instead
 */
export default function MobileWarning(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 pb-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl animate-pulse">
              <Smartphone className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground animate-bounce" />
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Monitor className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            Hold up there! 📱➡️💻
          </h1>
        </div>

        {/* Content Section */}
        <div className="p-6 pt-4 space-y-6">
          {/* Main message */}
          <div className="text-center space-y-3">
            <p className="text-lg text-foreground leading-relaxed font-medium">
              You should probably use this day planner on your PC.
            </p>
            <p className="text-base text-muted-foreground">
              If you&apos;re thinking about using it on your phone, you&apos;re kind of sus 🤨
            </p>
          </div>

          {/* Additional context */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              This day planner is designed for larger screens with proper keyboard and mouse support to maximize your productivity and task management experience.
            </p>
          </div>

          {/* Features that require desktop */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground text-center mb-3">
              Why desktop works better:
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Drag & drop task management</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Keyboard shortcuts & efficiency</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Better multi-column layout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/30">
            <Monitor className="w-4 h-4 flex-shrink-0" />
            <span className="text-center">Head over to your computer for the best experience</span>
          </div>
        </div>
      </div>
    </div>
  );
} 