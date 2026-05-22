"use client"

import { useState, useEffect } from "react"
import {
  User,
  CreditCard,
  MapPin,
  Pencil,
  Check,
  Plus,
  Trash2,
  Download,
  Receipt,
  ChevronRight,
  Bus,
  Clock,
  Users,
  ArrowRightLeft,
  XCircle,
  Tag,
  Wallet,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface UserProfileData {
  name: string
  document: string
  email: string
  phone: string
  category: string
}

export interface SavedCard {
  id: string
  brand: string
  last4: string
  expiry: string
  isDefault: boolean
}

export interface UserTrip {
  id: string
  origin: string
  destination: string
  date: string
  departureTime: string
  arrivalTime: string
  serviceType: string
  seat: string
  price: number
  currency: string
  status: "proximo" | "pasado"
}

export interface FrequentPassenger {
  id: string
  name: string
  lastName: string
  category: string
  phone?: string
  email?: string
}

interface UserProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab?: Tab
  profile: UserProfileData
  onProfileChange: (p: UserProfileData) => void
  cards: SavedCard[]
  onCardsChange: (c: SavedCard[]) => void
  trips: UserTrip[]
  passengers: FrequentPassenger[]
  onPassengersChange: (p: FrequentPassenger[]) => void
}

type Tab = "datos" | "pasajeros" | "pagos" | "viajes" | "monedero"

/* ------------------------------------------------------------------ */
/* Tab button                                                          */
/* ------------------------------------------------------------------ */

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ElementType
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-[11px] font-medium transition-colors whitespace-nowrap",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Inline field                                                        */
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
      <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-sm font-medium text-foreground outline-none ring-ring focus:ring-1"
        />
      ) : (
        <p className="text-sm font-medium text-foreground">{value || "-"}</p>
      )}
    </div>
  )
}

/* ================================================================== */
/* Tab: Mis Datos                                                      */
/* ================================================================== */

function TabDatos({
  profile,
  onProfileChange,
}: {
  profile: UserProfileData
  onProfileChange: (p: UserProfileData) => void
}) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(profile)

  useEffect(() => {
    setLocal(profile)
  }, [profile])

  const update = (field: keyof UserProfileData, value: string) => {
    const updated = { ...local, [field]: value }
    setLocal(updated)
    onProfileChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Informacion personal
        </h3>
        {editing ? (
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
          >
            <Check className="size-3" />
            Guardar
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Pencil className="size-3" />
            Editar
          </button>
        )}
      </div>

      <div
        className={cn(
          "rounded-lg border bg-card p-4 transition-all",
          editing && "ring-1 ring-primary/30"
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <InlineField
              label="Nombre completo"
              value={local.name}
              onChange={(v) => update("name", v)}
              editing={editing}
              placeholder="Tu nombre"
            />
          </div>
          <InlineField
            label="Documento"
            value={local.document}
            onChange={(v) => update("document", v)}
            editing={editing}
            placeholder="CC / Pasaporte"
          />
          <InlineField
            label="Celular"
            value={local.phone}
            onChange={(v) => update("phone", v)}
            editing={editing}
            type="tel"
            placeholder="+52 000 000 0000"
          />
          <div className="col-span-2">
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              Categoria
            </p>
            {editing ? (
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => update("category", cat)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      local.category === cat
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-foreground">{local.category || "-"}</p>
            )}
          </div>
          <div className="col-span-2">
            <InlineField
              label="Correo electronico"
              value={local.email}
              onChange={(v) => update("email", v)}
              editing={editing}
              type="email"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* Tab: Pasajeros frecuentes                                           */
/* ================================================================== */

const CATEGORY_OPTIONS = ["Adulto", "Menor", "Adulto Mayor", "Estudiante"]

function TabPasajeros({
  passengers,
  onPassengersChange,
}: {
  passengers: FrequentPassenger[]
  onPassengersChange: (p: FrequentPassenger[]) => void
}) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formName, setFormName] = useState("")
  const [formLastName, setFormLastName] = useState("")
  const [formCategory, setFormCategory] = useState("Adulto")
  const [formPhone, setFormPhone] = useState("")
  const [formEmail, setFormEmail] = useState("")

  const resetForm = () => {
    setFormName("")
    setFormLastName("")
    setFormCategory("Adulto")
    setFormPhone("")
    setFormEmail("")
  }

  const handleStartEdit = (p: FrequentPassenger) => {
    setEditingId(p.id)
    setFormName(p.name)
    setFormLastName(p.lastName)
    setFormCategory(p.category)
    setFormPhone(p.phone || "")
    setFormEmail(p.email || "")
    setAdding(false)
  }

  const handleSaveNew = () => {
    if (!formName.trim() || !formLastName.trim()) return
    const newP: FrequentPassenger = {
      id: `fp-${Date.now()}`,
      name: formName.trim(),
      lastName: formLastName.trim(),
      category: formCategory,
      phone: formPhone.trim() || undefined,
      email: formEmail.trim() || undefined,
    }
    onPassengersChange([...passengers, newP])
    resetForm()
    setAdding(false)
  }

  const handleSaveEdit = () => {
    if (!editingId || !formName.trim() || !formLastName.trim()) return
    onPassengersChange(
      passengers.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: formName.trim(),
              lastName: formLastName.trim(),
              category: formCategory,
              phone: formPhone.trim() || undefined,
              email: formEmail.trim() || undefined,
            }
          : p
      )
    )
    setEditingId(null)
    resetForm()
  }

  const handleRemove = (id: string) => {
    onPassengersChange(passengers.filter((p) => p.id !== id))
    if (editingId === id) {
      setEditingId(null)
      resetForm()
    }
  }

  const isFormOpen = adding || editingId !== null

  const PassengerForm = ({ onSave, saveLabel }: { onSave: () => void; saveLabel: string }) => (
    <div className="rounded-lg border bg-card p-4 ring-1 ring-primary/30">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            Nombre *
          </p>
          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Nombre"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
          />
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            Apellido *
          </p>
          <input
            value={formLastName}
            onChange={(e) => setFormLastName(e.target.value)}
            placeholder="Apellido"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
          />
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          Categoria *
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFormCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                formCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            Telefono <span className="normal-case">(opcional)</span>
          </p>
          <input
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            placeholder="+52 000 000 0000"
            type="tel"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
          />
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            Correo <span className="normal-case">(opcional)</span>
          </p>
          <input
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            type="email"
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={!formName.trim() || !formLastName.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
        >
          {saveLabel}
        </button>
        <button
          onClick={() => {
            setAdding(false)
            setEditingId(null)
            resetForm()
          }}
          className="rounded-lg px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Pasajeros frecuentes
        </h3>
        {!isFormOpen && (
          <button
            onClick={() => {
              resetForm()
              setAdding(true)
            }}
            className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            <Plus className="size-3" />
            Agregar
          </button>
        )}
      </div>

      {passengers.length === 0 && !adding && (
        <div className="rounded-lg border border-dashed bg-card py-8 text-center">
          <Users className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            No tienes pasajeros frecuentes
          </p>
          <button
            onClick={() => {
              resetForm()
              setAdding(true)
            }}
            className="mt-2 text-xs font-medium text-accent hover:underline"
          >
            Agregar pasajero
          </button>
        </div>
      )}

      <div className="space-y-2">
        {passengers.map((p) =>
          editingId === p.id ? (
            <PassengerForm key={p.id} onSave={handleSaveEdit} saveLabel="Guardar cambios" />
          ) : (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-sm"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <User className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {p.name} {p.lastName}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{p.category}</span>
                  {p.phone && (
                    <span className="text-[10px] text-muted-foreground">{p.phone}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(p)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(p.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {adding && <PassengerForm onSave={handleSaveNew} saveLabel="Agregar pasajero" />}
    </div>
  )
}

/* ================================================================== */
/* Tab: Mis Pagos                                                      */
/* ================================================================== */

function TabPagos({
  cards,
  onCardsChange,
}: {
  cards: SavedCard[]
  onCardsChange: (c: SavedCard[]) => void
}) {
  const [addingCard, setAddingCard] = useState(false)
  const [newBrand, setNewBrand] = useState("")
  const [newLast4, setNewLast4] = useState("")
  const [newExpiry, setNewExpiry] = useState("")

  const handleAddCard = () => {
    if (!newBrand || !newLast4 || !newExpiry) return
    const card: SavedCard = {
      id: `card-${Date.now()}`,
      brand: newBrand,
      last4: newLast4,
      expiry: newExpiry,
      isDefault: cards.length === 0,
    }
    onCardsChange([...cards, card])
    setNewBrand("")
    setNewLast4("")
    setNewExpiry("")
    setAddingCard(false)
  }

  const handleSetDefault = (id: string) => {
    onCardsChange(cards.map((c) => ({ ...c, isDefault: c.id === id })))
  }

  const handleRemove = (id: string) => {
    const remaining = cards.filter((c) => c.id !== id)
    if (remaining.length > 0 && !remaining.some((c) => c.isDefault)) {
      remaining[0].isDefault = true
    }
    onCardsChange(remaining)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Tarjetas guardadas
        </h3>
        {!addingCard && (
          <button
            onClick={() => setAddingCard(true)}
            className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            <Plus className="size-3" />
            Agregar
          </button>
        )}
      </div>

      {cards.length === 0 && !addingCard && (
        <div className="rounded-lg border border-dashed bg-card py-8 text-center">
          <CreditCard className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            No tienes tarjetas guardadas
          </p>
          <button
            onClick={() => setAddingCard(true)}
            className="mt-2 text-xs font-medium text-accent hover:underline"
          >
            Agregar tarjeta
          </button>
        </div>
      )}

      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-card p-3 transition-all",
              card.isDefault && "ring-1 ring-primary/30"
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CreditCard className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  {card.brand} *{card.last4}
                </p>
                {card.isDefault && (
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                    Principal
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Vence {card.expiry}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {!card.isDefault && (
                <button
                  onClick={() => handleSetDefault(card.id)}
                  className="rounded-md px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Predeterminar
                </button>
              )}
              <button
                onClick={() => handleRemove(card.id)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {addingCard && (
        <div className="rounded-lg border bg-card p-4 ring-1 ring-primary/30">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Nueva tarjeta
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Marca
              </p>
              <input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Visa, Mastercard..."
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
              />
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Ultimos 4 digitos
              </p>
              <input
                value={newLast4}
                onChange={(e) => setNewLast4(e.target.value)}
                placeholder="0000"
                maxLength={4}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
              />
            </div>
          </div>
          <div className="mt-3">
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              Vencimiento
            </p>
            <input
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              placeholder="MM/AA"
              maxLength={5}
              className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none ring-ring focus:ring-1"
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleAddCard}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Guardar tarjeta
            </button>
            <button
              onClick={() => setAddingCard(false)}
              className="rounded-lg px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* Tab: Mis Viajes                                                     */
/* ================================================================== */

function TabViajes({ trips }: { trips: UserTrip[] }) {
  const [showPast, setShowPast] = useState(false)

  const upcoming = trips.filter((t) => t.status === "proximo")
  const past = trips.filter((t) => t.status === "pasado")
  const displayed = showPast ? past : upcoming

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {showPast ? "Viajes pasados" : "Proximos viajes"}
        </h3>
        <button
          onClick={() => setShowPast(!showPast)}
          className="flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent/80"
        >
          {showPast ? "Ver proximos" : "Ver pasados"}
          <ChevronRight className="size-3" />
        </button>
      </div>

      {displayed.length === 0 && (
        <div className="rounded-lg border border-dashed bg-card py-8 text-center">
          <Bus className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            {showPast
              ? "No tienes viajes pasados"
              : "No tienes proximos viajes"}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {displayed.map((trip) => (
          <div
            key={trip.id}
            className="rounded-lg border bg-card p-4 transition-all hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[9px] font-semibold uppercase"
                  >
                    {trip.serviceType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {trip.date}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {trip.departureTime}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {trip.origin}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-3" />
                    <div className="h-px w-8 bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {trip.arrivalTime}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {trip.destination}
                    </p>
                  </div>
                </div>

                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Asiento {trip.seat}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  ${trip.price.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {trip.currency}
                </p>
              </div>
            </div>

            {/* Action links for upcoming trips */}
            {trip.status === "proximo" && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3">
                <button className="flex items-center gap-1 text-[11px] font-medium text-accent transition-colors hover:text-accent/80">
                  <Download className="size-3" />
                  Descargar boleto
                </button>
                <button className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Receipt className="size-3" />
                  Detalle de pago
                </button>
                <button className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <ArrowRightLeft className="size-3" />
                  Cambiar
                </button>
                <button className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <XCircle className="size-3" />
                  Cancelar
                </button>
                <button className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Tag className="size-3" />
                  Vender mis boletos
                </button>
              </div>
            )}

            {trip.status === "pasado" && (
              <div className="mt-3 flex items-center gap-4 border-t pt-3">
                <button className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Receipt className="size-3" />
                  Detalle de pago
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== */
/* Tab: Monedero Electronico                                           */
/* ================================================================== */

function TabMonedero() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [linked, setLinked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.")
      return
    }
    setError("")
    setLoading(true)
    // Simulate async login
    setTimeout(() => {
      setLoading(false)
      setLinked(true)
    }, 1200)
  }

  if (linked) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Monedero Electronico
        </h3>
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
            <Wallet className="size-8 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Cuenta vinculada
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="rounded-lg border bg-secondary/30 px-6 py-4 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Saldo disponible
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">$ 0.00</p>
          </div>
          <button
            onClick={() => {
              setLinked(false)
              setEmail("")
              setPassword("")
            }}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Desvincular cuenta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Monedero Electronico
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Vincula tu cuenta de Monedero Electronico para pagar tus boletos con saldo acumulado.
        </p>
      </div>

      <div className="space-y-3">
        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError("") }}
            placeholder="Correo electronico"
            className="w-full rounded-lg border border-input bg-secondary/30 px-4 py-3 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:bg-background focus:ring-1"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError("") }}
            placeholder="Contrasena"
            className="w-full rounded-lg border border-input bg-secondary/30 px-4 py-3 pr-11 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:bg-background focus:ring-1"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {/* Forgot password */}
        <div className="text-right">
          <button className="text-xs text-foreground underline underline-offset-2 hover:opacity-70">
            &iquest;Olvidaste tu contrasena?
          </button>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? (
          <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          "Iniciar sesion"
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">O</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Register */}
      <p className="text-center text-xs text-muted-foreground">
        &iquest;No tienes cuenta?{" "}
        <button className="font-medium text-foreground underline underline-offset-2 hover:opacity-70">
          Registrate
        </button>
      </p>
    </div>
  )
}

/* ================================================================== */
/* Main Modal                                                          */
/* ================================================================== */

export function UserProfileModal({
  open,
  onOpenChange,
  initialTab = "datos",
  profile,
  onProfileChange,
  cards,
  onCardsChange,
  trips,
  passengers,
  onPassengersChange,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-base font-bold">Mi cuenta</DialogTitle>
        </DialogHeader>

        {/* Mini tabs */}
        <div className="flex border-b px-3 overflow-x-auto">
          <TabButton
            active={activeTab === "datos"}
            icon={User}
            label="Mis datos"
            onClick={() => setActiveTab("datos")}
          />
          <TabButton
            active={activeTab === "pasajeros"}
            icon={Users}
            label="Pasajeros"
            onClick={() => setActiveTab("pasajeros")}
          />
          <TabButton
            active={activeTab === "pagos"}
            icon={CreditCard}
            label="Mis pagos"
            onClick={() => setActiveTab("pagos")}
          />
          <TabButton
            active={activeTab === "viajes"}
            icon={MapPin}
            label="Mis viajes"
            onClick={() => setActiveTab("viajes")}
          />
          <TabButton
            active={activeTab === "monedero"}
            icon={Wallet}
            label="Monedero"
            onClick={() => setActiveTab("monedero")}
          />
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-4">
          {activeTab === "datos" && (
            <TabDatos profile={profile} onProfileChange={onProfileChange} />
          )}
          {activeTab === "pasajeros" && (
            <TabPasajeros
              passengers={passengers}
              onPassengersChange={onPassengersChange}
            />
          )}
          {activeTab === "pagos" && (
            <TabPagos cards={cards} onCardsChange={onCardsChange} />
          )}
          {activeTab === "viajes" && <TabViajes trips={trips} />}
          {activeTab === "monedero" && <TabMonedero />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
