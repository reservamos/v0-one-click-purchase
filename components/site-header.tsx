"use client"

import { User, ChevronDown, UserCircle, MapPin, LogOut, LogIn } from "lucide-react"
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
  isLoggedIn?: boolean
  onLogin?: () => void
  onLogout?: () => void
}

export function SiteHeader({ onOpenProfile, isLoggedIn = true, onLogin, onLogout }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Cruz del Sur logo */}
        <div className="flex items-center gap-2">
          {/* Stars cluster */}
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
              {/* Big star top-right */}
              <path d="M22 5 L23.2 8.6 L27 8.6 L24 10.8 L25.2 14.4 L22 12.2 L18.8 14.4 L20 10.8 L17 8.6 L20.8 8.6 Z" fill="#E8C547" />
              {/* Small star top-left */}
              <path d="M8 4 L8.7 6 L10.8 6 L9.1 7.2 L9.8 9.2 L8 8 L6.2 9.2 L6.9 7.2 L5.2 6 L7.3 6 Z" fill="#E8C547" />
              {/* Small star bottom-left */}
              <path d="M5 17 L5.6 18.7 L7.5 18.7 L6 19.8 L6.6 21.5 L5 20.4 L3.4 21.5 L4 19.8 L2.5 18.7 L4.4 18.7 Z" fill="#E8C547" />
              {/* Tiny star middle-left */}
              <path d="M10 12 L10.4 13.2 L11.6 13.2 L10.7 13.9 L11.1 15.1 L10 14.4 L8.9 15.1 L9.3 13.9 L8.4 13.2 L9.6 13.2 Z" fill="#E8C547" />
              {/* Cross sparkle */}
              <path d="M16 2 L16.5 4 L18.5 4.5 L16.5 5 L16 7 L15.5 5 L13.5 4.5 L15.5 4 Z" fill="#E8C547" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-brand-gold">
            Cruz del Sur
          </span>
        </div>

        {isLoggedIn ? (
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
              <DropdownMenuItem className="text-muted-foreground" onClick={onLogout}>
                <LogOut className="size-4" />
                Cerrar sesion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            onClick={onLogin}
          >
            <LogIn className="size-4" />
            <span>Iniciar sesion</span>
          </Button>
        )}
      </div>
    </header>
  )
}
