import { Suspense } from "react"
import SettingsLoading from "./loading"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-8">
      <div className="max-w-2xl">
        <Suspense fallback={<SettingsLoading />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
} 