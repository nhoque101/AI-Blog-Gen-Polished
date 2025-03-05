import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase-server"
import { Edit } from "lucide-react"
import { BlogViewer } from "@/components/blog/blog-viewer"

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
    title: `${post.titles?.title_text} - BlogGen AI`,
    description: `Read the blog post: ${post.titles?.title_text}`,
  }
}

export default async function BlogPage({ params }: { params: { id: string } }) {
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">View Blog</h2>
        <Button asChild>
          <Link href={`/dashboard/blogs/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Blog
          </Link>
        </Button>
      </div>

      <BlogViewer post={post} />
    </div>
  )
}

