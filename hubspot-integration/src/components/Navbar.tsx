'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
      ? 'text-white border-b-2 border-white font-medium'
      : 'text-primary-light hover:text-white transition-colors duration-200'
  }

  return (
    <nav className="bg-gradient-to-r from-primary to-primary-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="bg-white p-1.5 rounded-lg mr-3 group-hover:rotate-12 transition-transform duration-300">
                  <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">justnils hubspot zauber</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
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
          
          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-primary-dark bg-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              HubSpot Magie
            </span>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Menü öffnen</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-dark">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/' ? 'bg-primary text-white' : 'text-primary-light hover:bg-primary hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/contacts"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/contacts') ? 'bg-primary text-white' : 'text-primary-light hover:bg-primary hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontakte
            </Link>
            <div className="pt-4 pb-2">
              <div className="flex items-center px-3">
                <span className="text-primary-dark bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  HubSpot Magie
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 