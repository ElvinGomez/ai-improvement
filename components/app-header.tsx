"use client"

import { Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-context"
import { LoginButton } from "@/components/login-button"

interface AppHeaderProps {
  title: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
}

export function AppHeader({ title, searchPlaceholder, onSearch }: AppHeaderProps) {
  const { toggle } = useSidebar()

  return (
    <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggle}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {searchPlaceholder && (
            <div className="relative w-full sm:w-80 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                className="pl-9"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
          <LoginButton />
        </div>
      </div>
    </div>
  )
}
