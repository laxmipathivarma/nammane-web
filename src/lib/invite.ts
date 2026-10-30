// Invite-message + WhatsApp-link helpers, ported from lucky-poker's
// inviteText()/mapsLink()/waLink() (index.html). Builds the shareable
// message from the event's own fields instead of a separate "game" object.

export type InviteEventInfo = {
  title: string
  address: string | null
  startsAt: string | null
  lat: number | null
  lng: number | null
}

export function mapsLinkFor(e: InviteEventInfo): string | null {
  if (e.lat != null && e.lng != null) return `https://www.google.com/maps?q=${e.lat},${e.lng}`
  if (e.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`
  return null
}

function formatWhen(startsAt: string | null): string {
  if (!startsAt) return ''
  const d = new Date(startsAt)
  if (Number.isNaN(d.getTime())) return ''
  const date = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  return `${date} · ${time}`
}

// Builds the invite message from the structured "Create Invitation" form
// (title, date, time, venue, gate pass, notes, entry cost) instead of the
// bare event record -- used once a host has actually filled that form in;
// inviteText() below stays as the fallback for an event that hasn't.
export function inviteTextFromDetails(
  d: { title: string; date: string; time: string; venueName: string; venueAddress: string; gatePass: string; notesForPlayers: string; entryCost: string },
  guestName?: string
): string {
  const when =
    d.date &&
    (() => {
      const dt = new Date(d.time ? `${d.date}T${d.time}` : d.date)
      if (Number.isNaN(dt.getTime())) return ''
      const date = dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      const time = d.time ? dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : ''
      return time ? `${date} · ${time}` : date
    })()
  const venue = [d.venueName, d.venueAddress].filter(Boolean).join(' — ')
  const maps = d.venueAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.venueAddress)}` : null

  const lines = [
    `♠ *NamMane* · Where every hand feels like Vegas 🎰`,
    '',
    `Hey${guestName ? ` ${guestName}` : ''}! You're invited to a friendly evening of cards.`,
    '',
    `*${d.title || 'Poker Night'}*`,
  ]
  if (when) lines.push(`📅 ${when}`)
  if (venue) lines.push(`📍 ${venue}`)
  if (maps) lines.push(maps)
  if (d.gatePass) lines.push(`🎫 Gate pass: ${d.gatePass}`)
  if (d.entryCost) lines.push(`💰 Entry: ₹${d.entryCost}`)
  if (d.notesForPlayers) lines.push('', d.notesForPlayers)
  lines.push('', `See you at the table!`)
  return lines.join('\n')
}

export function inviteText(e: InviteEventInfo, guestName?: string): string {
  const m = mapsLinkFor(e)
  const when = formatWhen(e.startsAt)
  const lines = [
    `♠ *NamMane* · Where every hand feels like Vegas 🎰`,
    '',
    `Hey${guestName ? ` ${guestName}` : ''}! You're invited to a friendly evening of cards.`,
    '',
    `*${e.title}*`,
  ]
  if (when) lines.push(`📅 ${when}`)
  if (e.address) lines.push(`📍 ${e.address}`)
  if (m) lines.push(m)
  lines.push('', `See you at the table!`)
  return lines.join('\n')
}

// wa.me wants digits only (country code, no "+", no spaces/dashes). Treats
// a bare 10-digit number as Indian (Wave 1 is India-only everywhere else
// in the app) and leaves anything that already looks like it has a
// country code alone.
export function waDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^0+/, '')
  if (digits.length === 10) return `91${digits}`
  return digits
}

export function waLink(phone: string, text: string): string {
  const digits = waDigits(phone)
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(text)}`
}
