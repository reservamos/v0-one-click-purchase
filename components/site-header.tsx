"use client"

import { Bus, User, ChevronDown, UserCircle, MapPin, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  onOpenProfile?: (tab: "datos" | "pasajeros" | "pagos" | "viajes") => void
}

export function SiteHeader({ onOpenProfile }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bus className="size-6" />
          <span className="text-lg font-bold tracking-tight">Autobuses</span>
          <span className="text-sm font-light opacity-70">Mexico</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">Ryland G.</span>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onOpenProfile?.("datos")}>
              <UserCircle className="size-4" />
              Mis datos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenProfile?.("viajes")}>
              <MapPin className="size-4" />
              Mis viajes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              <LogOut className="size-4" />
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
