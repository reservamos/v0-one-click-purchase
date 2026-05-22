"use client"

import { ArrowRight, Calendar, Users, Pencil } from "lucide-react"

interface RouteHeaderProps {
  origin: string
  destination: string
  date: string
  passengers: number
  onEditSearch?: () => void
}

export function RouteHeader({ origin, destination, date, passengers, onEditSearch }: RouteHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground pb-6 pt-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold sm:text-2xl">{origin}</h1>
            <ArrowRight className="size-5 opacity-60" />
            <h1 className="text-xl font-bold sm:text-2xl">{destination}</h1>
          </div>
          <button
            onClick={onEditSearch}
            className="group flex items-center gap-4 rounded-lg border border-primary-foreground/15 px-3 py-1.5 text-sm opacity-80 transition-all hover:border-primary-foreground/30 hover:opacity-100"
          >
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>{passengers} pasajero{passengers > 1 ? "s" : ""}</span>
            </div>
            <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-70" />
          </button>
        </div>
      </div>
    </div>
  )
}
