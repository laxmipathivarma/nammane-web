import type { EventCategory } from './eventCardStyle'

export type User = {
  id: string
  email?: string
  phone_number?: string
  display_name?: string
  avatar_url?: string
  city?: string
  created_at: string
}

export type Event = {
  id: string
  host_id: string
  category: EventCategory
  title: string
  description?: string
  starts_at: string
  capacity: number
  contribution_amount?: number
  status: 'draft' | 'published' | 'cancelled'
  created_at: string
}

export type Booking = {
  id: string
  event_id: string
  guest_id: string
  status: 'requested' | 'approved' | 'rejected' | 'cancelled' | 'attended'
  created_at: string
}
