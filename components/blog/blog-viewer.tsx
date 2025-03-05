"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from "lucide-react"
import { MarkdownRenderer } from "@/components/blog/markdown-renderer"

type Post = {
  id: string
  content: string
  status: "draft" | "published"
  created_at: string
  titles: {
    title_text: string
  }
}

export function BlogViewer({ post }: { post: Post }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {post.status === "published" ? "Published" : "Draft"}
                </span>
                <span className="text-sm text-muted-foreground ml-4">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/blogs/${post.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

