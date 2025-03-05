"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/blog/markdown-renderer"

type Post = {
  id: string
  content: string
  status: "draft" | "published"
  titles: {
    title_text: string
  }
}

export function BlogEditor({ post, userId }: { post: Post; userId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  const [content, setContent] = useState(post.content)
  const [status, setStatus] = useState<"draft" | "published">(post.status)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  // Handle content change
  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
  }

  // Handle blog save
  async function saveBlog(newStatus?: "draft" | "published") {
    setIsLoading(true)

    try {
      const response = await fetch("/api/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          content,
          status: newStatus || status,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save blog")
      }

      if (newStatus) {
        setStatus(newStatus)
      }

      toast({
        title: "Success",
        description: `Blog ${newStatus === "published" || status === "published" ? "published" : "saved as draft"} successfully`,
      })

      router.push("/dashboard/blogs")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{post.titles.title_text}</h1>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <TabsList className="mb-4">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <Textarea value={content} onChange={handleContentChange} className="min-h-[500px] font-mono" />
        </TabsContent>
        <TabsContent value="preview">
          <div className="border rounded-md p-4 min-h-[500px] prose dark:prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => saveBlog("draft")} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save as Draft
        </Button>
        <Button onClick={() => saveBlog("published")} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Publish Blog
        </Button>
      </div>
    </div>
  )
}

