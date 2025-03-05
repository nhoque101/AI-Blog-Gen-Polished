import { LoadingState } from "../components/ui/loading-state"

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingState size="lg" text="Loading login..." />
    </div>
  )
} 