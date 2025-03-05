import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="space-y-4 rounded-lg border p-6">
        <Skeleton className="h-6 w-[150px]" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Preferences Section */}
      <div className="space-y-4 rounded-lg border p-6">
        <Skeleton className="h-6 w-[150px]" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[250px]" />
            </div>
            <Skeleton className="h-6 w-[40px]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-3 w-[220px]" />
            </div>
            <Skeleton className="h-6 w-[40px]" />
          </div>
        </div>
      </div>
    </div>
  )
} 