import { createServerClient } from "@/lib/supabase-server"
import { redis, CACHE_KEYS, CACHE_TTL } from "@/lib/redis"

const ITEMS_PER_PAGE = 6

async function getBlogs(userId: string, page: number = 1) {
  const cacheKey = `${CACHE_KEYS.USER_POSTS(userId)}_page_${page}`
  
  // Try to get from cache first
  const cachedPosts = await redis.get(cacheKey)
  if (cachedPosts) {
    return {
      posts: cachedPosts,
      count: await redis.get(`${CACHE_KEYS.USER_POSTS(userId)}_total_count`) || 0
    }
  }

  // If not in cache, fetch from Supabase
  const supabase = createServerClient()
  
  // Get total count
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Calculate pagination
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Fetch paginated posts
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title_id, content, status, created_at, titles(title_text)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to)

  // Cache the results
  if (posts) {
    await redis.set(
      cacheKey,
      posts,
      { ex: CACHE_TTL.POSTS }
    )
    await redis.set(
      `${CACHE_KEYS.USER_POSTS(userId)}_total_count`,
      count,
      { ex: CACHE_TTL.POSTS }
    )
  }

  return {
    posts: posts || [],
    count: count || 0
  }
}

export async function BlogsListServer({ userId, page = 1 }: { userId: string, page?: number }) {
  const { posts, count } = await getBlogs(userId, page)
  
  // Return the data in a format that can be consumed by the client component
  return {
    posts,
    totalPages: Math.ceil(count / ITEMS_PER_PAGE),
    currentPage: page
  }
} 