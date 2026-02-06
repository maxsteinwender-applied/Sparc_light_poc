import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "./utils"

interface NumericInputStepperProps {
  value: number
  onChange: (value: number) => void
  label?: string
  unit?: string
  note?: string
  min?: number
  max?: number
  step?: number
  className?: string
}

export function NumericInputStepper({
  value,
  onChange,
  label,
  unit,
  note,
  min = 0,
  max = 100,
  step = 1,
  className,
}: NumericInputStepperProps) {
  
  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step))
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step))
    }
  }

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {label && (
        <span className="text-[12px] text-[#568996] mb-[4px] block font-normal">
          {label}
        </span>
      )}
      
      <div className="flex items-center bg-[#FFFFFF] border border-[#003745] rounded-[4px] h-[40px] overflow-hidden">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-[40px] h-full flex items-center justify-center bg-transparent text-[#003745] disabled:opacity-50 focus:outline-none"
        >
          <Minus size={16} />
        </button>
        
        <div className="flex-grow flex items-center justify-center gap-[6px]">
          <span className="text-[16px] font-semibold text-[#003745]">
            {value}
          </span>
          {unit && (
            <span className="text-[14px] font-semibold text-[#003745]">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-[40px] h-full flex items-center justify-center bg-transparent text-[#003745] disabled:opacity-50 focus:outline-none"
        >
          <Plus size={16} />
        </button>
      </div>

      {note && (
        <span className="text-[12px] text-[#568996] mt-[4px] block font-normal">
          {note}
        </span>
      )}
    </div>
  )
}
