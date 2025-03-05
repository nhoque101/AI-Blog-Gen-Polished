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

    // Get all titles for the user
    const { data: titles, error: fetchError } = await supabase
      .from("titles")
      .select("id, title_text")
      .eq("user_id", session.user.id)

    if (fetchError) {
      console.error("Error fetching titles:", fetchError)
      return NextResponse.json({ error: "Failed to fetch titles" }, { status: 500 })
    }

    // Update titles to remove quotation marks
    const updates = titles?.map(async (title) => {
      const cleanedTitle = title.title_text.replace(/['"]/g, "").trim()
      
      if (cleanedTitle !== title.title_text) {
        const { error } = await supabase
          .from("titles")
          .update({ title_text: cleanedTitle })
          .eq("id", title.id)
        
        if (error) {
          console.error(`Error updating title ${title.id}:`, error)
        }
      }
    })

    if (updates) {
      await Promise.all(updates)
    }

    return NextResponse.json({ success: true, message: "Titles cleaned successfully" })
  } catch (error) {
    console.error("Error cleaning titles:", error)
    return NextResponse.json({ error: "Failed to clean titles" }, { status: 500 })
  }
} 