import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialisiere OpenAI-Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, notesContext } = body
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Nachrichten sind erforderlich' },
        { status: 400 }
      )
    }
    
    // Systemanweisung mit dem Notiz-Kontext erstellen
    const systemMessage = {
      role: 'system',
      content: `Du bist ein hilfreicher Assistent, der Fragen über die Notizen eines Kontakts beantwortet. 
                Verwende die folgenden Notizen als Kontext für deine Antworten.
                Wenn du keine Antwort aus den Notizen ableiten kannst, gib an, dass diese Information nicht in den Notizen vorhanden ist.
                
                Notizen:
                ${notesContext || 'Keine Notizen verfügbar.'}`
    }
    
    // Anfrage an OpenAI API senden
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage,
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500
    })
    
    // Antwort aus der API-Antwort extrahieren
    const assistantMessage = response.choices[0]?.message?.content || 'Keine Antwort erhalten.'
    
    return NextResponse.json({ message: assistantMessage })
    
  } catch (error) {
    console.error('Fehler bei der OpenAI-Anfrage:', error)
    
    return NextResponse.json(
      { 
        error: 'Fehler bei der Verarbeitung der Anfrage',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    )
  }
} 