"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

export type TableStatus = "available" | "reserved" | "occupied"

export type Table = {
  id: string
  number: number
  capacity: number
  location: "Main Dining" | "Terrace / Outdoor" | "VIP Lounge" | "Private Room"
  status: TableStatus
  minSpend: number // Minimum spend requirement in ₹
}

// Sample Table Data with Indian Pricing
const initialTables: Table[] = [
  { id: "t1", number: 1, capacity: 2, location: "Main Dining", status: "available", minSpend: 500 },
  { id: "t2", number: 2, capacity: 2, location: "Main Dining", status: "occupied", minSpend: 500 },
  { id: "t3", number: 3, capacity: 4, location: "Main Dining", status: "available", minSpend: 1000 },
  { id: "t4", number: 4, capacity: 4, location: "Main Dining", status: "reserved", minSpend: 1000 },
  { id: "t5", number: 5, capacity: 6, location: "Terrace / Outdoor", status: "available", minSpend: 2000 },
  { id: "t6", number: 6, capacity: 6, location: "Terrace / Outdoor", status: "available", minSpend: 2000 },
  { id: "t7", number: 7, capacity: 8, location: "VIP Lounge", status: "available", minSpend: 4000 },
  { id: "t8", number: 8, capacity: 10, location: "Private Room", status: "available", minSpend: 6000 },
]

const timeSlots = ["06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"]

export default function TablePage() {
  const [tables] = useState<Table[]>(initialTables)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [guests, setGuests] = useState<number>(2)
  const [selectedTime, setSelectedTime] = useState<string>("07:00 PM")
  const [isBooked, setIsBooked] = useState<boolean>(false)

  // Filter tables based on location
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      return selectedLocation === "all" || t.location === selectedLocation
    })
  }, [tables, selectedLocation])

  const handleBookTable = () => {
    if (!selectedTable) return
    setIsBooked(true)
  }

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#E6E1DC]">
      {/* Header Banner */}
      <header className="border-b border-[#2A2420] bg-[#141210] py-8 text-center shadow-lg">
        <h1 className="font-serif text-3xl font-bold tracking-wide text-[#E6E1DC] sm:text-4xl">
          Table Reservation
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#C67D3B]">
          Reserve Your Dining Experience & Preferred Seating
        </p>
      </header>

      {/* Main Container */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        {/* Left Column: Interactive Layout & Selection */}
        <div className="flex-1">
          {/* Location Tabs */}
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto border-b border-[#2A2420] pb-3">
            {["all", "Main Dining", "Terrace / Outdoor", "VIP Lounge", "Private Room"].map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  selectedLocation === loc
                    ? "bg-[#C67D3B] text-[#0C0B0A]"
                    : "bg-[#141210] text-[#8C7B70] hover:bg-[#2A2420] hover:text-[#E6E1DC]"
                }`}
              >
                {loc === "all" ? "All Areas" : loc}
              </button>
            ))}
          </div>

          {/* Status Legend */}
          <div className="mb-6 flex flex-wrap gap-4 text-xs font-medium text-[#8C7B70]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#10B981]"></span> Available
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#F59E0B]"></span> Reserved
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#EF4444]"></span> Occupied
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTables.map((table) => {
              const isSelected = selectedTable?.id === table.id
              const isAvailable = table.status === "available"

              return (
                <button
                  key={table.id}
                  disabled={!isAvailable}
                  onClick={() => {
                    setSelectedTable(table)
                    setIsBooked(false)
                  }}
                  className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-[#C67D3B] bg-[#141210] ring-1 ring-[#C67D3B]"
                      : isAvailable
                      ? "border-[#2A2420] bg-[#141210] hover:border-[#8C7B70]"
                      : "cursor-not-allowed border-[#2A2420]/50 bg-[#0C0B0A] opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-[#E6E1DC]">
                      Table {table.number}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        table.status === "available"
                          ? "bg-[#10B981]"
                          : table.status === "reserved"
                          ? "bg-[#F59E0B]"
                          : "bg-[#EF4444]"
                      }`}
                    />
                  </div>

                  <div className="mt-4 space-y-1 text-xs text-[#8C7B70]">
                    <p>Location: <span className="text-[#E6E1DC]">{table.location}</span></p>
                    <p>Capacity: <span className="text-[#E6E1DC]">{table.capacity} Persons</span></p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#2A2420] pt-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#8C7B70]">
                      Min. Spend
                    </span>
                    <span className="font-serif text-sm font-bold text-[#C67D3B]">
                      ₹{table.minSpend}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Reservation Summary & Booking Form */}
        <aside className="w-full lg:w-96 lg:shrink-0">
          <div className="sticky top-6 rounded-2xl border border-[#2A2420] bg-[#141210] p-6 shadow-xl">
            <h2 className="border-b border-[#2A2420] pb-4 font-serif text-xl font-bold text-[#E6E1DC]">
              Reserve Details
            </h2>

            {!selectedTable ? (
              <div className="py-12 text-center text-xs text-[#8C7B70]">
                Select an available table from the list to proceed with booking.
              </div>
            ) : isBooked ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                  ✓
                </div>
                <h3 className="font-serif text-lg font-bold text-[#E6E1DC]">
                  Table Reserved!
                </h3>
                <p className="text-xs text-[#8C7B70]">
                  Table {selectedTable.number} has been locked for {selectedTime}. Minimum spend requirement: ₹{selectedTable.minSpend}.
                </p>
                <Link
                  href="/menu"
                  className="mt-4 block w-full rounded-xl bg-[#C67D3B] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
                >
                  Pre-order Food Menu
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-5">
                {/* Selected Table Info */}
                <div className="rounded-xl border border-[#2A2420] bg-[#0C0B0A] p-4 text-xs">
                  <div className="flex justify-between font-bold text-[#E6E1DC]">
                    <span>Table {selectedTable.number} ({selectedTable.location})</span>
                    <span className="text-[#C67D3B]">₹{selectedTable.minSpend}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-[#8C7B70]">
                    Up to {selectedTable.capacity} Guests • Minimum Spend Applies
                  </p>
                </div>

                {/* Party Size Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#8C7B70]">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-[#2A2420] bg-[#0C0B0A] px-4 py-2.5 text-xs text-[#E6E1DC] focus:border-[#C67D3B] focus:outline-none"
                  >
                    {Array.from({ length: selectedTable.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#8C7B70]">
                    Select Time Slot
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-lg border py-2 text-[10px] font-bold transition ${
                          selectedTime === slot
                            ? "border-[#C67D3B] bg-[#C67D3B] text-[#0C0B0A]"
                            : "border-[#2A2420] bg-[#0C0B0A] text-[#8C7B70] hover:text-[#E6E1DC]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="border-t border-[#2A2420] pt-4 text-xs space-y-2">
                  <div className="flex justify-between text-[#8C7B70]">
                    <span>Table Cover Charge</span>
                    <span className="text-[#E6E1DC]">₹0</span>
                  </div>
                  <div className="flex justify-between text-[#8C7B70]">
                    <span>Minimum Food/Drink Spend</span>
                    <span className="text-[#E6E1DC]">₹{selectedTable.minSpend}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#E6E1DC] pt-2 border-t border-[#2A2420]">
                    <span>Pay On Arrival</span>
                    <span className="text-[#C67D3B]">₹{selectedTable.minSpend}</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleBookTable}
                  className="w-full rounded-xl bg-[#C67D3B] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#0C0B0A] transition hover:bg-[#d88d4a]"
                >
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}