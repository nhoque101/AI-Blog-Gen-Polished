import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { BlogCreator } from "@/components/blog/blog-creator"

export const metadata: Metadata = {
  title: "Create Blog - BlogGen AI",
  description: "Create a new AI-generated blog post",
}

export default async function CreateBlogPage() {
  const supabase = createServerClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    redirect("/login")
  }

  // Check if user has reached the limit
  const { data: userData } = await supabase.from("users").select("posts_count").eq("id", user.id).single()

  const postsCount = userData?.posts_count || 0

  // Redirect if user has reached the limit
  if (postsCount >= 50) {
    redirect("/dashboard?error=limit-reached")
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Create New Blog</h2>
      <BlogCreator userId={user.id} />
    </div>
  )
}

