/**
 * Premium Footer component with stunning visual design
 * Features gradient backgrounds, animations, and modern styling
 * Includes links to creator's X profile and GitHub repository
 */

import { Heart, Github, ExternalLink, Sparkles } from "lucide-react"
import Image from "next/image"

interface FooterProps {
  className?: string
}

/**
 * Enhanced footer component with premium styling and animations
 * @param className - Optional additional CSS classes
 * @returns JSX element containing beautifully styled footer content
 */
export default function Footer({ className = "" }: FooterProps): React.JSX.Element {
  return (
    <footer className={`relative overflow-hidden ${className}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 dark:from-violet-600/20 dark:via-purple-600/10 dark:to-fuchsia-600/20"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-1/3 w-1 h-1 bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="relative bg-background/80 backdrop-blur-sm border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-6">
            
            {/* Decorative icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-full">
                {/* <Sparkles className="h-5 w-5 text-white animate-spin" style={{ animationDuration: "3s" }} /> */}
                <Image src="/logo.png" alt="FlowMate" width={20} height={20} className="rounded-full h-5 w-5 object-cover animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-center lg:text-left">
              
              {/* Made with love section */}
              <div className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200/50 dark:border-rose-800/30 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5">
                <span className="text-sm font-medium text-foreground">Made with</span>
                <Heart className="h-4 w-4 text-rose-500 fill-current animate-pulse group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-foreground">by</span>
                <a
                  href="https://x.com/cwd_harshit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 group-hover:scale-105"
                  aria-label="Visit Harshit's X profile"
                >
                  Harshit
                  <ExternalLink className="h-3 w-3 text-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </a>
              </div>

              {/* Elegant separator */}
              <div className="hidden lg:block w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent"></div>

              {/* Open source section */}
              <div className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border border-slate-200/50 dark:border-slate-800/30 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 hover:-translate-y-0.5">
                <Github className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium text-foreground">Open source on</span>
                <a
                  href="https://github.com/c-w-d-harshit/flow-mate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 hover:from-slate-800 hover:to-gray-800 dark:hover:from-slate-200 dark:hover:to-gray-200 transition-all duration-300 group-hover:scale-105"
                  aria-label="View source code on GitHub"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </a>
              </div>
            </div>

            {/* Bottom tagline */}
            <div className="text-center pt-4 border-t border-border/30 w-full max-w-md">
              <p className="text-xs text-muted-foreground/70 font-medium tracking-wide">
                Built with passion • Designed for productivity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
    </footer>
  )
} 