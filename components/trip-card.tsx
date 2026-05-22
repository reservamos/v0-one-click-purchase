"use client"

import { Clock, Zap, Armchair, ChevronDown, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TripData {
  id: string
  departureTime: string
  arrivalTime: string
  duration: string
  serviceType: "PLUS" | "EJECUTIVO" | "PRIMERA"
  origin: string
  destination: string
  price: number
  currency: string
  date: string
  seatsAvailable: number
  preselectedSeat: string | null
  isOneClickEligible: boolean
  soldOut?: boolean
}

interface TripCardProps {
  trip: TripData
  onOneClickPurchase: (trip: TripData) => void
  onViewSeats: (trip: TripData) => void
  confirmedSeats?: number[]
}

const serviceColors: Record<string, string> = {
  PLUS: "bg-primary text-primary-foreground",
  EJECUTIVO: "bg-primary/80 text-primary-foreground",
  PRIMERA: "bg-muted text-muted-foreground",
}

export function TripCard({ trip, onOneClickPurchase, onViewSeats, confirmedSeats }: TripCardProps) {
  const hasConfirmedSeats = confirmedSeats && confirmedSeats.length > 0

  if (trip.soldOut) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-dashed border-border/60 bg-card/50 text-card-foreground opacity-50">
        <div className="flex items-center gap-1.5 bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          Sin disponibilidad
        </div>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-muted-foreground">{trip.departureTime}</p>
              <p className="text-xs text-muted-foreground/70">{trip.origin}</p>
            </div>
            <div className="flex flex-1 flex-col items-center gap-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                <Clock className="size-3" />
                {trip.duration}
              </div>
              <div className="relative h-px w-full bg-border/50">
                <div className="absolute left-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/40" />
                <div className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/40" />
              </div>
              <span className="text-[10px] text-muted-foreground/70">Directo</span>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-muted-foreground">{trip.arrivalTime}</p>
              <p className="text-xs text-muted-foreground/70">{trip.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
            <Badge className="bg-muted text-muted-foreground text-[10px] font-semibold uppercase">
              {trip.serviceType === "PLUS" ? "Servicio Plus" : trip.serviceType === "EJECUTIVO" ? "Ejecutivo" : "Primera"}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
              <Armchair className="size-3" />
              Agotado
            </div>
          </div>
          <div className="flex items-center gap-3 border-t pt-3 sm:flex-col sm:items-end sm:gap-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-muted-foreground/60 line-through decoration-1">
                $ {trip.price.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground/50">{trip.currency}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
        trip.isOneClickEligible && "ring-1 ring-accent/20"
      )}
    >
      {!trip.isOneClickEligible && hasConfirmedSeats && (
        <div className="flex items-center gap-1.5 bg-success/5 px-4 py-1.5 text-xs font-medium text-success">
          <Check className="size-3" />
          Asiento{confirmedSeats.length > 1 ? "s" : ""} {confirmedSeats.join(", ")} seleccionado{confirmedSeats.length > 1 ? "s" : ""}
        </div>
      )}
      {trip.isOneClickEligible && (
        <div className="flex items-center gap-1.5 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
          <Zap className="size-3" />
          {hasConfirmedSeats
            ? `Compra en 1 clic -- asiento${confirmedSeats.length > 1 ? "s" : ""} ${confirmedSeats.join(", ")} seleccionado${confirmedSeats.length > 1 ? "s" : ""}`
            : `Compra en 1 clic disponible -- asiento ${trip.preselectedSeat} preseleccionado`}
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Trip Info */}
        <div className="flex flex-1 items-center gap-4">
          {/* Departure */}
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{trip.departureTime}</p>
            <p className="text-xs text-muted-foreground">{trip.origin}</p>
          </div>

          {/* Duration Line */}
          <div className="flex flex-1 flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {trip.duration}
            </div>
            <div className="relative h-px w-full bg-border">
              <div className="absolute left-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
              <div className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground">Directo</span>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{trip.arrivalTime}</p>
            <p className="text-xs text-muted-foreground">{trip.destination}</p>
          </div>
        </div>

        {/* Service & Seats */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <Badge className={cn("text-[10px] font-semibold uppercase", serviceColors[trip.serviceType])}>
            {trip.serviceType === "PLUS" ? "Servicio Plus" : trip.serviceType === "EJECUTIVO" ? "Ejecutivo" : "Primera"}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Armchair className="size-3" />
            {trip.seatsAvailable} disponibles
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center gap-3 border-t pt-3 sm:flex-col sm:items-end sm:gap-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">
              $ {trip.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">{trip.currency}</p>
          </div>

          {trip.isOneClickEligible ? (
            <div className="flex flex-col gap-1.5">
              <Button
                onClick={() => onOneClickPurchase(trip)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 font-semibold"
                size="sm"
              >
                <Zap className="size-3.5" />
                Comprar ahora
              </Button>
              <button
                onClick={() => onViewSeats(trip)}
                className={cn(
                  "flex items-center justify-center gap-1 text-[11px] underline-offset-2 hover:underline",
                  hasConfirmedSeats
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {hasConfirmedSeats
                  ? `Cambiar asiento${confirmedSeats.length > 1 ? "s" : ""}`
                  : "Ver asientos"}
                <ChevronDown className="size-3" />
              </button>
            </div>
          ) : hasConfirmedSeats ? (
            <div className="flex flex-col gap-1.5">
              <Button
                onClick={() => onOneClickPurchase(trip)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 font-semibold"
                size="sm"
              >
                <Zap className="size-3.5" />
                Comprar ahora
              </Button>
              <button
                onClick={() => onViewSeats(trip)}
                className="flex items-center justify-center gap-1 text-[11px] font-medium text-primary underline-offset-2 hover:underline"
              >
                Cambiar asiento{confirmedSeats.length > 1 ? "s" : ""}
                <ChevronDown className="size-3" />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => onViewSeats(trip)}
              variant="outline"
              size="sm"
              className="font-semibold"
            >
              Ver asientos
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
