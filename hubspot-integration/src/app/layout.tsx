import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "justnils hubspot zauber",
  description: "Verwaltung von Kontakten und Gesprächsnotizen mit HubSpot CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary-light min-h-screen`}
      >
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          {children}
        </main>
        
        {/* Debug-Link - nur in Entwicklungsumgebung */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="fixed bottom-4 right-4">
            <a 
              href="/diagnose" 
              className="bg-primary text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-opacity-90 transition-all duration-300"
              title="API-Diagnose"
            >
              API-Diagnose
            </a>
          </div>
        )}
        
        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-primary text-white py-2 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <p>© 2024 justnils hubspot zauber</p>
            <p className="text-sm">Kontakte und Notizen einfach verwalten</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
