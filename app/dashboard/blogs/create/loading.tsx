import { Skeleton } from "@/components/ui/skeleton"

export default function CreateBlogLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Topic Selection */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Editor Area */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[150px]" />
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="rounded-lg border p-6 space-y-4">
          <Skeleton className="h-6 w-[200px]" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 