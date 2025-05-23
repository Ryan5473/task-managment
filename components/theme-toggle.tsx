"use client"

import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Light mode",
    },
    {
      value: "dark", 
      label: "Dark",
      icon: Moon,
      description: "Dark mode",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:ring-2 focus:ring-primary/50"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themeOptions.map((option) => {
          const Icon = option.icon
          const isActive = theme === option.value
          
          return (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="flex items-center gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
              aria-label={option.description}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{option.label}</span>
              {isActive && (
                <Check className="h-4 w-4 text-primary" aria-label="Currently selected" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
