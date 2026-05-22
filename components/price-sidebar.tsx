"use client"

import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ServiceFilter = "PLUS" | "EJECUTIVO" | "PRIMERA"
export type TimeFilter = "manana" | "tarde" | "noche"
export type SortOption = "precio" | "horario"

interface PriceSidebarProps {
  resultCount: number
  activeServices: ServiceFilter[]
  activeTimeSlots: TimeFilter[]
  sortBy: SortOption
  onToggleService: (service: ServiceFilter) => void
  onToggleTimeSlot: (slot: TimeFilter) => void
  onSort: (sort: SortOption) => void
  onClear: () => void
}

const serviceOptions: { key: ServiceFilter; label: string }[] = [
  { key: "PLUS", label: "Plus" },
  { key: "EJECUTIVO", label: "Ejecutivo" },
  { key: "PRIMERA", label: "Primera" },
]

const timeOptions: { key: TimeFilter; label: string }[] = [
  { key: "manana", label: "Manana" },
  { key: "tarde", label: "Tarde" },
  { key: "noche", label: "Noche" },
]

const sortOptions: { key: SortOption; label: string }[] = [
  { key: "precio", label: "Precio" },
  { key: "horario", label: "Horario" },
]

export function PriceSidebar({
  resultCount,
  activeServices,
  activeTimeSlots,
  sortBy,
  onToggleService,
  onToggleTimeSlot,
  onSort,
  onClear,
}: PriceSidebarProps) {
  const hasActiveFilters = activeServices.length > 0 || activeTimeSlots.length > 0

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Filters */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Filter className="size-4" />
              Filtros
            </h3>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="text-xs text-accent hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                Tipo de servicio
              </p>
              <div className="flex flex-wrap gap-1.5">
                {serviceOptions.map((opt) => {
                  const isActive = activeServices.includes(opt.key)
                  return (
                    <Badge
                      key={opt.key}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer text-xs transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-secondary"
                      )}
                      onClick={() => onToggleService(opt.key)}
                    >
                      {opt.label}
                    </Badge>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
                Horario
              </p>
              <div className="flex flex-wrap gap-1.5">
                {timeOptions.map((opt) => {
                  const isActive = activeTimeSlots.includes(opt.key)
                  return (
                    <Badge
                      key={opt.key}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer text-xs transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-secondary"
                      )}
                      onClick={() => onToggleTimeSlot(opt.key)}
                    >
                      {opt.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sort + Count */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{resultCount}</span>{" "}
            resultado{resultCount !== 1 ? "s" : ""}
          </p>

          <div className="mt-3">
            <p className="mb-1.5 text-xs font-medium uppercase text-muted-foreground">
              Ordenar por
            </p>
            <div className="flex gap-1.5">
              {sortOptions.map((opt) => {
                const isActive = sortBy === opt.key
                return (
                  <Badge
                    key={opt.key}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-xs transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary"
                    )}
                    onClick={() => onSort(opt.key)}
                  >
                    {opt.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
