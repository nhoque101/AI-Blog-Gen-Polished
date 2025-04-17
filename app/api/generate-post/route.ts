import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import OpenAI from "openai"
import { redis, CACHE_KEYS } from "@/lib/redis"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title_id } = await request.json()

    if (!title_id) {
      return NextResponse.json({ error: "Title ID is required" }, { status: 400 })
    }

    // Get title from database
    const { data: title, error: titleError } = await supabase
      .from("titles")
      .select("*")
      .eq("id", title_id)
      .eq("user_id", user.id)
      .single()

    if (titleError || !title) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 })
    }

    // Generate blog content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional blog writer who creates well-structured, engaging content. 
Format your posts using proper markdown:
- Use # for the main title
- Use ## for major sections
- Use ### for subsections
- Use **bold** for emphasis
- Use bullet points and numbered lists where appropriate
- Include a brief introduction after the title
- Create 3-5 main sections with relevant subheadings
- End with a conclusion section
- Make sure sections are properly spaced with line breaks`,
        },
        {
          role: "user",
          content: `Write a detailed blog post with the title: "${title.title_text}".
Structure it with:
1. An engaging introduction
2. 3-5 main sections with clear headings
3. Relevant subsections where needed
4. A strong conclusion
Use markdown formatting for all headings and emphasis.`,
        },
      ],
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0].message.content || ""

    // Create a new post in the database
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title_id,
        content: generatedContent,
        status: "draft",
      })
      .select()
      .single()

    if (postError) {
      console.error("Error creating post:", postError)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    // Update the title to mark it as used
    await supabase.from("titles").update({ is_used: true }).eq("id", title_id)

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

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error generating post:", error)
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 })
  }
}
