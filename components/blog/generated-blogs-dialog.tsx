"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface GeneratedBlogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  posts: Array<{
    id: string
    title: string
  }>
}

export function GeneratedBlogsDialog({ open, onOpenChange, posts }: GeneratedBlogsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generated Blogs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-muted-foreground">
            {posts.length} blog{posts.length > 1 ? "s" : ""} generated successfully. Click on a title to view the blog.
          </p>
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-2 rounded-lg border">
                <span className="font-medium line-clamp-1 flex-1 mr-4">{post.title}</span>
                <Button asChild variant="ghost" size="sm">
                  <a href={`/dashboard/blogs/${post.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
