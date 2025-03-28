import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protokolliere API-Anfragen für Debugging-Zwecke
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`API-Anfrage erhalten: ${request.method} ${request.nextUrl.pathname}`)
  }
  
  return NextResponse.next()
}

// Konfigurieren Sie die Middleware so, dass sie auf allen Pfaden ausgeführt wird
export const config = {
  matcher: [
    '/api/:path*', // Nur API-Routen überwachen
  ],
} 