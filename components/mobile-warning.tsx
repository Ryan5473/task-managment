"use client";

import React from "react";
import { Monitor, Smartphone } from "lucide-react";

/**
 * Component that displays a warning message for mobile users
 * Encourages users to use the app on a PC instead
 */
export default function MobileWarning(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-noise flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        {/* Icons */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <Smartphone className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl">→</div>
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Monitor className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Hold up there! 📱➡️💻
        </h1>

        {/* Main message */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          You should probably use this day planner on your PC. If you&apos;re thinking about using it on your phone, you&apos;re kind of sus 🤨
        </p>

        {/* Additional context */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This day planner is designed for larger screens with proper keyboard and mouse support to maximize your productivity and task management experience.
          </p>
        </div>

        {/* Suggestion */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Monitor className="w-4 h-4" />
          <span>Head over to your computer for the best experience</span>
        </div>
      </div>
    </div>
  );
} 