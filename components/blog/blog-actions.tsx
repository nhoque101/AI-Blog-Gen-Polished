"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"

export default function BlogActions({ postId }: { postId: string }) {
  return (
    <>
      <Button asChild variant="ghost" size="icon">
        <Link href={`/dashboard/blogs/${postId}`} prefetch={true}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon">
        <Link href={`/dashboard/blogs/${postId}/edit`} prefetch={true}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>
    </>
  )
} 