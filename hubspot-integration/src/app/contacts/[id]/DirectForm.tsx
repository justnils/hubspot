'use client'

import { useState } from 'react'

interface DirectFormProps {
  contactId: string
}

export default function DirectForm({ contactId }: DirectFormProps) {
  const [text, setText] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text || !createdBy) {
      setError('Bitte füllen Sie alle Felder aus.')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Statt direktem HubSpot-API-Aufruf, verwenden wir unsere eigene API-Route
      const response = await fetch('/api/notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId,
          text,
          createdBy
        })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        const errorMessage = data.error || `Fehler: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }
      
      // Erfolg anzeigen und Formular zurücksetzen
      setSuccess(true)
      setText('')
      setCreatedBy('')
      
      // Kurz warten und dann neu laden
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Notiz:", err)
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler"
      setError(`Fehler: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-primary">
      <h3 className="text-lg font-medium text-primary mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Notiz hinzufügen
      </h3>
      
      {success && (
        <div className="p-4 mb-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700">Notiz erfolgreich hinzugefügt! Seite wird aktualisiert...</span>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-dark mb-1">Ihre Notiz</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light"
            rows={4}
            placeholder="Geben Sie hier Ihre Notiz ein..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-dark mb-1">Ihr Name</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light"
            placeholder="Bitte geben Sie Ihren Namen ein"
            required
          />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {contactId}</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-medium shadow-sm transition-colors duration-300 flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Notiz hinzufügen
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}