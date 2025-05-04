"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash } from "lucide-react"

interface PreviewVariablesProps {
  variables: string[]
  previewData: Record<string, any>
  onChange: (data: Record<string, any>) => void
}

export function PreviewVariables({ variables, previewData, onChange }: PreviewVariablesProps) {
  const [arrayValues, setArrayValues] = useState<Record<string, string[]>>(
    Object.fromEntries(
      Object.entries(previewData)
        .filter(([_, value]) => Array.isArray(value))
        .map(([key, value]) => [key, value as string[]]),
    ),
  )

  const handleInputChange = (variable: string, value: string) => {
    const updatedData = { ...previewData, [variable]: value }
    onChange(updatedData)
  }

  const handleArrayItemChange = (variable: string, index: number, value: string) => {
    const updatedArray = [...(arrayValues[variable] || [])]
    updatedArray[index] = value

    const updatedArrayValues = { ...arrayValues, [variable]: updatedArray }
    setArrayValues(updatedArrayValues)

    const updatedData = { ...previewData, [variable]: updatedArray }
    onChange(updatedData)
  }

  const addArrayItem = (variable: string) => {
    const currentArray = arrayValues[variable] || []
    const updatedArray = [...currentArray, ""]

    const updatedArrayValues = { ...arrayValues, [variable]: updatedArray }
    setArrayValues(updatedArrayValues)

    const updatedData = { ...previewData, [variable]: updatedArray }
    onChange(updatedData)
  }

  const removeArrayItem = (variable: string, index: number) => {
    const currentArray = arrayValues[variable] || []
    const updatedArray = currentArray.filter((_, i) => i !== index)

    const updatedArrayValues = { ...arrayValues, [variable]: updatedArray }
    setArrayValues(updatedArrayValues)

    const updatedData = { ...previewData, [variable]: updatedArray }
    onChange(updatedData)
  }

  // Determine if a variable should be treated as an array
  const isArrayVariable = (variable: string) => {
    return variable === "documents" || variable.endsWith("s") || Array.isArray(previewData[variable])
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preview Variables</h3>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="preview-variables">
          <AccordionTrigger>Edit Preview Data</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {variables.map((variable) => (
                <div key={variable} className="space-y-2">
                  <Label htmlFor={`var-${variable}`}>{variable}</Label>

                  {isArrayVariable(variable) ? (
                    <div className="space-y-2">
                      {(arrayValues[variable] || []).map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            id={`var-${variable}-${index}`}
                            value={item}
                            onChange={(e) => handleArrayItemChange(variable, index, e.target.value)}
                            placeholder={`Value for ${variable}[${index}]`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem(variable, index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem(variable)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  ) : (
                    <Input
                      id={`var-${variable}`}
                      value={previewData[variable] || ""}
                      onChange={(e) => handleInputChange(variable, e.target.value)}
                      placeholder={`Value for ${variable}`}
                    />
                  )}
                </div>
              ))}

              {variables.length === 0 && (
                <p className="text-sm text-muted-foreground">No variables defined for this template.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
