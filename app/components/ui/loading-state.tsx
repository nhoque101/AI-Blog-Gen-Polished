import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  text?: string
  size?: "sm" | "default" | "lg"
  center?: boolean
}

export function LoadingState({
  text = "Loading...",
  size = "default",
  center = true,
  className,
  ...props
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        center && "justify-center",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && (
        <span className={cn(
          "text-muted-foreground",
          size === "sm" && "text-sm",
          size === "lg" && "text-lg"
        )}>
          {text}
        </span>
      )}
    </div>
  )
} 