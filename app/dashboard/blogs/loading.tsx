import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function BlogsLoading() {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Blogs</h2>
        <Button asChild>
          <Link href="/dashboard/create" prefetch={true}>
            <Plus className="mr-2 h-4 w-4" /> Create New Blog
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-lg border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="p-6 pt-0 flex-grow">
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex justify-between border-t p-4">
              <Skeleton className="h-6 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 