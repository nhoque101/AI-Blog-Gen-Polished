import { createServerClient } from "@/lib/supabase-server"
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

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { title_id, content, status = "draft" } = await request.json()

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title_id,
        content,
        status,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update title status
    await supabase
      .from("titles")
      .update({ is_used: true })
      .eq("id", title_id)

    // Update user's post count
    const { data: userData } = await supabase
      .from("users")
      .select("posts_count")
      .eq("id", user.id)
      .single()

    await supabase
      .from("users")
      .update({ posts_count: (userData?.posts_count || 0) + 1 })
      .eq("id", user.id)

    // Clear all paginated cache for this user
    await clearUserPostsCache(user.id)

    return new Response(JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error saving post:", error)
    return new Response(JSON.stringify({ error: "Failed to save post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

