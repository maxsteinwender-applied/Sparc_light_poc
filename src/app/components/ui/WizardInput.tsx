import * as React from "react"
import { cn } from "./utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const WizardInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[4px] border border-[#003745]/20 bg-white px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9FB6BC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003745] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 text-[#003745]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
WizardInput.displayName = "WizardInput"

export { WizardInput }
