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
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Generate titles using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates engaging blog titles. Generate 10 unique, creative, and engaging blog titles based on the provided topic. Do not use any quotation marks in the titles. Return only the titles as a numbered list, with no additional text or punctuation marks.",
        },
        {
          role: "user",
          content: `Generate 10 engaging blog titles about: ${topic}`,
        },
      ],
      temperature: 0.7,
    })

    // Extract titles from the response
    const titlesText = completion.choices[0].message.content || ""

    // Parse the numbered list into an array of titles and clean them
    const titlesArray = titlesText
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        // Remove the number, special characters, and any quotation marks
        return line
          .replace(/^\d+[.)-]?\s*/, "")
          .replace(/['"]/g, "")
          .trim()
      })
      .filter((title) => title.length > 0)

    // Store titles in Supabase
    const titlesWithData = titlesArray.map((title) => ({
      user_id: session.user.id,
      topic,
      title_text: title,
      is_used: false,
    }))

    const { data: storedTitles, error } = await supabase.from("titles").insert(titlesWithData).select()

    if (error) {
      console.error("Error storing titles:", error)
      return NextResponse.json({ error: "Failed to store titles" }, { status: 500 })
    }

    return NextResponse.json({ titles: storedTitles })
  } catch (error) {
    console.error("Error generating titles:", error)
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 })
  }
}
