import { Contact, Note } from '../types'
import { mockContacts, mockNotes } from './mock-data'
import getConfig from 'next/config'

// Vereinfachte Konfiguration für die HubSpot API
const HUBSPOT_API_ENDPOINT = process.env.HUBSPOT_API_ENDPOINT || 'https://api.hubapi.com'
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN

// HubSpot API Hilfsfunktion für Anfragen
async function fetchFromHubSpot(endpoint: string) {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.warn('HUBSPOT_ACCESS_TOKEN ist nicht konfiguriert. Verwende Mock-Daten.')
    return null
  }

  try {
    console.log(`API-Anfrage: ${HUBSPOT_API_ENDPOINT}${endpoint}`)
    
    const response = await fetch(`${HUBSPOT_API_ENDPOINT}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`HubSpot API Error: ${response.status} ${response.statusText}`)
      throw new Error(`HubSpot API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fehler beim Abrufen von HubSpot-Daten:', error)
    return null
  }
}

// Kontakte von HubSpot abrufen und in unser Format umwandeln
export async function getContacts(): Promise<Contact[]> {
  const data = await fetchFromHubSpot('/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,phone,company,createdate,hs_lastmodifieddate')
  
  if (!data) {
    console.log('Keine Daten von HubSpot erhalten. Verwende Mock-Daten.')
    return mockContacts
  }

  try {
    return data.results.map((contact: any) => ({
      id: contact.id,
      firstName: contact.properties.firstname || '',
      lastName: contact.properties.lastname || '',
      email: contact.properties.email || '',
      phone: contact.properties.phone || '',
      company: contact.properties.company || '',
      createdAt: contact.properties.createdate || new Date().toISOString(),
      lastModified: contact.properties.hs_lastmodifieddate || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Fehler beim Verarbeiten der HubSpot-Kontakte:', error)
    return mockContacts
  }
}

export async function getContactById(id: string): Promise<Contact | null> {
  const data = await fetchFromHubSpot(`/crm/v3/objects/contacts/${id}?properties=firstname,lastname,email,phone,company,createdate,hs_lastmodifieddate`)
  
  if (!data) {
    console.log(`Keine Daten von HubSpot für Kontakt ${id} erhalten. Verwende Mock-Daten.`)
    return mockContacts.find(contact => contact.id === id) || null
  }

  try {
    return {
      id: data.id,
      firstName: data.properties.firstname || '',
      lastName: data.properties.lastname || '',
      email: data.properties.email || '',
      phone: data.properties.phone || '',
      company: data.properties.company || '',
      createdAt: data.properties.createdate || new Date().toISOString(),
      lastModified: data.properties.hs_lastmodifieddate || new Date().toISOString()
    }
  } catch (error) {
    console.error(`Fehler beim Verarbeiten des HubSpot-Kontakts ${id}:`, error)
    return mockContacts.find(contact => contact.id === id) || null
  }
}

export async function getNotesByContactId(contactId: string): Promise<Note[]> {
  // Zuerst prüfen, ob der Token konfiguriert ist
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.warn('HUBSPOT_ACCESS_TOKEN ist nicht konfiguriert. Verwende Mock-Daten.')
    return mockNotes.filter(note => note.contactId === contactId)
  }
  
  try {
    // Statt der komplexen POST-Anfrage, nutzen wir eine GET-Anfrage mit Assoziationsfiltern
    // Hinweis: HubSpot API v3 stellt verschiedene Wege bereit, assoziierte Objekte zu finden
    
    // Zuerst versuchen wir, Notizen über die Assoziations-API zu erhalten
    const response = await fetch(`${HUBSPOT_API_ENDPOINT}/crm/v3/objects/contacts/${contactId}/associations/notes`, {
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error(`HubSpot API Error bei Notizen-Assoziationen: ${response.status} ${response.statusText}`)
      return mockNotes.filter(note => note.contactId === contactId)
    }
    
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      // Keine Notizen gefunden
      return []
    }
    
    // Für jede gefundene Notiz laden wir die Details
    const noteIds = data.results.map((result: any) => result.id)
    const notes: Note[] = []
    
    for (const noteId of noteIds) {
      try {
        const noteResponse = await fetch(`${HUBSPOT_API_ENDPOINT}/crm/v3/objects/notes/${noteId}?properties=hs_note_body,hs_createdate,hs_created_by`, {
          headers: {
            'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (noteResponse.ok) {
          const noteData = await noteResponse.json()
          notes.push({
            id: noteData.id,
            contactId,
            text: noteData.properties.hs_note_body || '',
            createdAt: noteData.properties.hs_createdate || new Date().toISOString(),
            createdBy: noteData.properties.hs_created_by || 'Unbekannter Benutzer'
          })
        }
      } catch (noteError) {
        console.error(`Fehler beim Abrufen der Notiz ${noteId}:`, noteError)
      }
    }
    
    return notes
    
  } catch (error) {
    console.error(`Fehler beim Abrufen der Notizen für Kontakt ${contactId}:`, error)
    // Falls keine Daten oder ein Fehler auftritt, verwenden wir Mock-Daten
    return mockNotes.filter(note => note.contactId === contactId)
  }
}

export async function createNote(contactId: string, text: string, createdBy: string): Promise<Note> {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.warn('HUBSPOT_ACCESS_TOKEN ist nicht konfiguriert. Verwende Mock-Daten.')
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      contactId,
      text,
      createdAt: new Date().toISOString(),
      createdBy
    }
    
    return newNote
  }

  try {
    console.log(`Versuche Notiz zu erstellen für Kontakt ${contactId} mit Text: "${text.substring(0, 30)}..." von ${createdBy}`)
    
    // 1. Schritt: Erstelle die Notiz selbst
    const createNoteBody = {
      properties: {
        hs_note_body: text
        // Hinweis: hs_timestamp wird automatisch gesetzt
      }
    }

    console.log('Sende Notiz-Anfrage:', JSON.stringify(createNoteBody))

    const noteResponse = await fetch(`${HUBSPOT_API_ENDPOINT}/crm/v3/objects/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createNoteBody)
    })

    const responseText = await noteResponse.text()
    
    if (!noteResponse.ok) {
      console.error(`HubSpot API Error beim Erstellen einer Notiz: ${noteResponse.status} ${noteResponse.statusText}`)
      console.error('Antwort von HubSpot:', responseText)
      throw new Error(`Fehler beim Erstellen der Notiz: ${noteResponse.statusText}`)
    }

    // Text zurück in JSON umwandeln
    const noteData = JSON.parse(responseText)
    const noteId = noteData.id
    
    console.log('Notiz erfolgreich erstellt mit ID:', noteId)

    // 2. Schritt: Erstelle eine Assoziation zwischen der Notiz und dem Kontakt
    try {
      // Einfache Art, eine Assoziation zu erstellen (direkte Methode)
      const associationResponse = await fetch(`${HUBSPOT_API_ENDPOINT}/crm/v3/objects/notes/${noteId}/associations/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!associationResponse.ok) {
        console.warn(`Notiz erstellt, aber Assoziation fehlgeschlagen: ${associationResponse.status} ${associationResponse.statusText}`)
      } else {
        console.log('Assoziation erfolgreich erstellt')
      }
    } catch (associationError) {
      console.error('Fehler beim Erstellen der Assoziation, aber Notiz wurde erstellt:', associationError)
    }
    
    // Erfolgreich erstellt, gib das neue Notizobjekt zurück
    return {
      id: noteId,
      contactId,
      text,
      createdAt: new Date().toISOString(),
      createdBy
    }

  } catch (error) {
    console.error(`Fehler beim Erstellen einer Notiz für Kontakt ${contactId}:`, error)
    
    // Fallback auf ein lokales Objekt im Fehlerfall
    const newNote: Note = {
      id: `note-${Date.now()}`,
      contactId,
      text,
      createdAt: new Date().toISOString(),
      createdBy
    }
    
    return newNote
  }
} 