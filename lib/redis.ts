import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://great-tadpole-22729.upstash.io',
  token: 'AVjJAAIjcDE1ZDA5YWVhZDE5OTQ0ZGE0OGFmOTIzYThlZjIzMTVlOHAxMA',
})

// Cache TTL in seconds
export const CACHE_TTL = {
  POSTS: 60 * 5, // 5 minutes
  USER: 60 * 15, // 15 minutes
}

// Cache keys
export const CACHE_KEYS = {
  USER_POSTS: (userId: string) => `user:${userId}:posts`,
  USER_DATA: (userId: string) => `user:${userId}:data`,
}

export { redis } 