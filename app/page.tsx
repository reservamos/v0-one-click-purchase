"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { SiteHeader } from "@/components/site-header"
import { RouteHeader } from "@/components/route-header"
import { DateSelector } from "@/components/date-selector"
import { TripCard, type TripData } from "@/components/trip-card"
import { OneClickModal, type PassengerData, type PaymentData } from "@/components/one-click-modal"
import { PurchaseSuccess } from "@/components/purchase-success"
import {
  PriceSidebar,
  type ServiceFilter,
  type TimeFilter,
  type SortOption,
} from "@/components/price-sidebar"
import { SeatSelector } from "@/components/seat-selector"
import {
  UserProfileModal,
  type UserProfileData,
  type SavedCard,
  type UserTrip,
  type FrequentPassenger,
} from "@/components/user-profile-modal"
import { SearchEditModal, type SearchParams } from "@/components/search-edit-modal"
import { Zap, Info, Loader2 } from "lucide-react"

const DATE_OPTIONS = [
  { dateKey: "10-feb", label: "10 Feb", dayOfWeek: "Mar", tripCount: 3, minPrice: 480 },
  { dateKey: "11-feb", label: "11 Feb", dayOfWeek: "Mie", tripCount: 5, minPrice: 450 },
  { dateKey: "12-feb", label: "12 Feb", dayOfWeek: "Jue", tripCount: 4, minPrice: 520 },
  { dateKey: "13-feb", label: "13 Feb", dayOfWeek: "Vie", tripCount: 5, minPrice: 350 },
  { dateKey: "14-feb", label: "14 Feb", dayOfWeek: "Sab", tripCount: 6, minPrice: 280 },
  { dateKey: "15-feb", label: "15 Feb", dayOfWeek: "Dom", tripCount: 4, minPrice: 310 },
  { dateKey: "16-feb", label: "16 Feb", dayOfWeek: "Lun", tripCount: 7, minPrice: 260 },
]

// ── Trip data per date, coherent with DATE_OPTIONS metadata ──────────────

const SERVICE_TYPES: TripData["serviceType"][] = ["PLUS", "EJECUTIVO", "PRIMERA"]

function generateTripsForDate(dateKey: string): TripData[] {
  const dateOption = DATE_OPTIONS.find((d) => d.dateKey === dateKey)
  if (!dateOption) return []

  const { tripCount, minPrice, label } = dateOption
  const dateFull = `${label} 2026`

  // Departure hours spread throughout the day
  const departurePool = [
    { time: "02:00 AM", slot: "noche" },
    { time: "05:30 AM", slot: "manana" },
    { time: "06:20 AM", slot: "manana" },
    { time: "08:00 AM", slot: "manana" },
    { time: "10:00 AM", slot: "manana" },
    { time: "12:30 PM", slot: "tarde" },
    { time: "02:00 PM", slot: "tarde" },
    { time: "04:30 PM", slot: "tarde" },
    { time: "06:00 PM", slot: "noche" },
    { time: "08:00 PM", slot: "noche" },
    { time: "10:30 PM", slot: "noche" },
  ]

  const arrivalOffsets: Record<string, string> = {
    "02:00 AM": "06:00 AM",
    "05:30 AM": "09:30 AM",
    "06:20 AM": "10:20 AM",
    "08:00 AM": "12:00 PM",
    "10:00 AM": "02:00 PM",
    "12:30 PM": "04:30 PM",
    "02:00 PM": "06:00 PM",
    "04:30 PM": "08:30 PM",
    "06:00 PM": "10:00 PM",
    "08:00 PM": "12:00 AM",
    "10:30 PM": "02:30 AM",
  }

  // Seed based on dateKey for consistency across renders
  let seed = 0
  for (let i = 0; i < dateKey.length; i++) seed += dateKey.charCodeAt(i)
  const pseudoRandom = (i: number) => ((seed * 31 + i * 17) % 100) / 100

  // Pick departures deterministically for available trips
  const allDepartures = departurePool
    .map((d, i) => ({ ...d, sortVal: pseudoRandom(i) }))
    .sort((a, b) => a.sortVal - b.sortVal)

  // Available trips
  const selectedDepartures = allDepartures
    .slice(0, tripCount)
    .sort((a, b) => {
      const order = departurePool.map((d) => d.time)
      return order.indexOf(a.time) - order.indexOf(b.time)
    })

  const availableTrips: TripData[] = selectedDepartures.map((dep, i) => {
    const priceVariation = [0, 30, 70, 100, 150, 180, 50][i % 7]
    const price = minPrice + priceVariation
    const service = SERVICE_TYPES[i % 3]
    const isOneClick = pseudoRandom(i + 50) > 0.5 && service !== "PRIMERA"
    const seatNums = [38, 15, 22, 8, 12, 5, 27]
    const availableSeats = Math.round(5 + pseudoRandom(i + 30) * 25)

    return {
      id: `${dateKey}-${i}`,
      departureTime: dep.time,
      arrivalTime: arrivalOffsets[dep.time] || "07:00 PM",
      duration: "4h 00m",
      serviceType: service,
      origin: "Lima",
      destination: "Ica",
      price,
      currency: "PEN",
      date: dateFull,
      seatsAvailable: availableSeats,
      preselectedSeat: isOneClick ? String(seatNums[i % seatNums.length]) : null,
      isOneClickEligible: isOneClick,
      soldOut: false,
    }
  })

  // Generate 1-2 sold-out trips from the remaining pool
  const soldOutCount = pseudoRandom(99) > 0.4 ? 2 : 1
  const remainingDepartures = allDepartures
    .slice(tripCount, tripCount + soldOutCount)
    .sort((a, b) => {
      const order = departurePool.map((d) => d.time)
      return order.indexOf(a.time) - order.indexOf(b.time)
    })

  const soldOutTrips: TripData[] = remainingDepartures.map((dep, i) => {
    const priceVariation = [20, 60, 90][i % 3]
    const price = minPrice + priceVariation
    const service = SERVICE_TYPES[(i + 1) % 3]

    return {
      id: `${dateKey}-sold-${i}`,
      departureTime: dep.time,
      arrivalTime: arrivalOffsets[dep.time] || "07:00 PM",
      duration: "4h 00m",
      serviceType: service,
      origin: "Lima",
      destination: "Ica",
      price,
      currency: "PEN",
      date: dateFull,
      seatsAvailable: 0,
      preselectedSeat: null,
      isOneClickEligible: false,
      soldOut: true,
    }
  })

  return [...availableTrips, ...soldOutTrips]
}

// Pre-generate all dates
const ALL_TRIPS: Record<string, TripData[]> = {}
for (const d of DATE_OPTIONS) {
  ALL_TRIPS[d.dateKey] = generateTripsForDate(d.dateKey)
}

// ── Utility functions ────────────────────────────────────────────────────

function timeToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return 0
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === "AM" && hours === 12) hours = 0
  if (period === "PM" && hours !== 12) hours += 12
  return hours * 60 + minutes
}

function getTimeSlot(departureTime: string): TimeFilter {
  const mins = timeToMinutes(departureTime)
  if (mins < 720) return "manana"
  if (mins < 1080) return "tarde"
  return "noche"
}

// ── Page Component ───────────────────────────────────────────────────────

export default function Page() {
  const [selectedDate, setSelectedDate] = useState("13-feb")
  const [currentTrips, setCurrentTrips] = useState<TripData[]>(ALL_TRIPS["13-feb"])
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [isFadedOut, setIsFadedOut] = useState(false)
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null)
  const [showOneClick, setShowOneClick] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSeatSelector, setShowSeatSelector] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState<Record<string, number[]>>({})

  const [activeServices, setActiveServices] = useState<ServiceFilter[]>([])
  const [activeTimeSlots, setActiveTimeSlots] = useState<TimeFilter[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("horario")

  const [passenger, setPassenger] = useState<PassengerData>({
    name: "Ryland Grace",
    document: "CC 1.045.XXX.XXX",
    email: "ryland@email.com",
    phone: "+51 999 XXX XXX",
  })

  const [payment, setPayment] = useState<PaymentData>({
    brand: "Visa",
    last4: "4582",
    expiry: "08/28",
  })

  // ── Auth state (toggle for demo) ──
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ── User profile modal state ──
  const [showProfile, setShowProfile] = useState(false)
  const [profileTab, setProfileTab] = useState<"datos" | "pasajeros" | "pagos" | "viajes">("datos")

  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: "Ryland Grace",
    document: "INE 1045XXXXXX",
    email: "ryland@email.com",
    phone: "+51 999 XXX XXX",
    category: "Adulto",
  })

  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: "card-1", brand: "Visa", last4: "4582", expiry: "08/28", isDefault: true },
    { id: "card-2", brand: "Mastercard", last4: "7291", expiry: "03/27", isDefault: false },
  ])

  const [frequentPassengers, setFrequentPassengers] = useState<FrequentPassenger[]>([
    { id: "fp-1", name: "Sarah", lastName: "Grace", category: "Adulto", phone: "+51 999 123 456" },
    { id: "fp-2", name: "Rocky", lastName: "Grace", category: "Menor" },
  ])

  const [userTrips] = useState<UserTrip[]>([
    {
      id: "ut-1",
      origin: "Lima",
      destination: "Ica",
      date: "18 Feb 2026",
      departureTime: "06:20 AM",
      arrivalTime: "10:20 AM",
      serviceType: "PLUS",
      seat: "15",
      price: 45,
      currency: "PEN",
      status: "proximo",
    },
    {
      id: "ut-2",
      origin: "Lima",
      destination: "Ica",
      date: "25 Feb 2026",
      departureTime: "10:00 AM",
      arrivalTime: "02:00 PM",
      serviceType: "EJECUTIVO",
      seat: "22",
      price: 65,
      currency: "PEN",
      status: "proximo",
    },
    {
      id: "ut-3",
      origin: "Ica",
      destination: "Lima",
      date: "02 Feb 2026",
      departureTime: "08:00 AM",
      arrivalTime: "12:00 PM",
      serviceType: "PLUS",
      seat: "8",
      price: 45,
      currency: "PEN",
      status: "pasado",
    },
    {
      id: "ut-4",
      origin: "Lima",
      destination: "Ica",
      date: "20 Ene 2026",
      departureTime: "02:00 PM",
      arrivalTime: "06:00 PM",
      serviceType: "PRIMERA",
      seat: "3",
      price: 95,
      currency: "PEN",
      status: "pasado",
    },
  ])

  const handleOpenProfile = useCallback((tab: "datos" | "pasajeros" | "pagos" | "viajes") => {
    setProfileTab(tab)
    setShowProfile(true)
  }, [])

  // ── Search edit modal state ──
  const [showSearchEdit, setShowSearchEdit] = useState(false)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: "Lima, Peru",
    destination: "Ica, Peru",
    date: "2026-02-13",
    passengers: 1,
    tripType: "ida",
  })

  const handleSaveSearch = useCallback((params: SearchParams) => {
    setSearchParams(params)
    // Trigger a visual reload
    setIsLoadingTrips(true)
    setIsFadedOut(true)
    const delay = 800 + Math.random() * 1200
    setTimeout(() => {
      setIsLoadingTrips(false)
      setTimeout(() => setIsFadedOut(false), 50)
    }, delay)
  }, [])

  // Handle date change with loading delay
  const handleDateChange = useCallback(
    (dateKey: string) => {
      if (dateKey === selectedDate) return

      // Clear any pending timer
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)

      setSelectedDate(dateKey)
      setIsLoadingTrips(true)
      setIsFadedOut(true)

      // Random delay between 800ms and 2200ms
      const delay = 800 + Math.random() * 1400

      loadingTimerRef.current = setTimeout(() => {
        setCurrentTrips(ALL_TRIPS[dateKey] || [])
        setIsLoadingTrips(false)
        // Small extra delay for the fade-in
        setTimeout(() => setIsFadedOut(false), 50)
      }, delay)
    },
    [selectedDate]
  )

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current)
    }
  }, [])

  // Derived filtered + sorted trips (sold-out always at the bottom)
  const { filteredTrips, soldOutTrips } = useMemo(() => {
    const available = currentTrips.filter((t) => !t.soldOut)
    const soldOut = currentTrips.filter((t) => t.soldOut)

    let trips = [...available]

    if (activeServices.length > 0) {
      trips = trips.filter((t) => activeServices.includes(t.serviceType))
    }

    if (activeTimeSlots.length > 0) {
      trips = trips.filter((t) => activeTimeSlots.includes(getTimeSlot(t.departureTime)))
    }

    if (sortBy === "precio") {
      trips.sort((a, b) => a.price - b.price)
    } else {
      trips.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime))
    }

    // Sort sold-out by departure time
    soldOut.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime))

    return { filteredTrips: trips, soldOutTrips: soldOut }
  }, [currentTrips, activeServices, activeTimeSlots, sortBy])

  const oneClickTrips = filteredTrips.filter((t) => t.isOneClickEligible)

  const handleToggleService = useCallback((service: ServiceFilter) => {
    setActiveServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }, [])

  const handleToggleTimeSlot = useCallback((slot: TimeFilter) => {
    setActiveTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    )
  }, [])

  const handleClearFilters = useCallback(() => {
    setActiveServices([])
    setActiveTimeSlots([])
  }, [])

  const handleOneClickPurchase = useCallback((trip: TripData) => {
    setSelectedTrip(trip)
    setShowOneClick(true)
  }, [])

  const handleViewSeats = useCallback((trip: TripData) => {
    setSelectedTrip(trip)
    setShowSeatSelector(true)
  }, [])

  const handleConfirmSeats = useCallback(
    (seats: number[]) => {
      if (!selectedTrip) return
      setSelectedSeats((prev) => ({ ...prev, [selectedTrip.id]: seats }))
      // After confirming seats, transition into purchase flow
      setTimeout(() => {
        setShowOneClick(true)
      }, 350)
    },
    [selectedTrip]
  )

  const handleConfirmPurchase = useCallback(() => {
    setShowOneClick(false)
    setTimeout(() => setShowSuccess(true), 300)
  }, [])

  const currentDateLabel =
    DATE_OPTIONS.find((d) => d.dateKey === selectedDate)?.label ?? "13 Feb"

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        onOpenProfile={handleOpenProfile}
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <RouteHeader
        origin={searchParams.origin.split(",")[0]}
        destination={searchParams.destination.split(",")[0]}
        date={`${currentDateLabel} 2026`}
        passengers={searchParams.passengers}
        onEditSearch={() => setShowSearchEdit(true)}
      />

      <div className="mx-auto max-w-6xl px-4">
        <DateSelector
          dates={DATE_OPTIONS}
          selectedDate={selectedDate}
          onSelectDate={handleDateChange}
        />
      </div>

      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <PriceSidebar
          resultCount={filteredTrips.length}
          activeServices={activeServices}
          activeTimeSlots={activeTimeSlots}
          sortBy={sortBy}
          onToggleService={handleToggleService}
          onToggleTimeSlot={handleToggleTimeSlot}
          onSort={setSortBy}
          onClear={handleClearFilters}
        />

        <div className="flex-1">
          {/* One-click eligible banner */}
          {!isLoadingTrips && oneClickTrips.length > 0 && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 transition-opacity duration-300 ${isFadedOut ? "opacity-0" : "opacity-100"}`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Zap className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">
                  {isLoggedIn ? "Compra en 1 Clic disponible" : "Compra rapida disponible"}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {isLoggedIn
                    ? `Detectamos tu asiento favorito y datos guardados. Puedes comprar ${oneClickTrips.length} viaje${oneClickTrips.length > 1 ? "s" : ""} sin pasos adicionales.`
                    : `Completa tus datos y paga en segundos. ${oneClickTrips.length} viaje${oneClickTrips.length > 1 ? "s" : ""} disponible${oneClickTrips.length > 1 ? "s" : ""}.`}
                </p>
              </div>
              <button className="shrink-0 text-muted-foreground hover:text-foreground">
                <Info className="size-4" />
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoadingTrips && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="size-7 animate-spin text-primary/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                Buscando viajes...
              </p>
            </div>
          )}

          {/* Trip list with fade transition */}
          {!isLoadingTrips && (
            <div
              className={`transition-opacity duration-300 ease-in-out ${isFadedOut ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}
            >
              {filteredTrips.length > 0 || soldOutTrips.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onOneClickPurchase={handleOneClickPurchase}
                      onViewSeats={handleViewSeats}
                      confirmedSeats={selectedSeats[trip.id]}
                    />
                  ))}
                  {soldOutTrips.length > 0 && (
                    <>
                      {filteredTrips.length > 0 && (
                        <div className="my-1 flex items-center gap-3">
                          <div className="h-px flex-1 bg-border/50" />
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                            Sin disponibilidad
                          </span>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                      )}
                      {soldOutTrips.map((trip) => (
                        <TripCard
                          key={trip.id}
                          trip={trip}
                          onOneClickPurchase={handleOneClickPurchase}
                          onViewSeats={handleViewSeats}
                        />
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No hay viajes con esos filtros
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Intenta ajustar los filtros para ver mas opciones.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-3 text-xs font-medium text-accent hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Seat Selector Modal */}
      <SeatSelector
        open={showSeatSelector}
        onOpenChange={setShowSeatSelector}
        trip={selectedTrip}
        onConfirmSeats={handleConfirmSeats}
        initialSelectedSeats={
          selectedTrip ? selectedSeats[selectedTrip.id] || [] : []
        }
      />

      {/* One-Click Purchase Modal */}
      <OneClickModal
        open={showOneClick}
        onOpenChange={setShowOneClick}
        trip={selectedTrip}
        passenger={passenger}
        payment={payment}
        onConfirm={handleConfirmPurchase}
        onPassengerChange={setPassenger}
        onPaymentChange={setPayment}
        selectedSeats={selectedTrip ? selectedSeats[selectedTrip.id] || [] : []}
        isLoggedIn={isLoggedIn}
        onChangeSeat={() => {
          setShowOneClick(false)
          setTimeout(() => setShowSeatSelector(true), 200)
        }}
      />

      {/* Success Modal */}
      <PurchaseSuccess
        open={showSuccess}
        onOpenChange={setShowSuccess}
        trip={selectedTrip}
        passengerName={passenger.name}
      />

      {/* Search Edit Modal */}
      <SearchEditModal
        open={showSearchEdit}
        onOpenChange={setShowSearchEdit}
        params={searchParams}
        onSave={handleSaveSearch}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        open={showProfile}
        onOpenChange={setShowProfile}
        initialTab={profileTab}
        profile={userProfile}
        onProfileChange={setUserProfile}
        cards={savedCards}
        onCardsChange={setSavedCards}
        trips={userTrips}
        passengers={frequentPassengers}
        onPassengersChange={setFrequentPassengers}
      />
    </div>
  )
}
