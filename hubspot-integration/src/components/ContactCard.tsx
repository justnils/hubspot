'use client'

import { Contact } from '../../types'
import Link from 'next/link'

interface ContactCardProps {
  contact: Contact
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <Link href={`/contacts/${contact.id}`}>
      <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300 border-l-4 border-primary transform hover:-translate-y-1 h-full">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-medium text-lg mr-4">
            {`${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {contact.firstName} {contact.lastName}
            </h3>
            <div className="text-sm text-secondary-dark mt-1">
              {contact.company && (
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {contact.company}
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-auto">
            <div className="px-3 py-1 bg-primary-light bg-opacity-10 text-primary rounded-full text-xs">
              ID: {contact.id.substring(0, 6)}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 pl-16">
          {contact.email && (
            <div className="flex items-center text-sm text-secondary-dark">
              <svg className="w-4 h-4 mr-2 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {contact.email}
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center text-sm text-secondary-dark">
              <svg className="w-4 h-4 mr-2 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {contact.phone}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
} 