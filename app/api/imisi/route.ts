import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Construct the prompt with context about migration and financial services
    const systemPrompt = `You are Imisi, an AI assistant specialized in UK and global migration advisory. 
    You provide helpful, accurate, and concise information about:
    - Visa requirements and application processes
    - Documentation needed for migration
    - Financial considerations for migrants
    - Banking and payment solutions for international users
    - Legal requirements for migration
    
    Always be polite, professional, and informative. If you don't know something, say so rather than making up information.
    
    Current date: ${new Date().toISOString().split("T")[0]}`

    // Construct the conversation history
    const conversationHistory = history
      ? history.map((msg: any) => `${msg.role === "user" ? "User" : "Imisi"}: ${msg.content}`).join("\n")
      : ""

    const prompt = `${conversationHistory ? conversationHistory + "\n" : ""}User: ${message}\nImisi:`

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      system: systemPrompt,
    })

    return NextResponse.json({
      response: text,
      userId: session?.user?.id || null,
    })
  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
