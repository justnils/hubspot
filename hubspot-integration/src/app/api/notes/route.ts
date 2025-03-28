import { NextResponse } from 'next/server'
import { createNote } from '../../../../lib/hubspot'

// Debug-Konstanten
console.log('API-Route für Notizen geladen')
console.log('HUBSPOT_ACCESS_TOKEN verfügbar:', !!process.env.HUBSPOT_ACCESS_TOKEN)
console.log('HUBSPOT_API_ENDPOINT:', process.env.HUBSPOT_API_ENDPOINT)

export async function POST(request: Request) {
  console.log('POST-Anfrage an /api/notes erhalten')
  
  try {
    // Debug-Ausgabe
    console.log('Notiz API aufgerufen')
    
    const body = await request.json()
    const { contactId, text, createdBy } = body

    console.log('Empfangene Daten:', { contactId, text, createdBy })

    if (!contactId || !text || !createdBy) {
      console.error('Fehlende Pflichtfelder')
      return NextResponse.json(
        { error: 'Fehlende Pflichtfelder: contactId, text und createdBy sind erforderlich' },
        { status: 400 }
      )
    }

    // Direkt die Notiz erstellen
    try {
      const note = await createNote(contactId, text, createdBy)
      console.log('Notiz erfolgreich erstellt:', note)
      return NextResponse.json({ success: true, note })
    } catch (createError) {
      console.error('Fehler beim Erstellen der Notiz:', createError)
      
      if (createError instanceof Error) {
        return NextResponse.json(
          { error: `Fehler beim Erstellen der Notiz: ${createError.message}` },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Fehler beim Erstellen der Notiz in HubSpot API' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Fehler bei der Verarbeitung der Anfrage:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Verarbeitungsfehler: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Fehler beim Verarbeiten der Anfrage' },
      { status: 500 }
    )
  }
} 