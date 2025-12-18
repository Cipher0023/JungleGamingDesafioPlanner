import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
