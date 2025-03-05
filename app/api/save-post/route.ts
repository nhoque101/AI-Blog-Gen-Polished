import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { postId, content, status } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    // Check if the post exists and belongs to the user
    const { data: existingPost, error: checkError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .eq("user_id", session.user.id)
      .single()

    if (checkError || !existingPost) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 })
    }

    // Update the post
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (status !== undefined) updateData.status = status

    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating post:", updateError)
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Error saving post:", error)
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 })
  }
}

