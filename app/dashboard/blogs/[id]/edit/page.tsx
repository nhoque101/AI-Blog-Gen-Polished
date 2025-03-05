import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { BlogEditor } from "@/components/blog/blog-editor"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerClient()

  // Get blog post data
  const { data: post } = await supabase.from("posts").select("titles(title_text)").eq("id", params.id).single()

  if (!post) {
    return {
      title: "Blog Not Found - BlogGen AI",
    }
  }

  return {
    title: `Edit: ${post.titles?.title_text} - BlogGen AI`,
    description: `Edit your blog post: ${post.titles?.title_text}`,
  }
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get blog post data
  const { data: post } = await supabase
    .from("posts")
    .select("*, titles(title_text)")
    .eq("id", params.id)
    .eq("user_id", user?.id)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Edit Blog</h2>
      <BlogEditor post={post} userId={user?.id} />
    </div>
  )
}

