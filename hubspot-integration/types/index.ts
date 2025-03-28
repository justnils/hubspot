export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  createdAt: string
  lastModified: string
}

export interface Note {
  id: string
  contactId: string
  text: string
  createdAt: string
  createdBy: string
} 