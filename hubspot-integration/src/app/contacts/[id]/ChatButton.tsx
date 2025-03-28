'use client'

import { useState } from 'react'
import { Note } from '../../../../types'
import ChatWindow from '../../../components/ChatWindow'

interface ChatButtonProps {
  notes: Note[]
}

export default function ChatButton({ notes }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        Notizen-Assistent
      </button>
      
      <ChatWindow 
        notes={notes} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  )
} 