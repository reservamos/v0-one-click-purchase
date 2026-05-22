"use client"

import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface DateOption {
  label: string
  dayOfWeek: string
  tripCount: number
  minPrice: number
  dateKey: string
}

interface DateSelectorProps {
  dates: DateOption[]
  selectedDate: string
  onSelectDate: (dateKey: string) => void
}

export function DateSelector({ dates, selectedDate, onSelectDate }: DateSelectorProps) {
  const cheapestPrice = useMemo(
    () => Math.min(...dates.map((d) => d.minPrice)),
    [dates]
  )

  // Threshold: highlight dates within 10% of the cheapest
  const cheapThreshold = cheapestPrice * 1.1

  return (
    <div className="flex items-stretch gap-0 overflow-x-auto border-b border-border bg-card">
      {dates.map((d) => {
        const isSelected = d.dateKey === selectedDate
        const isCheap = d.minPrice <= cheapThreshold

        return (
          <button
            key={d.dateKey}
            onClick={() => onSelectDate(d.dateKey)}
            className={cn(
              "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 px-3 py-2.5 text-center transition-colors",
              "hover:bg-muted/60",
              isSelected && "bg-primary/5"
            )}
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-wide",
                isSelected ? "font-semibold text-primary" : "text-muted-foreground"
              )}
            >
              {d.dayOfWeek}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                isSelected ? "text-primary" : "text-foreground"
              )}
            >
              {d.label}
            </span>
            <span
              className={cn(
                "text-[10px] leading-tight",
                isSelected
                  ? "text-primary/80"
                  : isCheap
                    ? "font-semibold text-success"
                    : "text-muted-foreground"
              )}
            >
              {d.tripCount > 0 ? (
                <>
                  {d.tripCount} viajes &middot;{" "}
                  <span className={cn(isCheap && !isSelected && "font-bold")}>
                    ${d.minPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                "Sin viajes"
              )}
            </span>
            {isSelected && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}
