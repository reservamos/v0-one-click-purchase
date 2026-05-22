"use client"

import { useState, useEffect } from "react"
import {
  Zap,
  Clock,
  CreditCard,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Armchair,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { TripData } from "@/components/trip-card"

export interface PassengerData {
  name: string
  document: string
  email: string
  phone: string
}

export interface PaymentData {
  brand: string
  last4: string
  expiry: string
}

interface OneClickModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: TripData | null
  passenger: PassengerData
  payment: PaymentData
  onConfirm: () => void
  onPassengerChange?: (p: PassengerData) => void
  onPaymentChange?: (p: PaymentData) => void
  selectedSeats?: number[]
}

/* ------------------------------------------------------------------ */
/* Inline editable field                                               */
/* ------------------------------------------------------------------ */
function InlineField({
  label,
  value,
  onChange,
  editing,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  editing: boolean
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-0.5 w-full rounded-md border border-input bg-card px-2 py-1 text-sm font-medium text-foreground outline-none ring-ring focus:ring-1"
        />
      ) : (
        <p className="text-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main modal                                                          */
/* ------------------------------------------------------------------ */
export function OneClickModal({
  open,
  onOpenChange,
  trip,
  passenger,
  payment,
  onConfirm,
  onPassengerChange,
  onPaymentChange,
  selectedSeats = [],
}: OneClickModalProps) {
  const [insuranceEnabled, setInsuranceEnabled] = useState(true)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Inline‑editable passenger state
  const [editingPassenger, setEditingPassenger] = useState(false)
  const [localPassenger, setLocalPassenger] = useState<PassengerData>(passenger)

  // Inline‑editable payment state
  const [editingPayment, setEditingPayment] = useState(false)
  const [localPayment, setLocalPayment] = useState<PaymentData>(payment)

  // Keep in sync with props when modal opens
  useEffect(() => {
    if (open) {
      setLocalPassenger(passenger)
      setLocalPayment(payment)
      setEditingPassenger(false)
      setEditingPayment(false)
    }
  }, [open, passenger, payment])

  if (!trip) return null

  const basePrice = trip.price
  const insurancePrice = Math.round(basePrice * 0.05)
  const totalPrice = basePrice + (insuranceEnabled ? insurancePrice : 0)

  const seatDisplay =
    selectedSeats.length > 0
      ? selectedSeats.join(", ")
      : trip.preselectedSeat || "--"

  /* Save passenger inline */
  const handleSavePassenger = () => {
    setEditingPassenger(false)
    onPassengerChange?.(localPassenger)
  }

  /* Save payment inline */
  const handleSavePayment = () => {
    setEditingPayment(false)
    onPaymentChange?.(localPayment)
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsProcessing(false)
    onConfirm()
  }

  const updatePassengerField = (field: keyof PassengerData, value: string) => {
    const updated = { ...localPassenger, [field]: value }
    setLocalPassenger(updated)
    // Auto-save on every keystroke for "live" feel
    onPassengerChange?.(updated)
  }

  const updatePaymentField = (field: keyof PaymentData, value: string) => {
    const updated = { ...localPayment, [field]: value }
    setLocalPayment(updated)
    onPaymentChange?.(updated)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-md">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-2 border-b px-5 py-4">
          <Zap className="size-5 text-accent" />
          <DialogTitle className="text-base font-bold">
            Compra en 1 Clic
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-0 px-5 pb-5">
          {/* Trip Summary Card */}
          <div className="rounded-lg border bg-secondary/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold uppercase">
                Servicio{" "}
                {trip.serviceType === "PLUS"
                  ? "Plus"
                  : trip.serviceType === "EJECUTIVO"
                  ? "Ejecutivo"
                  : "Primera"}
              </Badge>
              <span className="text-sm text-muted-foreground">{trip.date}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {trip.departureTime}
                </p>
                <p className="text-xs text-muted-foreground">{trip.origin}</p>
              </div>

              <div className="flex flex-1 flex-col items-center gap-0.5 px-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {trip.duration}
                </div>
                <div className="relative h-px w-full bg-border">
                  <div className="absolute left-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
                  <div className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {trip.arrivalTime}
                </p>
                <p className="text-xs text-muted-foreground">
                  {trip.destination}
                </p>
              </div>
            </div>

            {/* Seat display */}
            <div className="mt-3 flex items-center gap-1.5 rounded-md bg-card px-3 py-2 text-sm">
              <Armchair className="size-4 text-primary" />
              <span className="text-muted-foreground">
                {selectedSeats.length > 1 ? "Asientos" : "Asiento"}
              </span>
              <span className="font-semibold text-foreground">
                #{seatDisplay}
              </span>
              {selectedSeats.length === 0 && trip.preselectedSeat && (
                <span className="ml-auto text-[10px] text-success">
                  Tu favorito
                </span>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* ──────────────── Passenger Data ──────────────── */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Datos del pasajero
              </h3>
              {editingPassenger ? (
                <button
                  onClick={handleSavePassenger}
                  className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                >
                  <Check className="size-3" />
                  Listo
                </button>
              ) : (
                <button
                  onClick={() => setEditingPassenger(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="size-3" />
                  Editar
                </button>
              )}
            </div>

            <div
              className={cn(
                "rounded-lg border bg-card p-3 transition-all",
                editingPassenger && "ring-1 ring-primary/30"
              )}
            >
              <div className="grid grid-cols-2 gap-3">
                <InlineField
                  label="Nombre"
                  value={localPassenger.name}
                  onChange={(v) => updatePassengerField("name", v)}
                  editing={editingPassenger}
                  placeholder="Nombre completo"
                />
                <InlineField
                  label="Documento"
                  value={localPassenger.document}
                  onChange={(v) => updatePassengerField("document", v)}
                  editing={editingPassenger}
                  placeholder="CC / Pasaporte"
                />
                <InlineField
                  label="Email"
                  value={localPassenger.email}
                  onChange={(v) => updatePassengerField("email", v)}
                  editing={editingPassenger}
                  type="email"
                  placeholder="correo@ejemplo.com"
                />
                <InlineField
                  label="Celular"
                  value={localPassenger.phone}
                  onChange={(v) => updatePassengerField("phone", v)}
                  editing={editingPassenger}
                  type="tel"
                  placeholder="+52 000 000 0000"
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* ──────────────── Payment Method ──────────────── */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Metodo de pago
              </h3>
              {editingPayment ? (
                <button
                  onClick={handleSavePayment}
                  className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                >
                  <Check className="size-3" />
                  Listo
                </button>
              ) : (
                <button
                  onClick={() => setEditingPayment(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="size-3" />
                  Editar
                </button>
              )}
            </div>

            <div
              className={cn(
                "rounded-lg border bg-card p-3 transition-all",
                editingPayment && "ring-1 ring-primary/30"
              )}
            >
              {editingPayment ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InlineField
                      label="Marca"
                      value={localPayment.brand}
                      onChange={(v) => updatePaymentField("brand", v)}
                      editing
                      placeholder="Visa, Mastercard..."
                    />
                    <InlineField
                      label="Ultimos 4 digitos"
                      value={localPayment.last4}
                      onChange={(v) => updatePaymentField("last4", v)}
                      editing
                      placeholder="0000"
                    />
                  </div>
                  <InlineField
                    label="Vencimiento"
                    value={localPayment.expiry}
                    onChange={(v) => updatePaymentField("expiry", v)}
                    editing
                    placeholder="MM/AA"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {localPayment.brand} terminada en {localPayment.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vence {localPayment.expiry}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Insurance Add-on */}
          <div className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div className="flex items-center gap-3">
              <Shield className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Viaja mas seguro
                </p>
                <p className="text-xs text-muted-foreground">
                  Cobertura adicional
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                $ {insurancePrice.toLocaleString()}
              </span>
              <Switch
                checked={insuranceEnabled}
                onCheckedChange={setInsuranceEnabled}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Payment Details Collapsible */}
          <button
            onClick={() => setShowPaymentDetails(!showPaymentDetails)}
            className="mt-3 flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Detalles del pago
            {showPaymentDetails ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>

          {showPaymentDetails && (
            <div className="mt-2 space-y-1.5 rounded-lg bg-secondary/30 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Boleto</span>
                <span className="text-foreground">
                  $ {basePrice.toLocaleString()} {trip.currency}
                </span>
              </div>
              {insuranceEnabled && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seguro adicional</span>
                  <span className="text-foreground">
                    $ {insurancePrice.toLocaleString()} {trip.currency}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-accent">
                  $ {totalPrice.toLocaleString()} {trip.currency}
                </span>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-base font-bold text-foreground">Total</span>
            <span className="text-2xl font-bold text-accent">
              $ {totalPrice.toLocaleString()}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 text-base font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-70"
          >
            {isProcessing ? (
              <div className="size-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
            ) : (
              <>
                <Zap className="size-5" />
                Confirmar compra - $ {totalPrice.toLocaleString()}
              </>
            )}
          </button>

          {/* Footer note */}
          <p className="mt-3 text-center text-[10px] leading-relaxed text-muted-foreground">
            Silla asignada automaticamente. Al confirmar aceptas los{" "}
            <a href="#" className="underline hover:text-foreground">
              terminos y condiciones
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
