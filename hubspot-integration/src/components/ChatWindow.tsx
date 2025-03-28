'use client'

import { useState, useRef, useEffect } from 'react'
import { Note } from '../../types'

interface ChatWindowProps {
  notes: Note[]
  isOpen: boolean
  onClose: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWindow({ notes, isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hallo! Ich kann Ihnen Informationen zu den Notizen dieses Kontakts geben. Was möchten Sie wissen?' 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Automatisches Scrollen zum Ende der Nachrichtenliste
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Wenn nicht geöffnet, nichts rendern
  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    // Benutzernachricht hinzufügen
    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // Alle Notizen in einen Text umwandeln für den Kontext
      const notesContext = notes.map(note => 
        `Notiz von ${note.createdBy} am ${new Date(note.createdAt).toLocaleDateString('de-DE')}: ${note.text}`
      ).join('\n\n')
      
      // API-Anfrage senden
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          notesContext
        })
      })
      
      if (!response.ok) {
        throw new Error(`Fehler: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Antwort hinzufügen
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message || 'Entschuldigung, ich konnte keine Antwort generieren.' 
      }])
    } catch (error) {
      console.error('Fehler bei der API-Anfrage:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h3 className="font-medium text-lg">Notizen-Assistent</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Nachrichten */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Eingabefeld */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stellen Sie eine Frage zu den Notizen..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 