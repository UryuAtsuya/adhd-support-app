import * as React from "react"

import { cn } from "@/lib/utils"

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive"
}) {
  const variants = {
    default: "border-transparent bg-accent/20 text-accent-foreground",
    secondary: "border-transparent bg-secondary/20 text-secondary-foreground",
    outline: "border-2 border-border text-foreground bg-transparent",
    destructive: "border-transparent bg-destructive/20 text-destructive-foreground",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
