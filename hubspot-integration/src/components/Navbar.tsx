'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
      ? 'text-primary-light border-b-2 border-primary-light font-medium'
      : 'text-white hover:text-primary-light transition-colors duration-200'
  }

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <svg className="h-8 w-8 text-primary-light mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xl font-bold text-white">justnils hubspot zauber</span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-2 pt-1 ${isActive('/')}`}
              >
                Dashboard
              </Link>
              <Link
                href="/contacts"
                className={`inline-flex items-center px-2 pt-1 ${isActive('/contacts')}`}
              >
                Kontakte
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex items-center">
            <span className="text-white bg-primary-light px-3 py-1 rounded-full text-sm font-medium">
              HubSpot Magie
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
} 