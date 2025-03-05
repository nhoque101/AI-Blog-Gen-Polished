import { LoadingState } from "./components/ui/loading-state"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState size="lg" text="Loading page..." />
    </div>
  )
} 