import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"
import { BlogsList } from "@/components/blog/blogs-list"
import { BlogsListServer } from "@/components/blog/blogs-list-server"
import BlogsLoading from "./loading"

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const supabase = createServerClient()
  // Use getUser instead of getSession for better security
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Please log in</h3>
        <p className="text-muted-foreground">You need to be logged in to view your blogs.</p>
      </div>
    )
  }

  const { posts, totalPages, currentPage } = await BlogsListServer({ 
    userId: user.id,
    page
  })

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

      <Suspense fallback={<BlogsLoading />}>
        <BlogsList 
          posts={posts} 
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  )
}

