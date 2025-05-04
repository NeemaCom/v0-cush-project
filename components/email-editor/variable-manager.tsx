"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface VariableManagerProps {
  variables: string[]
  onChange: (variables: string[]) => void
}

export function VariableManager({ variables, onChange }: VariableManagerProps) {
  const [newVariable, setNewVariable] = useState("")

  const addVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      const updatedVariables = [...variables, newVariable]
      onChange(updatedVariables)
      setNewVariable("")
    }
  }

  const removeVariable = (variable: string) => {
    const updatedVariables = variables.filter((v) => v !== variable)
    onChange(updatedVariables)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add variable (e.g. name)"
          value={newVariable}
          onChange={(e) => setNewVariable(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addVariable()
            }
          }}
        />
        <Button type="button" onClick={addVariable} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <Badge key={variable} variant="secondary" className="flex items-center gap-1">
            {variable}
            <button
              type="button"
              onClick={() => removeVariable(variable)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {variable}</span>
            </button>
          </Badge>
        ))}
        {variables.length === 0 && <p className="text-sm text-muted-foreground">No variables added yet.</p>}
      </div>
    </div>
  )
}
