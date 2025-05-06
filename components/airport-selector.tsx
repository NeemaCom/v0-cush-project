"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { searchAirports } from "@/lib/flight-booking"
import type { Airport } from "@/lib/db/schema"

interface AirportSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AirportSelector({ value, onChange, placeholder = "Select airport" }: AirportSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [airports, setAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)

  // Search for airports when the query changes
  useEffect(() => {
    const fetchAirports = async () => {
      if (query.length < 2) {
        setAirports([])
        return
      }

      setLoading(true)
      try {
        const results = await searchAirports(query)
        setAirports(results)
      } catch (error) {
        console.error("Error searching airports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAirports()
  }, [query])

  // Fetch the selected airport when the value changes
  useEffect(() => {
    const fetchSelectedAirport = async () => {
      if (!value) {
        setSelectedAirport(null)
        return
      }

      try {
        const results = await searchAirports(value)
        const airport = results.find((a) => a.code === value)
        setSelectedAirport(airport || null)
      } catch (error) {
        console.error("Error fetching selected airport:", error)
      }
    }

    fetchSelectedAirport()
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedAirport ? (
            <div className="flex flex-col items-start">
              <span>
                {selectedAirport.city} ({selectedAirport.code})
              </span>
              <span className="text-xs text-muted-foreground">{selectedAirport.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search airports..." value={query} onValueChange={setQuery} />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loading && query.length < 2 && <CommandEmpty>Enter at least 2 characters to search</CommandEmpty>}
            {!loading && query.length >= 2 && airports.length === 0 && <CommandEmpty>No airports found</CommandEmpty>}
            <CommandGroup>
              {airports.map((airport) => (
                <CommandItem
                  key={airport.code}
                  value={airport.code}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === airport.code ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>
                      {airport.city} ({airport.code})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {airport.name}, {airport.country}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
