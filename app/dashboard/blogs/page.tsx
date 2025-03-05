"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientClient } from "@/lib/supabase-client"
import { Edit, Eye, Plus, Trash } from "lucide-react"
import { DeleteBlogButton } from "@/components/blog/delete-blog-button"
import { BlogPagination } from "@/components/blog/blog-pagination"

const ITEMS_PER_PAGE = 6

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCleaning, setIsCleaning] = useState(false)

  // Calculate pagination
  const totalPages = Math.ceil((posts?.length || 0) / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPosts = posts?.slice(startIndex, endIndex) || []

  // Clean titles
  async function cleanTitles() {
    setIsCleaning(true)
    try {
      const response = await fetch("/api/migrate-titles", {
        method: "POST",
      })
      
      if (!response.ok) {
        throw new Error("Failed to clean titles")
      }
      
      // Refetch posts to show updated titles
      await fetchPosts()
    } catch (error) {
      console.error("Error cleaning titles:", error)
    } finally {
      setIsCleaning(false)
    }
  }

  // Fetch posts
  async function fetchPosts() {
    setIsLoading(true)
    const supabase = createClientClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setIsLoading(false)
      return
    }
    
    const { data: fetchedPosts } = await supabase
      .from("posts")
      .select("id, title_id, content, status, created_at, titles(title_text)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    
    setPosts(fetchedPosts || [])
    setIsLoading(false)
  }

  // Handle page change
  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Blogs</h2>
        <div className="flex gap-4">
          {isCleaning && (
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
              Cleaning titles...
            </div>
          )}
          <Button onClick={cleanTitles} variant="outline" disabled={isCleaning}>
            Clean Titles
          </Button>
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" /> Create New Blog
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Loading your blogs...</p>
        </div>
      ) : posts && posts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post) => {
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
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/blogs/${post.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/blogs/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
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
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
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
      )}
    </div>
  )
}

