import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackToHomeButton() {
  return (
    <Button
      asChild
      variant="ghost"
      className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      <Link href="/">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </Button>
  )
} 