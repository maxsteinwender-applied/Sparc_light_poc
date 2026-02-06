import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center h-[24px] px-[10px] rounded-full text-[12px] leading-[16px] font-semibold pointer-events-none select-none",
  {
    variants: {
      variant: {
        neutral: "bg-[#E6F0F2] text-[#003745]",
        accent: "bg-[#F5EFE4] text-[#6B4A2F]",
        "emphasis-primary": "bg-[#003745] text-[#FFFFFF]",
        "emphasis-secondary": "bg-[#8A6A4F] text-[#FFFFFF]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
