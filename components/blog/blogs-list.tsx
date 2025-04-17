"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"

// Dynamically import heavy components
const DeleteBlogButton = dynamic(() => import("./delete-blog-button"), {
  loading: () => (
    <Button variant="ghost" size="icon" disabled>
      <span className="h-4 w-4 animate-pulse bg-muted rounded" />
    </Button>
  )
})

const BlogActions = dynamic(() => import("./blog-actions"), {
  loading: () => (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" disabled>
        <span className="h-4 w-4 animate-pulse bg-muted rounded" />
      </Button>
      <Button variant="ghost" size="icon" disabled>
        <span className="h-4 w-4 animate-pulse bg-muted rounded" />
      </Button>
    </div>
  )
})

interface Post {
  id: string
  content: string
  status: "draft" | "published"
  created_at: string
  titles: {
    title_text: string
  }
}

export function BlogsList({ 
  posts,
  totalPages,
  currentPage
}: { 
  posts: Post[]
  totalPages: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No blogs yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't created any blogs yet. Get started by creating your first blog.
        </p>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" /> Create Your First Blog
          </Link>
        </Button>
      </div>
    )
  }

  function handlePageChange(page: number) {
    router.push(`${pathname}?page=${page}`)
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const contentPreview = post.content
            ? post.content.substring(0, 150) + (post.content.length > 150 ? "..." : "")
            : "No content preview available"

          return (
            <div key={post.id} className="flex flex-col rounded-lg border bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-lg font-semibold before:content-none after:content-none">
                  {post.titles?.title_text}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-4">{contentPreview}</p>
              </div>
              <div className="flex justify-between border-t p-4">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {post.status === "published" ? "Published" : "Draft"}
                </span>
                <div className="flex gap-2">
                  <BlogActions postId={post.id} />
                  <DeleteBlogButton postId={post.id}>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteBlogButton>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </>
  )
} 