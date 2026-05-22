"use client"

import { useState, useMemo } from "react"
import { User, X, Armchair } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TripData } from "@/components/trip-card"

type SeatStatus = "available" | "selected" | "occupied"

interface Seat {
  number: number
  status: SeatStatus
}

interface SeatSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: TripData | null
  onConfirmSeats: (seats: number[]) => void
  initialSelectedSeats?: number[]
}

function generateBusLayout(floor: number): { left: Seat[][]; right: Seat[][] } {
  const occupiedFloor1 = [2, 3, 4, 14, 15, 24, 30, 31, 32]
  const occupiedFloor2 = [2, 3, 4, 14, 27, 28, 29, 30, 31]

  const occupied = floor === 1 ? occupiedFloor1 : occupiedFloor2
  const totalSeats = floor === 1 ? 33 : 32

  const allSeats: Seat[] = Array.from({ length: totalSeats }, (_, i) => ({
    number: i + 1,
    status: occupied.includes(i + 1) ? "occupied" : "available",
  }))

  // Bus layout: 4 columns (2 left, aisle, 2 right), multiple rows
  const seatsPerRow = 4
  const rows = Math.ceil(allSeats.length / seatsPerRow)

  const left: Seat[][] = []
  const right: Seat[][] = []

  for (let r = 0; r < rows; r++) {
    const leftRow: Seat[] = []
    const rightRow: Seat[] = []

    const idx = r * seatsPerRow
    if (allSeats[idx]) leftRow.push(allSeats[idx])
    if (allSeats[idx + 1]) leftRow.push(allSeats[idx + 1])
    if (allSeats[idx + 2]) rightRow.push(allSeats[idx + 2])
    if (allSeats[idx + 3]) rightRow.push(allSeats[idx + 3])

    left.push(leftRow)
    right.push(rightRow)
  }

  return { left, right }
}

function SeatButton({
  seat,
  isSelected,
  onToggle,
}: {
  seat: Seat
  isSelected: boolean
  onToggle: (num: number) => void
}) {
  const isOccupied = seat.status === "occupied"

  return (
    <button
      disabled={isOccupied}
      onClick={() => onToggle(seat.number)}
      className={cn(
        "flex size-11 items-center justify-center rounded-lg border text-sm font-medium transition-all",
        isOccupied &&
          "cursor-not-allowed border-muted bg-muted text-muted-foreground",
        !isOccupied &&
          !isSelected &&
          "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary",
        isSelected &&
          "border-primary bg-primary text-primary-foreground shadow-sm"
      )}
      aria-label={
        isOccupied
          ? `Asiento ${seat.number} ocupado`
          : isSelected
          ? `Asiento ${seat.number} seleccionado`
          : `Seleccionar asiento ${seat.number}`
      }
    >
      {isOccupied ? (
        <User className="size-4" />
      ) : (
        seat.number
      )}
    </button>
  )
}

export function SeatSelector({
  open,
  onOpenChange,
  trip,
  onConfirmSeats,
  initialSelectedSeats = [],
}: SeatSelectorProps) {
  const [selectedFloor, setSelectedFloor] = useState(2)
  const [selectedSeats, setSelectedSeats] = useState<number[]>(initialSelectedSeats)

  const layout = useMemo(() => generateBusLayout(selectedFloor), [selectedFloor])

  const totalAvailable = useMemo(() => {
    const allRows = [...layout.left, ...layout.right]
    return allRows.flat().filter((s) => s.status === "available").length
  }, [layout])

  if (!trip) return null

  const toggleSeat = (num: number) => {
    setSelectedSeats((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    )
  }

  const handleConfirm = () => {
    onConfirmSeats(selectedSeats)
    onOpenChange(false)
  }

  const pricePerSeat = trip.price
  const totalPrice = pricePerSeat * Math.max(selectedSeats.length, 1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-base font-bold">
            Selecciona tu asiento
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {trip.departureTime} - {trip.origin} a {trip.destination}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-5 pb-5 lg:flex-row">
          {/* Bus Layout */}
          <div className="flex-1">
            {/* Floor Tabs */}
            <div className="mb-4 flex">
              <button
                onClick={() => {
                  setSelectedFloor(1)
                  setSelectedSeats([])
                }}
                className={cn(
                  "rounded-l-lg border px-5 py-2 text-sm font-medium transition-colors",
                  selectedFloor === 1
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                Piso 1
              </button>
              <button
                onClick={() => {
                  setSelectedFloor(2)
                  setSelectedSeats([])
                }}
                className={cn(
                  "rounded-r-lg border border-l-0 px-5 py-2 text-sm font-medium transition-colors",
                  selectedFloor === 2
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                Piso 2
              </button>
            </div>

            {/* Legend */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-5 rounded border border-border bg-card" />
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{totalAvailable}</span>{" "}
                  Libres
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-5 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {selectedSeats.length}
                  </span>{" "}
                  Elegidos
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex size-5 items-center justify-center rounded bg-muted">
                  <User className="size-3 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Ocupados
                </span>
              </div>
            </div>

            {/* Bus Grid */}
            <div className="rounded-xl border bg-secondary/20 p-4">
              {/* Driver icon at top-left */}
              <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="flex size-7 items-center justify-center rounded-full border border-border bg-card">
                  <Armchair className="size-3.5" />
                </div>
                <span>Conductor</span>
              </div>

              <div className="flex flex-col gap-2">
                {layout.left.map((leftRow, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-2">
                    {/* Left seats */}
                    <div className="flex gap-2">
                      {leftRow.map((seat) => (
                        <SeatButton
                          key={seat.number}
                          seat={seat}
                          isSelected={selectedSeats.includes(seat.number)}
                          onToggle={toggleSeat}
                        />
                      ))}
                      {/* Pad if less than 2 seats */}
                      {leftRow.length < 2 && <div className="size-11" />}
                    </div>

                    {/* Aisle */}
                    <div className="w-8 shrink-0" />

                    {/* Right seats */}
                    <div className="flex gap-2">
                      {(layout.right[rowIdx] || []).map((seat) => (
                        <SeatButton
                          key={seat.number}
                          seat={seat}
                          isSelected={selectedSeats.includes(seat.number)}
                          onToggle={toggleSeat}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Sidebar */}
          <div className="w-full shrink-0 lg:w-56">
            <div className="sticky top-0 rounded-xl border bg-card p-4">
              <h3 className="text-base font-bold text-foreground">
                Precio aproximado*
              </h3>

              {selectedSeats.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {selectedSeats.map((seatNum) => (
                    <div
                      key={seatNum}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-1.5">
                        <Armchair className="size-3.5 text-primary" />
                        <span className="text-foreground">Asiento {seatNum}</span>
                      </div>
                      <span className="text-muted-foreground">
                        $ {pricePerSeat.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-accent">
                        $ {totalPrice.toLocaleString()} {trip.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Elige al menos 1 asiento
                </p>
              )}

              <Button
                onClick={handleConfirm}
                disabled={selectedSeats.length === 0}
                className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {selectedSeats.length > 0
                  ? `Confirmar ${selectedSeats.length} asiento${selectedSeats.length > 1 ? "s" : ""}`
                  : "Elige al menos 1 asiento"}
              </Button>

              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                *El precio final se calcula al momento de la compra
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
