import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { BlogCreator } from "@/components/blog/blog-creator"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Create Blog - BlogGen AI",
  description: "Create a new AI-generated blog post",
}

export default async function CreatePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Please log in</h3>
        <p className="text-muted-foreground">You need to be logged in to create blogs.</p>
      </div>
    )
  }

  // Check if user has reached the limit
  const { data: userData } = await supabase.from("users").select("posts_count").eq("id", user.id).single()

  const postsCount = userData?.posts_count || 0

  // Redirect if user has reached the limit
  if (postsCount >= 50) {
    redirect("/dashboard?error=limit-reached")
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Create New Blog</h2>
        <p className="text-muted-foreground mt-2">
          Generate engaging blog content with AI assistance.
        </p>
      </div>
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      }>
        <BlogCreator userId={user.id} />
      </Suspense>
    </div>
  )
}

