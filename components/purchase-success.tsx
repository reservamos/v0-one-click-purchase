"use client"

import { Check, Download, ArrowRight, Armchair, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { TripData } from "@/components/trip-card"

interface PurchaseSuccessProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: TripData | null
  passengerName: string
}

export function PurchaseSuccess({ open, onOpenChange, trip, passengerName }: PurchaseSuccessProps) {
  if (!trip) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-md" showCloseButton={false}>
        {/* Success Header */}
        <div className="flex flex-col items-center gap-3 bg-success/10 px-6 pt-8 pb-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-success">
            <Check className="size-8 text-success-foreground" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Compra confirmada</h2>
          <p className="text-center text-sm text-muted-foreground">
            Tu boleto ha sido generado exitosamente
          </p>
        </div>

        {/* Ticket Info */}
        <div className="flex flex-col gap-4 px-6 pb-6">
          <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Codigo de reserva
              </p>
              <p className="font-mono text-lg font-bold tracking-wider text-primary">
                VE-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
            </div>

            <Separator className="mb-3" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{trip.departureTime}</p>
                <p className="text-xs text-muted-foreground">{trip.origin}</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Clock className="size-3 text-muted-foreground" />
                <ArrowRight className="size-4 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">{trip.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{trip.arrivalTime}</p>
                <p className="text-xs text-muted-foreground">{trip.destination}</p>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <p className="text-muted-foreground">Pasajero</p>
                <p className="mt-0.5 font-medium text-foreground">{passengerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Asiento</p>
                <div className="mt-0.5 flex items-center justify-center gap-1 font-medium text-foreground">
                  <Armchair className="size-3" />
                  #{trip.preselectedSeat}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="mt-0.5 font-medium text-foreground">{trip.date}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => onOpenChange(false)}
            >
              <Download className="size-4" />
              Descargar boleto
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onOpenChange(false)}
            >
              Ver mis viajes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
