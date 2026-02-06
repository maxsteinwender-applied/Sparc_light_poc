import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "./utils"

interface WarningMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
}

export function WarningMessage({ message, className, ...props }: WarningMessageProps) {
  return (
    <div 
      className={cn(
        "flex items-start gap-[8px] bg-transparent border border-[#F5C26B] rounded-[4px] py-[12px] px-[16px]",
        className
      )} 
      {...props}
    >
      <AlertTriangle className="shrink-0 text-[#8A6A4F]" size={16} />
      <span className="text-[14px] leading-[20px] font-medium text-[#003745]">
        {message}
      </span>
    </div>
  )
}
