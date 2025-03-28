'use client'

import { useState } from 'react'

interface AddNoteFormProps {
  contactId: string
}

export function AddNoteForm({ contactId }: AddNoteFormProps) {
  const [text, setText] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Bitte geben Sie einen Text ein')
      return
    }
    
    if (!createdBy.trim()) {
      setError('Bitte geben Sie Ihren Namen ein')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    try {
      console.log('Sende Notiz-Daten:', { contactId, text, createdBy })
      
      // Absolute URL zum API-Endpunkt verwenden
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          text,
          createdBy
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('API-Fehlerantwort:', data)
        throw new Error(data.error || 'Fehler beim Erstellen der Notiz')
      }

      console.log('Erfolgreich gespeichert:', data)
      
      setText('')
      setCreatedBy('')
      setSuccess(true)
      
      // Warte kurz, bevor die Seite neu geladen wird
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(`Fehler beim Speichern der Notiz: ${errorMessage}`)
      console.error('Fehler beim Erstellen der Notiz:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Neue Notiz hinzufügen</h3>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          Notiz erfolgreich gespeichert! Seite wird aktualisiert...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="noteText" className="block text-sm font-medium text-gray-700 mb-1">
            Notiz
          </label>
          <textarea
            id="noteText"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ihre Gesprächsnotiz..."
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="noteAuthor" className="block text-sm font-medium text-gray-700 mb-1">
            Ihr Name
          </label>
          <input
            id="noteAuthor"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            placeholder="Ihr Name"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gespeichert...' : 'Notiz speichern'}
          </button>
        </div>
      </form>
    </div>
  )
} 