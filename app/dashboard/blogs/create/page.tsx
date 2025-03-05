import type { Metadata } from "next"
import { CreateBlogForm } from "@/components/blog/create-blog-form"

export const metadata: Metadata = {
  title: "Create Blog - BlogGen AI",
  description: "Create a new blog post with AI assistance",
}

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Blog</h1>
        <p className="text-muted-foreground">
          Write your blog post with AI assistance. Get title suggestions and content help.
        </p>
      </div>
      <CreateBlogForm />
    </div>
  )
} 