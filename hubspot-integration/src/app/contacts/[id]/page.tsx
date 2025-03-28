import { getContactById, getNotesByContactId } from '../../../../lib/hubspot'
import { NoteCard } from '../../../components/NoteCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import DirectForm from './DirectForm'
import ChatButton from './ChatButton'

interface ContactDetailPageProps {
  params: {
    id: string
  }
}

// Komponente für die Notizenliste
async function NotesSection({ contactId }: { contactId: string }) {
  const notes = await getNotesByContactId(contactId)
  
  return (
    <>
      {notes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-500">Noch keine Gesprächsnotizen vorhanden</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  )
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  // WICHTIG: Extrahieren Sie die ID auf sichere Weise für Next.js
  const contactId = String(params?.id || '')
  
  // Verwendung von String(...) stellt sicher, dass wir mit einem primitiven Typ arbeiten
  const contact = await getContactById(contactId)
  
  if (!contact) {
    notFound()
  }
  
  // Lade Notizen für den Chat
  const notes = await getNotesByContactId(contactId)

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/contacts" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Zurück zur Übersicht
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {contact.firstName} {contact.lastName}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Kontaktdaten</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email: </span>
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div>
                  <span className="font-medium">Telefon: </span>
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.company && (
                <div>
                  <span className="font-medium">Unternehmen: </span>
                  <span>{contact.company}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Zeitstempel</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Erstellt am: </span>
                <span>{new Date(contact.createdAt).toLocaleDateString('de-DE')}</span>
              </div>
              <div>
                <span className="font-medium">Letztes Update: </span>
                <span>{new Date(contact.lastModified).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gesprächsnotizen</h2>
          
          {/* Chat-Button nur anzeigen, wenn Notizen vorhanden sind */}
          {notes.length > 0 && <ChatButton notes={notes} />}
        </div>
        
        {/* Verbessertes Formular für Notizen */}
        <DirectForm contactId={contactId} />
        
        <Suspense fallback={<div className="text-center p-4">Notizen werden geladen...</div>}>
          <NotesSection contactId={contactId} />
        </Suspense>
      </div>
    </div>
  )
} 