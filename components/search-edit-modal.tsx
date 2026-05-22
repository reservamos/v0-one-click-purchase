"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Minus, Plus } from "lucide-react"

export interface SearchParams {
  origin: string
  destination: string
  date: string
  passengers: number
  tripType: "ida" | "ida-vuelta"
  returnDate?: string
}

interface SearchEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  params: SearchParams
  onSave: (params: SearchParams) => void
}

const CITIES = [
  "Mexico Norte, CDMX",
  "Aeropuerto Internacional, CDMX",
  "Guadalajara",
  "Monterrey",
  "Queretaro",
  "Puebla",
  "San Luis Potosi",
  "Morelia",
  "Aguascalientes",
  "Leon",
]

export function SearchEditModal({
  open,
  onOpenChange,
  params,
  onSave,
}: SearchEditModalProps) {
  const [local, setLocal] = useState<SearchParams>(params)

  useEffect(() => {
    if (open) setLocal(params)
  }, [open, params])

  const update = <K extends keyof SearchParams>(key: K, val: SearchParams[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }))

  const swapCities = () =>
    setLocal((prev) => ({ ...prev, origin: prev.destination, destination: prev.origin }))

  const handleSave = () => {
    onSave(local)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b bg-primary px-5 py-4">
          <DialogTitle className="text-base font-bold text-primary-foreground">
            Editar busqueda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-5">
          {/* Trip type toggle */}
          <div className="flex rounded-lg border bg-secondary/50 p-0.5">
            <button
              onClick={() => update("tripType", "ida")}
              className={cn(
                "flex-1 rounded-md py-2 text-xs font-semibold transition-all",
                local.tripType === "ida"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Solo ida
            </button>
            <button
              onClick={() => update("tripType", "ida-vuelta")}
              className={cn(
                "flex-1 rounded-md py-2 text-xs font-semibold transition-all",
                local.tripType === "ida-vuelta"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Ida y vuelta
            </button>
          </div>

          {/* Origin / Destination */}
          <div className="relative space-y-2">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                Origen
              </label>
              <select
                value={local.origin}
                onChange={(e) => update("origin", e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapCities}
              className="absolute right-3 top-[38px] z-10 flex size-8 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
              aria-label="Intercambiar origen y destino"
            >
              <ArrowLeftRight className="size-3.5" />
            </button>

            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                Destino
              </label>
              <select
                value={local.destination}
                onChange={(e) => update("destination", e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              >
                {CITIES.filter((c) => c !== local.origin).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date(s) */}
          <div className={cn("grid gap-3", local.tripType === "ida-vuelta" ? "grid-cols-2" : "grid-cols-1")}>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                {local.tripType === "ida-vuelta" ? "Fecha ida" : "Fecha"}
              </label>
              <input
                type="date"
                value={local.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            {local.tripType === "ida-vuelta" && (
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
                  Fecha vuelta
                </label>
                <input
                  type="date"
                  value={local.returnDate || ""}
                  onChange={(e) => update("returnDate", e.target.value)}
                  className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
            )}
          </div>

          {/* Passengers */}
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
              Pasajeros
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update("passengers", Math.max(1, local.passengers - 1))}
                disabled={local.passengers <= 1}
                className="flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-[3ch] text-center text-lg font-bold text-foreground">
                {local.passengers}
              </span>
              <button
                onClick={() => update("passengers", Math.min(6, local.passengers + 1))}
                disabled={local.passengers >= 6}
                className="flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Plus className="size-4" />
              </button>
              <span className="text-xs text-muted-foreground">
                {local.passengers === 1 ? "pasajero" : "pasajeros"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-secondary/30 px-5 py-4">
          <Button
            onClick={handleSave}
            className="w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Buscar viajes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
