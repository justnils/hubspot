'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiagnosePage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/hubspot-test')
      
      if (!response.ok) {
        throw new Error(`API-Anfrage fehlgeschlagen: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
      console.error('Fehler bei der Diagnose:', err)
    } finally {
      setLoading(false)
    }
  }

  // Direkte Client-Diagnose
  const testDirectAPICall = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const token = process.env.NEXT_PUBLIC_HUBSPOT_ACCESS_TOKEN || ''
      
      // Prüfen, ob der Token verfügbar ist
      if (!token) {
        throw new Error('Kein öffentlicher Zugriffstoken gefunden')
      }
      
      // Test 1: Kontakte abrufen
      const directResults: any = {
        tokenPreview: `${token.substring(0, 10)}...${token.substring(token.length - 5)}`,
        client: true,
        tests: {}
      }
      
      // Test 1: Kontakte abrufen
      try {
        const contactsResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        directResults.tests.getContacts = {
          status: contactsResponse.status,
          statusText: contactsResponse.statusText,
          ok: contactsResponse.ok
        }
        
        const contactsText = await contactsResponse.text()
        directResults.tests.getContacts.response = contactsText
        
        try {
          const contactsData = JSON.parse(contactsText)
          directResults.tests.getContacts.parsed = true
          directResults.tests.getContacts.data = contactsData
        } catch (parseError) {
          directResults.tests.getContacts.parsed = false
        }
      } catch (contactsError) {
        directResults.tests.getContacts = {
          error: contactsError instanceof Error ? contactsError.message : 'Unbekannter Fehler'
        }
      }
      
      // Test 2: Notiz erstellen
      try {
        const createNoteBody = {
          properties: {
            hs_note_body: "Client-Test-Nachricht. Bitte ignorieren."
          }
        }
        
        const noteResponse = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createNoteBody)
        })
        
        directResults.tests.createNote = {
          status: noteResponse.status,
          statusText: noteResponse.statusText,
          ok: noteResponse.ok
        }
        
        const noteText = await noteResponse.text()
        directResults.tests.createNote.response = noteText
        
        try {
          const noteData = JSON.parse(noteText)
          directResults.tests.createNote.parsed = true
          directResults.tests.createNote.data = noteData
        } catch (parseError) {
          directResults.tests.createNote.parsed = false
        }
      } catch (noteError) {
        directResults.tests.createNote = {
          error: noteError instanceof Error ? noteError.message : 'Unbekannter Fehler'
        }
      }
      
      setResults(prevResults => ({
        ...prevResults,
        directResults
      }))
    } catch (err) {
      setError(`Client-Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`)
      console.error('Fehler beim direkten API-Test:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Automatisch die Diagnose beim Laden ausführen
  useEffect(() => {
    runDiagnostics()
  }, [])
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zur Startseite
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">HubSpot API-Diagnose</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? 'Läuft...' : 'Server-Diagnose ausführen'}
        </button>
        
        <button
          onClick={testDirectAPICall}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? 'Läuft...' : 'Client-Diagnose ausführen'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          <strong>Fehler:</strong> {error}
        </div>
      )}
      
      {results && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnoseergebnisse</h2>
          
          <div className="space-y-6">
            {/* Server-Ergebnisse */}
            {results.results && (
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Server API-Testergebnisse</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium">Umgebungsvariablen:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.results.env, null, 2)}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Kontakte abrufen:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.results.tests.getContacts || {}, null, 2)}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Notiz erstellen:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.results.tests.createNote || {}, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Client-Ergebnisse */}
            {results.directResults && (
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Client API-Testergebnisse</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium">Token Preview:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs">
                    {results.directResults.tokenPreview}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Kontakte abrufen:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.directResults.tests.getContacts || {}, null, 2)}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Notiz erstellen:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.directResults.tests.createNote || {}, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 