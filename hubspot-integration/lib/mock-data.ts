import { Contact, Note } from '../types'

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 123 45678900',
    company: 'Muster GmbH',
    createdAt: '2023-01-15T10:30:00Z',
    lastModified: '2023-03-20T14:45:00Z'
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'anna.schmidt@example.com',
    phone: '+49 123 45678901',
    company: 'Schmidt AG',
    createdAt: '2023-02-10T09:15:00Z',
    lastModified: '2023-03-18T11:20:00Z'
  },
  {
    id: '3',
    firstName: 'Thomas',
    lastName: 'Weber',
    email: 'thomas.weber@example.com',
    createdAt: '2023-03-05T13:45:00Z',
    lastModified: '2023-03-15T16:30:00Z'
  }
]

export const mockNotes: Note[] = [
  {
    id: '101',
    contactId: '1',
    text: 'Interessiert an unserem Premium-Paket. Nachfassen in einer Woche.',
    createdAt: '2023-03-10T10:30:00Z',
    createdBy: 'Sabine Müller'
  },
  {
    id: '102',
    contactId: '1',
    text: 'Hat nach Rabatten gefragt. Benötigt ein individuelles Angebot.',
    createdAt: '2023-03-20T14:45:00Z',
    createdBy: 'Michael Klein'
  },
  {
    id: '103',
    contactId: '2',
    text: 'Möchte mehr Informationen über unser Enterprise-Angebot.',
    createdAt: '2023-03-18T11:20:00Z',
    createdBy: 'Sabine Müller'
  }
] 