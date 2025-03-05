import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase-server"
import { FileText, Plus, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard - BlogGen AI",
  description: "Manage your AI-generated blog content",
}

export default async function DashboardPage() {
  const supabase = createServerClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's posts count
  const { data: userData } = await supabase.from("users").select("posts_count").eq("id", user?.id).single()

  const postsCount = userData?.posts_count || 0
  const postsRemaining = 50 - postsCount

  // Get recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("id, title_id, status, created_at, titles(title_text)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Blog
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount}</div>
            <p className="text-xs text-muted-foreground">Total blog posts you've created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Remaining</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsRemaining}</div>
            <p className="text-xs text-muted-foreground">Posts you can still create (limit: 50)</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/dashboard/create" className="block p-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Create New Blog</h4>
                <p className="text-sm text-muted-foreground">Generate a new blog post with AI</p>
              </div>
            </Link>
          </Card>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <Link href="/dashboard/blogs" className="block p-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">View My Blogs</h4>
                <p className="text-sm text-muted-foreground">Browse and manage your saved blogs</p>
              </div>
            </Link>
          </Card>
        </div>
      </div>

      {recentPosts && recentPosts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-4">Recent Blogs</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.titles?.title_text}</CardTitle>
                  <CardDescription>{new Date(post.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/blogs/${post.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

