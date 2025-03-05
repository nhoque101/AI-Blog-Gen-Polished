import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    const { titleId } = await request.json()

    if (!titleId) {
      return NextResponse.json({ error: "Title ID is required" }, { status: 400 })
    }

    // Get title from database
    const { data: title, error: titleError } = await supabase
      .from("titles")
      .select("*")
      .eq("id", titleId)
      .eq("user_id", session.user.id)
      .single()

    if (titleError || !title) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 })
    }

    // Generate blog content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates high-quality blog content. Generate a well-structured, engaging blog post based on the provided title. The content should be in markdown format with proper headings, paragraphs, and formatting. Include an introduction, 3-5 main sections with subheadings, and a conclusion.",
        },
        {
          role: "user",
          content: `Write a comprehensive blog post with the title: ${title.title_text}. The blog post should be about: ${title.topic}.`,
        },
      ],
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content || ""

    // Create a new post in the database
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: session.user.id,
        title_id: titleId,
        content,
        status: "draft",
      })
      .select()
      .single()

    if (postError) {
      console.error("Error creating post:", postError)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    // Update the title to mark it as used
    await supabase.from("titles").update({ is_used: true }).eq("id", titleId)

    // Increment the user's posts_count
    await supabase.rpc("increment_posts_count", {
      user_id: session.user.id,
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error generating post:", error)
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 })
  }
}
