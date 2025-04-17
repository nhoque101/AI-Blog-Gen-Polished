"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { Loader2 } from "lucide-react"
import { redis, CACHE_KEYS } from "@/lib/redis"

// Helper function to clear all paginated cache
async function clearUserPostsCache(userId: string) {
  try {
    // Get all keys matching the pattern
    const keys = await redis.keys(`${CACHE_KEYS.USER_POSTS(userId)}*`)
    if (keys.length > 0) {
      // Delete all matching keys
      await Promise.all(keys.map(key => redis.del(key)))
    }
  } catch (error) {
    console.error("Error clearing cache:", error)
  }
}

export function DeleteBlogButton({
  postId,
  children,
}: {
  postId: string
  children: React.ReactNode
}) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleDelete() {
    setIsLoading(true)

    try {
      // First, get the post details to find the associated title_id
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("title_id")
        .eq("id", postId)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Delete the post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Update the title to mark it as unused
      if (post?.title_id) {
        const { error: titleError } = await supabase
          .from("titles")
          .update({ is_used: false })
          .eq("id", post.title_id)

        if (titleError) {
          console.error("Error updating title:", titleError)
        }
      }

      // Get current posts_count and decrement it
      const { data: userData, error: userFetchError } = await supabase
        .from("users")
        .select("posts_count")
        .eq("id", user.id)
        .single()

      if (userFetchError) {
        console.error("Error fetching user data:", userFetchError)
      } else {
        const currentCount = userData?.posts_count || 0
        if (currentCount > 0) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ posts_count: currentCount - 1 })
            .eq("id", user.id)

          if (updateError) {
            console.error("Error updating user posts count:", updateError)
          }
        }
      }

      // Clear all paginated cache for this user
      await clearUserPostsCache(user.id)

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      })

      // Redirect to blogs page and refresh
      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your blog post and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// For compatibility with both default and named imports
export default DeleteBlogButton

