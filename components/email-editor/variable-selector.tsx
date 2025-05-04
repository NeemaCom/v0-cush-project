"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Variable } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface VariableSelectorProps {
  variables: string[]
  onSelectVariable: (variable: string) => void
  className?: string
}

export function VariableSelector({ variables, onSelectVariable, className }: VariableSelectorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("justify-between", className)}>
          <div className="flex items-center gap-2">
            <Variable className="h-4 w-4" />
            <span>Insert Variable</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search variables..." />
          <CommandList>
            <CommandEmpty>No variables found.</CommandEmpty>
            <CommandGroup>
              {variables.map((variable) => (
                <CommandItem
                  key={variable}
                  value={variable}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onSelectVariable(`{{${currentValue}}}`)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === variable ? "opacity-100" : "opacity-0")} />
                  {variable}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
