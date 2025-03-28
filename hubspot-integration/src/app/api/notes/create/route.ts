import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('POST-Anfrage an /api/notes/create erhalten')
  
  try {
    // Daten aus der Anfrage extrahieren
    const body = await request.json()
    const { contactId, text, createdBy } = body
    
    console.log('Empfangene Daten:', { contactId, text, createdBy })
    
    // Überprüfe Pflichtfelder
    if (!contactId || !text) {
      return NextResponse.json(
        { success: false, error: 'Kontakt-ID und Text sind erforderlich' },
        { status: 400 }
      )
    }
    
    // Token und API-Endpunkt aus Umgebungsvariablen abrufen
    const token = process.env.HUBSPOT_ACCESS_TOKEN
    const apiEndpoint = process.env.HUBSPOT_API_ENDPOINT || 'https://api.hubapi.com'
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'HubSpot-Zugriffstoken nicht konfiguriert' },
        { status: 500 }
      )
    }
    
    console.log('Bereit für API-Aufruf mit Token:', token.substring(0, 10) + '...')
    
    // NEUE METHODE: Notiz mit Assoziationen in einem Schritt erstellen
    // Basierend auf der aktuellen HubSpot API v3
    try {
      const createNoteWithAssociationData = {
        properties: {
          hs_note_body: text,
          hs_timestamp: Date.now()
        },
        associations: [
          {
            to: {
              id: contactId
            },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 202 // Standard-Assoziationstyp für Notiz zu Kontakt
              }
            ]
          }
        ]
      }
      
      console.log('Sende Notizanfrage mit Assoziation:', JSON.stringify(createNoteWithAssociationData))
      
      const noteResponse = await fetch(`${apiEndpoint}/crm/v3/objects/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createNoteWithAssociationData)
      })
      
      const noteText = await noteResponse.text()
      console.log(`Notizantwort Status: ${noteResponse.status}`)
      console.log('Notizantwort:', noteText)
      
      if (!noteResponse.ok) {
        console.error('Fehler bei der Notizerstellung:', noteText)
        
        // Alternativen Ansatz versuchen, falls der erste fehlschlägt
        return await createNoteWithBatchAssociation(apiEndpoint, token, text, contactId)
      }
      
      // Notiz-ID aus Antwort extrahieren
      let noteData;
      try {
        noteData = JSON.parse(noteText)
      } catch (parseError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Fehler beim Parsen der API-Antwort',
            details: noteText
          },
          { status: 500 }
        )
      }
      
      const noteId = noteData.id
      console.log('Notiz erfolgreich erstellt mit ID:', noteId)
      
      // Erfolg zurückgeben
      return NextResponse.json({
        success: true,
        message: 'Notiz erfolgreich erstellt und mit Kontakt verknüpft',
        noteId: noteId
      })
      
    } catch (noteError) {
      console.error('Fehler bei der Notizerstellung:', noteError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fehler beim Erstellen der Notiz',
          details: noteError instanceof Error ? noteError.message : 'Unbekannter Fehler'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Fehler bei der Verarbeitung der Anfrage:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fehler bei der Verarbeitung der Anfrage',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    )
  }
}

// Alternativer Ansatz mit Batch-Assoziation-API
async function createNoteWithBatchAssociation(apiEndpoint: string, token: string, text: string, contactId: string) {
  console.log('Versuche alternativen Ansatz mit Batch-API...')
  
  try {
    // Schritt 1: Erstelle nur die Notiz
    const createNoteData = {
      properties: {
        hs_note_body: text,
        hs_timestamp: Date.now()
      }
    }
    
    const noteResponse = await fetch(`${apiEndpoint}/crm/v3/objects/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createNoteData)
    })
    
    const noteText = await noteResponse.text()
    console.log(`Notizantwort Status (Alternative): ${noteResponse.status}`)
    
    if (!noteResponse.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `HubSpot API-Fehler: ${noteResponse.status}`, 
          details: noteText 
        },
        { status: 500 }
      )
    }
    
    // Notiz-ID aus Antwort extrahieren
    let noteData;
    try {
      noteData = JSON.parse(noteText)
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fehler beim Parsen der API-Antwort',
          details: noteText
        },
        { status: 500 }
      )
    }
    
    const noteId = noteData.id
    console.log('Notiz erstellt mit ID (Alternative):', noteId)
    
    // Schritt 2: Batch-Assoziation erstellen
    const batchAssociationData = {
      inputs: [
        {
          from: { id: noteId },
          to: { id: contactId },
          type: "note_to_contact"
        }
      ]
    }
    
    console.log('Sende Batch-Assoziationsanfrage:', JSON.stringify(batchAssociationData))
    
    const batchResponse = await fetch(`${apiEndpoint}/crm/v3/associations/notes/contacts/batch/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batchAssociationData)
    })
    
    const batchText = await batchResponse.text()
    console.log(`Batch-Assoziationsantwort Status: ${batchResponse.status}`)
    console.log('Batch-Assoziationsantwort:', batchText)
    
    if (!batchResponse.ok) {
      // Versuche den dritten Ansatz - direkte Assoziation
      return await createDirectAssociation(apiEndpoint, token, noteId, contactId)
    }
    
    // Erfolg zurückgeben
    return NextResponse.json({
      success: true,
      message: 'Notiz erfolgreich erstellt und mit Kontakt verknüpft (Batch-Methode)',
      noteId: noteId
    })
    
  } catch (error) {
    console.error('Fehler bei der Batch-Assoziation:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fehler bei der Batch-Assoziation',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    )
  }
}

// Dritter Ansatz mit direkter Assoziation-API
async function createDirectAssociation(apiEndpoint: string, token: string, noteId: string, contactId: string) {
  console.log('Versuche direkten Assoziationsansatz...')
  
  try {
    // Direkte Assoziation
    const directResponse = await fetch(`${apiEndpoint}/crm/v3/objects/notes/${noteId}/associations/contacts/${contactId}/note_to_contact`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const directText = await directResponse.text()
    console.log(`Direkte Assoziationsantwort Status: ${directResponse.status}`)
    console.log('Direkte Assoziationsantwort:', directText)
    
    if (!directResponse.ok) {
      return NextResponse.json(
        { 
          success: true, 
          warning: 'Notiz wurde erstellt, aber konnte nicht mit dem Kontakt verknüpft werden',
          noteId: noteId,
          details: directText
        }
      )
    }
    
    // Erfolg zurückgeben
    return NextResponse.json({
      success: true,
      message: 'Notiz erfolgreich erstellt und mit Kontakt verknüpft (Direkte Methode)',
      noteId: noteId
    })
    
  } catch (error) {
    console.error('Fehler bei der direkten Assoziation:', error)
    return NextResponse.json(
      { 
        success: true, 
        warning: 'Notiz wurde erstellt, aber ein Fehler trat bei der Kontaktverknüpfung auf',
        noteId: noteId,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }
    )
  }
} 