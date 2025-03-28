import { NextResponse } from 'next/server'

// Hilfsfunktion für den API-Test
async function testHubSpotAPI() {
  const debugInfo: any = {
    env: {
      HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN ? 'Verfügbar' : 'Nicht verfügbar',
      HUBSPOT_API_ENDPOINT: process.env.HUBSPOT_API_ENDPOINT,
      NEXT_PUBLIC_HUBSPOT_ACCESS_TOKEN: process.env.NEXT_PUBLIC_HUBSPOT_ACCESS_TOKEN ? 'Verfügbar' : 'Nicht verfügbar'
    },
    tokenPreview: process.env.HUBSPOT_ACCESS_TOKEN ? 
      `${process.env.HUBSPOT_ACCESS_TOKEN.substring(0, 10)}...${process.env.HUBSPOT_ACCESS_TOKEN.substring(process.env.HUBSPOT_ACCESS_TOKEN.length - 5)}` : 
      'Nicht verfügbar',
    tests: {}
  }
  
  // Test 1: Versuche, auf Kontakte zuzugreifen
  try {
    const contactsResponse = await fetch(`${process.env.HUBSPOT_API_ENDPOINT || 'https://api.hubapi.com'}/crm/v3/objects/contacts?limit=1`, {
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    debugInfo.tests.getContacts = {
      status: contactsResponse.status,
      statusText: contactsResponse.statusText,
      ok: contactsResponse.ok
    }
    
    if (contactsResponse.ok) {
      const data = await contactsResponse.json()
      debugInfo.tests.getContacts.data = {
        total: data.total,
        resultsCount: data.results ? data.results.length : 0
      }
    } else {
      const errorText = await contactsResponse.text()
      debugInfo.tests.getContacts.error = errorText
    }
  } catch (error) {
    debugInfo.tests.getContacts = {
      error: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }
  }
  
  // Test 2: Versuche, eine Notiz zu erstellen
  try {
    const createNoteBody = {
      properties: {
        hs_note_body: "Testnachricht für die API-Diagnose. Bitte ignorieren."
      }
    }
    
    const noteResponse = await fetch(`${process.env.HUBSPOT_API_ENDPOINT || 'https://api.hubapi.com'}/crm/v3/objects/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createNoteBody)
    })
    
    debugInfo.tests.createNote = {
      status: noteResponse.status,
      statusText: noteResponse.statusText,
      ok: noteResponse.ok
    }
    
    if (noteResponse.ok) {
      const data = await noteResponse.json()
      debugInfo.tests.createNote.data = {
        id: data.id,
        properties: data.properties
      }
    } else {
      const errorText = await noteResponse.text()
      debugInfo.tests.createNote.error = errorText
    }
  } catch (error) {
    debugInfo.tests.createNote = {
      error: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }
  }
  
  return debugInfo
}

export async function GET() {
  try {
    const testResults = await testHubSpotAPI()
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      message: 'HubSpot API-Diagnose',
      results: testResults
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Fehler bei der API-Diagnose',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    )
  }
} 