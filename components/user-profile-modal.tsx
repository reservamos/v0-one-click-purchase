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
  Gift,
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

type Tab = "datos" | "pasajeros" | "pagos" | "viajes" | "monedero" | "doters"

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
/* Tab: Doters – programa de lealtad                                  */
/* ================================================================== */

/* Doters green dot + wordmark */
function DotersLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <svg viewBox="0 0 18 18" fill="none" className="size-5 shrink-0" aria-hidden="true">
        <circle cx="9" cy="9" r="9" fill="#3CC13B" />
        <circle cx="9" cy="9" r="4" fill="white" />
      </svg>
      <span className="text-base font-bold tracking-tight text-foreground">doters</span>
    </div>
  )
}

type DotersState = "login" | "linked"

function TabDoters() {
  const [state, setState] = useState<DotersState>("login")
  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [linkedName] = useState("Ryland G.")
  const [points] = useState(3_240)
  const [tier] = useState("Silver")

  const handleEmailNext = () => {
    if (!email.trim()) return
    setStep("password")
  }

  const handleLogin = () => {
    if (!password.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setState("linked")
    }, 1200)
  }

  const handleUnlink = () => {
    setState("login")
    setStep("email")
    setEmail("")
    setPassword("")
  }

  /* ── Linked state ── */
  if (state === "linked") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <DotersLogo />
          <button
            onClick={handleUnlink}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            Desvincular
          </button>
        </div>

        {/* Points card */}
        <div className="relative overflow-hidden rounded-xl bg-[#1a2e1a] px-5 py-5 text-white">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-[#3CC13B]/20" />
          <div className="pointer-events-none absolute -bottom-4 right-8 size-16 rounded-full bg-[#3CC13B]/10" />

          <div className="flex items-center gap-2 opacity-80">
            <svg viewBox="0 0 18 18" fill="none" className="size-4 shrink-0">
              <circle cx="9" cy="9" r="9" fill="#3CC13B" />
              <circle cx="9" cy="9" r="4" fill="white" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wide">doters</span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">
            {points.toLocaleString()} <span className="text-lg font-normal opacity-70">pts</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-[#3CC13B]/30 px-2 py-0.5 text-[10px] font-semibold text-[#3CC13B]">
              {tier}
            </span>
            <span className="text-xs opacity-60">{email || "cuenta vinculada"}</span>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Estado</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-success">
              <span className="inline-block size-1.5 rounded-full bg-success" />
              Vinculado
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Nivel</span>
            <span className="text-sm font-semibold text-foreground">{tier}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Puntos acumulados</span>
            <span className="text-sm font-semibold text-foreground">
              {points.toLocaleString()} pts
            </span>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Acumula puntos en cada viaje y canjealos por descuentos en tus proximas compras.
        </p>
      </div>
    )
  }

  /* ── Login state ── */
  return (
    <div className="flex flex-col">
      {/* Branded header */}
      <div className="mb-6 flex flex-col items-center gap-1 text-center">
        <DotersLogo className="mb-2 scale-125" />
        <h3 className="mt-1 text-xl font-bold text-foreground">Bienvenido</h3>
        <p className="text-sm text-muted-foreground">
          {step === "email"
            ? "Inicia sesion para continuar"
            : <>¡Hola! <span className="font-semibold text-[#3CC13B]">{email.split("@")[0]}</span></>}
        </p>
      </div>

      <div className="space-y-4">
        {step === "email" ? (
          /* Email step */
          <>
            <div>
              <p className="mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Correo electronico
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailNext()}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none ring-ring transition-colors placeholder:text-muted-foreground/50 focus:bg-background focus:ring-1"
              />
            </div>
            <button
              onClick={handleEmailNext}
              disabled={!email.trim()}
              className="flex w-full items-center justify-center rounded-xl bg-[#1a2e1a] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1a2e1a]/90 active:scale-[0.98] disabled:opacity-40"
            >
              Continuar
            </button>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">O</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <button className="font-medium text-[#3CC13B] underline underline-offset-2 transition-colors hover:text-[#3CC13B]/80">
                Crear cuenta
              </button>
            </p>
          </>
        ) : (
          /* Password step */
          <>
            {/* Password field */}
            <div>
              <p className="mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Contrasena
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Ingresa tu contrasena"
                  className="w-full rounded-xl border border-input bg-secondary/40 py-3 pl-4 pr-11 text-sm text-foreground outline-none ring-ring transition-colors placeholder:text-muted-foreground/50 focus:bg-background focus:ring-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember me + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-3.5 rounded border-input accent-[#3CC13B]"
                />
                Recuerdame
              </label>
              <button className="text-xs font-medium text-[#3CC13B] underline underline-offset-2 transition-colors hover:text-[#3CC13B]/80">
                Olvide mi contrasena
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={handleLogin}
              disabled={isLoading || !password.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2e1a] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1a2e1a]/90 active:scale-[0.98] disabled:opacity-40"
            >
              {isLoading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Iniciar sesion"
              )}
            </button>

            {/* Footer links */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setStep("email"); setPassword("") }}
                className="text-xs font-medium text-[#3CC13B] underline underline-offset-2 transition-colors hover:text-[#3CC13B]/80"
              >
                Iniciar con otra cuenta
              </button>
              <button className="flex items-center gap-1 text-xs font-medium text-[#3CC13B] underline underline-offset-2 transition-colors hover:text-[#3CC13B]/80">
                Crear cuenta
                <ChevronRight className="size-3" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Powered by doters footer */}
      <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-secondary/50 py-3">
        <span className="text-xs text-muted-foreground">Powered by</span>
        <DotersLogo />
      </div>
    </div>
  )
}

/* ================================================================== */
/* Tab: Monedero Electronico                                          */
/* ================================================================== */

type MonederoState = "login" | "linked"

function TabMonedero() {
  const [state, setState] = useState<MonederoState>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [linkedEmail, setLinkedEmail] = useState("")
  const [balance] = useState(120.5)

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return
    setIsLoading(true)
    // Simulate async login
    setTimeout(() => {
      setIsLoading(false)
      setLinkedEmail(email.trim())
      setState("linked")
    }, 1200)
  }

  const handleUnlink = () => {
    setState("login")
    setEmail("")
    setPassword("")
    setLinkedEmail("")
  }

  if (state === "linked") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Monedero Electronico
          </h3>
          <button
            onClick={handleUnlink}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            Desvincular
          </button>
        </div>

        {/* Balance card */}
        <div className="rounded-xl bg-primary px-5 py-5 text-primary-foreground">
          <div className="flex items-center gap-2 opacity-80">
            <Wallet className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Saldo disponible
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            S/ {balance.toFixed(2)}
          </p>
          <p className="mt-1 text-xs opacity-70 truncate">{linkedEmail}</p>
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Estado</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-success">
              <span className="size-1.5 rounded-full bg-success inline-block" />
              Vinculado
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Cuenta</span>
            <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
              {linkedEmail}
            </span>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Tu saldo del monedero se aplicara automaticamente como metodo de pago en tu proxima compra.
        </p>
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
          Ingresa a tu cuenta para ver tu saldo y usarlo como metodo de pago.
        </p>
      </div>

      {/* Email */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          Correo electronico
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="w-full rounded-lg border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none ring-ring transition-colors placeholder:text-muted-foreground/50 focus:bg-background focus:ring-1"
        />
      </div>

      {/* Password */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          Contrasena
        </p>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-secondary/40 py-3 pl-4 pr-11 text-sm text-foreground outline-none ring-ring transition-colors placeholder:text-muted-foreground/50 focus:bg-background focus:ring-1"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="text-right">
        <button className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground">
          ¿Olvidaste tu contrasena?
        </button>
      </div>

      {/* CTA */}
      <button
        onClick={handleLogin}
        disabled={isLoading || !email.trim() || !password.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
      >
        {isLoading ? (
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
        ¿No tienes cuenta?{" "}
        <button className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80">
          Registrate
        </button>
      </p>
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
          <TabButton
            active={activeTab === "doters"}
            icon={Gift}
            label="Doters"
            onClick={() => setActiveTab("doters")}
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
          {activeTab === "doters" && <TabDoters />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
