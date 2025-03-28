'use client'

import { Note } from '../../types'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  // Funktion zum Entfernen von HTML-Tags aus dem Text mit Regex
  // Diese Methode funktioniert sowohl auf Server als auch Client
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, '') // Entfernt HTML-Tags
      .replace(/&nbsp;/g, ' ') // Ersetzt &nbsp; durch Leerzeichen
      .replace(/&amp;/g, '&')  // Ersetzt &amp; durch &
      .replace(/&lt;/g, '<')   // Ersetzt &lt; durch <
      .replace(/&gt;/g, '>')   // Ersetzt &gt; durch >
  }

  // Formatiere das Datum für die Anzeige
  const formattedDate = new Date(note.createdAt).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-primary-light p-5 mb-4 transition-transform hover:scale-[1.01] hover:shadow-lg">
      <div className="relative">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium mr-3">
            {note.createdBy.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-primary">{note.createdBy}</div>
            <div className="text-xs text-secondary-dark">{formattedDate}</div>
          </div>
        </div>
        <div className="pl-13">
          <p className="text-secondary-dark whitespace-pre-wrap leading-relaxed">
            {stripHtml(note.text)}
          </p>
        </div>
        
        <div className="absolute top-0 right-0">
          <div className="bg-primary-light bg-opacity-10 px-2 py-1 rounded-full text-xs text-primary">
            Notiz #{note.id.substring(0, 6)}
          </div>
        </div>
      </div>
    </div>
  )
} 