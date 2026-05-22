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
  Lock,
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
  type?: "card" | "paypal"
  paypalEmail?: string
}

export interface GuestCardData {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
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
  isLoggedIn?: boolean
  onChangeSeat?: () => void
}

/* ------------------------------------------------------------------ */
/* PayPal icon (simplified brand SVG)                                  */
/* ------------------------------------------------------------------ */
function PayPalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PayPal"
    >
      <path
        d="M19.5 7.5C19.5 10.538 17.21 13 14 13H11.5L10.5 18H7.5L9.5 6H15C17.485 6 19.5 6.672 19.5 7.5Z"
        fill="#009cde"
      />
      <path
        d="M17 4.5C17 7.538 14.71 10 11.5 10H9L8 15H5L7 3H12.5C14.985 3 17 3.672 17 4.5Z"
        fill="#003087"
      />
    </svg>
  )
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
  isLoggedIn = true,
  onChangeSeat,
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
  const [paymentTab, setPaymentTab] = useState<"card" | "paypal">(
    payment.type === "paypal" ? "paypal" : "card"
  )
  const [paypalEmail, setPaypalEmail] = useState(payment.paypalEmail ?? "")

  // Guest card data
  const [guestCard, setGuestCard] = useState<GuestCardData>({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  })

  // Keep in sync with props when modal opens
  useEffect(() => {
    if (open) {
      setLocalPassenger(passenger)
      setLocalPayment(payment)
      setPaymentTab(payment.type === "paypal" ? "paypal" : "card")
      setPaypalEmail(payment.paypalEmail ?? "")
      setEditingPassenger(!isLoggedIn) // guests start in edit mode
      setEditingPayment(false)
      if (!isLoggedIn) {
        setGuestCard({ cardNumber: "", cardHolder: "", expiry: "", cvv: "" })
      }
    }
  }, [open, passenger, payment, isLoggedIn])

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
    const saved: PaymentData =
      paymentTab === "paypal"
        ? { ...localPayment, type: "paypal", paypalEmail }
        : { ...localPayment, type: "card" }
    setLocalPayment(saved)
    onPaymentChange?.(saved)
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
            {isLoggedIn ? "Compra en 1 Clic" : "Compra rapida"}
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
            <button
              type="button"
              onClick={onChangeSeat}
              className={cn(
                "mt-3 flex w-full items-center gap-1.5 rounded-md bg-card px-3 py-2 text-sm transition-colors",
                onChangeSeat && "hover:bg-secondary/60 cursor-pointer"
              )}
            >
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
              {onChangeSeat && (
                <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-accent">
                  <Pencil className="size-3" />
                  Cambiar
                </span>
              )}
            </button>
          </div>

          <Separator className="my-4" />

          {/* ──────────────── Passenger Data ──────────────── */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Datos del pasajero
              </h3>
              {isLoggedIn ? (
                editingPassenger ? (
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
                )
              ) : null}
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
              {isLoggedIn ? (
                editingPayment ? (
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
                )
              ) : null}
            </div>

            {isLoggedIn ? (
              <div
                className={cn(
                  "rounded-lg border bg-card transition-all",
                  editingPayment && "ring-1 ring-primary/30"
                )}
              >
                {editingPayment ? (
                  <div>
                    {/* Payment type tabs */}
                    <div className="flex border-b">
                      <button
                        type="button"
                        onClick={() => setPaymentTab("card")}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors",
                          paymentTab === "card"
                            ? "border-b-2 border-primary text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <CreditCard className="size-3.5" />
                        Tarjeta
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentTab("paypal")}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors",
                          paymentTab === "paypal"
                            ? "border-b-2 border-[#003087] text-[#003087]"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <PayPalIcon className="size-3.5" />
                        PayPal
                      </button>
                    </div>

                    <div className="space-y-3 p-3">
                      {paymentTab === "card" ? (
                        <>
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
                        </>
                      ) : (
                        <div>
                          <p className="mb-1 text-[10px] uppercase text-muted-foreground">
                            Correo de PayPal
                          </p>
                          <div className="relative">
                            <input
                              type="email"
                              value={paypalEmail}
                              onChange={(e) => setPaypalEmail(e.target.value)}
                              placeholder="tu@email.com"
                              className="w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground/50 focus:ring-1"
                            />
                            <PayPalIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#003087]" />
                          </div>
                          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Lock className="size-3 shrink-0" />
                            Seras redirigido a PayPal para autorizar el pago de forma segura.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3">
                    {localPayment.type === "paypal" ? (
                      <>
                        <div className="flex size-10 items-center justify-center rounded-md bg-[#003087] text-white">
                          <PayPalIcon className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">PayPal</p>
                          <p className="text-xs text-muted-foreground">
                            {localPayment.paypalEmail ?? "Cuenta vinculada"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Guest card form */
              <div className="space-y-3 rounded-lg border bg-card p-3">
                {/* Card number */}
                <div>
                  <p className="mb-1 text-[10px] uppercase text-muted-foreground">Numero de tarjeta</p>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      value={guestCard.cardNumber}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 16)
                        const formatted = raw.replace(/(.{4})/g, "$1 ").trim()
                        setGuestCard((prev) => ({ ...prev, cardNumber: formatted }))
                      }}
                      placeholder="0000 0000 0000 0000"
                      className="w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm font-medium tracking-wider text-foreground outline-none ring-ring placeholder:text-muted-foreground/50 focus:ring-1"
                    />
                    <CreditCard className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Cardholder */}
                <div>
                  <p className="mb-1 text-[10px] uppercase text-muted-foreground">Nombre en la tarjeta</p>
                  <input
                    type="text"
                    value={guestCard.cardHolder}
                    onChange={(e) => setGuestCard((prev) => ({ ...prev, cardHolder: e.target.value.toUpperCase() }))}
                    placeholder="NOMBRE APELLIDO"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium uppercase tracking-wide text-foreground outline-none ring-ring placeholder:normal-case placeholder:text-muted-foreground/50 focus:ring-1"
                  />
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-[10px] uppercase text-muted-foreground">Vencimiento</p>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={guestCard.expiry}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 4)
                        const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw
                        setGuestCard((prev) => ({ ...prev, expiry: formatted }))
                      }}
                      placeholder="MM/AA"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium tracking-wider text-foreground outline-none ring-ring placeholder:text-muted-foreground/50 focus:ring-1"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase text-muted-foreground">CVV</p>
                    <div className="relative">
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={guestCard.cvv}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 4)
                          setGuestCard((prev) => ({ ...prev, cvv: raw }))
                        }}
                        placeholder="***"
                        className="w-full rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm font-medium text-foreground outline-none ring-ring placeholder:text-muted-foreground/50 focus:ring-1"
                      />
                      <Lock className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Security note */}
                <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Lock className="size-3 shrink-0" />
                  Tus datos estan protegidos con cifrado SSL de 256 bits.
                </p>
              </div>
            )}
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
                {isLoggedIn ? <Zap className="size-5" /> : <CreditCard className="size-5" />}
                {isLoggedIn ? "Confirmar compra" : "Pagar"} - $ {totalPrice.toLocaleString()}
              </>
            )}
          </button>

          {/* Footer note */}
          <p className="mt-3 text-center text-[10px] leading-relaxed text-muted-foreground">
            {isLoggedIn
              ? "Silla asignada automaticamente. "
              : ""}
            Al confirmar aceptas los{" "}
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
