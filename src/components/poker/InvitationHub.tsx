'use client'

import { useEffect, useState } from 'react'
import { emptyInvitationDetails, newId, type Invitee, type InvitationDetails } from '@/lib/pokerLedger'
import { inviteText, inviteTextFromDetails, waLink } from '@/lib/invite'
import type { PokerTabProps } from './types'

export type InvitationSubTab = 'create' | 'preview' | 'guests' | 'approvals'
type SubTab = InvitationSubTab

const subTabs: { key: SubTab; label: string }[] = [
  { key: 'create', label: 'Create Invitation' },
  { key: 'preview', label: 'Preview' },
  { key: 'guests', label: 'Invite Guests' },
  { key: 'approvals', label: 'Guest Approvals' },
]

// The event's own title/date/address (set once at /host/create) seed the
// form the first time a host opens Create Invitation, so they aren't
// retyping what they already told us -- after that, whatever's saved in
// data.invitationDetails wins.
function seedFromEvent(eventInfo: PokerTabProps['eventInfo']): InvitationDetails {
  const d = eventInfo.startsAt ? new Date(eventInfo.startsAt) : null
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    ...emptyInvitationDetails(),
    title: eventInfo.title ?? '',
    date: d && !Number.isNaN(d.getTime()) ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '',
    time: d && !Number.isNaN(d.getTime()) ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : '',
    venueAddress: eventInfo.address ?? '',
  }
}

export default function InvitationHub({
  data,
  save,
  eventInfo,
  goTab,
  sub,
  setSub,
}: PokerTabProps & { sub: SubTab; setSub: (s: SubTab) => void }) {
  const [details, setDetails] = useState<InvitationDetails>(data.invitationDetails ?? seedFromEvent(eventInfo))
  const [savedStatus, setSavedStatus] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [contactPickerSupported, setContactPickerSupported] = useState(false)

  useEffect(() => {
    if (data.invitationDetails) setDetails(data.invitationDetails)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.invitationDetails])

  useEffect(() => {
    const nav = navigator as unknown as { contacts?: { select?: unknown } }
    setContactPickerSupported(!!(nav.contacts && typeof nav.contacts.select === 'function'))
  }, [])

  // Once the host has actually filled this form in, the message is built
  // from it; before that, fall back to the bare event record so Preview
  // never shows completely empty.
  const defaultMessage = inviteText(eventInfo)
  const effectiveMessage =
    data.invitationMessage ?? (data.invitationDetails ? inviteTextFromDetails(data.invitationDetails) : defaultMessage)

  const field = (k: keyof InvitationDetails, v: string) => setDetails((d) => ({ ...d, [k]: v }))

  const createInvitation = () => {
    save({ ...data, invitationDetails: details, invitationMessage: inviteTextFromDetails(details) })
    setSavedStatus('Invitation created.')
    setTimeout(() => setSavedStatus(''), 2000)
    setSub('preview')
  }

  const findOnMaps = () => {
    const q = details.venueAddress || details.venueName
    window.open(q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : 'https://www.google.com/maps', '_blank', 'noopener,noreferrer')
  }

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(effectiveMessage)
      setCopyStatus('Copied.')
    } catch {
      setCopyStatus('Could not copy -- select and copy manually.')
    }
    setTimeout(() => setCopyStatus(''), 2500)
  }

  const pickContact = async () => {
    try {
      const nav = navigator as unknown as {
        contacts: { select: (props: string[], opts: { multiple: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>> }
      }
      const picked = await nav.contacts.select(['name', 'tel'], { multiple: false })
      const c = picked[0]
      if (c) {
        if (c.name?.[0]) setInviteName(c.name[0])
        if (c.tel?.[0]) setInvitePhone(c.tel[0])
      }
    } catch {
      // user cancelled the picker, or the browser refused -- nothing to do
    }
  }

  const addInvitee = () => {
    if (!inviteName.trim()) return
    const next: Invitee = { id: newId(), name: inviteName.trim(), phone: invitePhone.trim() || undefined, invitedAt: null }
    save({ ...data, invitees: [...data.invitees, next] })
    setInviteName('')
    setInvitePhone('')
  }

  const removeInvitee = (id: string) => save({ ...data, invitees: data.invitees.filter((i) => i.id !== id) })
  const markInvited = (id: string) =>
    save({ ...data, invitees: data.invitees.map((i) => (i.id === id ? { ...i, invitedAt: Date.now() } : i)) })

  const approve = (id: string, tableId: string) => {
    const invitee = data.invitees.find((i) => i.id === id)
    if (!invitee) return
    const tables = data.tables.map((t) =>
      t.id === tableId
        ? {
            ...t,
            ledger: {
              ...t.ledger,
              players: [...t.ledger.players, { id: newId(), name: invitee.name, phone: invitee.phone, buyins: [], out: null }],
            },
          }
        : t
    )
    save({
      ...data,
      tables,
      invitees: data.invitees.map((i) => (i.id === id ? { ...i, approved: true, tableId } : i)),
    })
  }

  return (
    <div>
      <div className="flex gap-1.5 bg-ink2 rounded-full p-1 mb-5 overflow-x-auto">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSub(t.key)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-[11.5px] font-extrabold transition-colors ${
              sub === t.key ? 'bg-gradient-to-b from-gold-light via-gold to-gold-dark text-white' : 'text-muted2'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === 'create' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="nm-label">Title</label>
            <input className="nm-field" placeholder="e.g. High Stakes Friday" value={details.title} onChange={(e) => field('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="nm-label">Date</label>
              <input type="date" className="nm-field" value={details.date} onChange={(e) => field('date', e.target.value)} />
            </div>
            <div>
              <label className="nm-label">Time</label>
              <input type="time" className="nm-field" value={details.time} onChange={(e) => field('time', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="nm-label">Venue name</label>
            <input className="nm-field" placeholder="e.g. Rahul's Terrace" value={details.venueName} onChange={(e) => field('venueName', e.target.value)} />
          </div>

          <div>
            <label className="nm-label">Venue address</label>
            <textarea
              className="nm-field resize-none"
              rows={2}
              placeholder="Add the address manually, or find it on Google Maps first"
              value={details.venueAddress}
              onChange={(e) => field('venueAddress', e.target.value)}
            />
            <button type="button" onClick={findOnMaps} className="nm-btn mt-2 px-3.5 py-2 text-[11.5px] bg-ink2 text-white border border-white/10 flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" stroke="#5fd0ff" fill="none"><use href="#i-pin" /></svg>
              Find on Google Maps
            </button>
            <p className="text-[10.5px] text-muted2 font-medium mt-1.5">
              Opens Google Maps in a new tab to search and confirm the exact spot -- copy the address back here, or just type it directly.
            </p>
          </div>

          <div>
            <label className="nm-label">Venue gate pass (optional)</label>
            <input className="nm-field" placeholder="e.g. Flat 4B, tell security you're here for Poker Night" value={details.gatePass} onChange={(e) => field('gatePass', e.target.value)} />
          </div>

          <div>
            <label className="nm-label">Notes for players</label>
            <textarea
              className="nm-field resize-none"
              rows={2}
              placeholder="BYO snacks, chips only, no real-money wagering…"
              value={details.notesForPlayers}
              onChange={(e) => field('notesForPlayers', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="nm-label">Event entry cost (optional)</label>
              <div className="nm-field flex items-center gap-1.5">
                <span className="text-muted2 font-bold">₹</span>
                <input
                  type="number"
                  className="bg-transparent outline-none w-full"
                  placeholder="Leave blank if free"
                  value={details.entryCost}
                  onChange={(e) => field('entryCost', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="nm-label">No. of invites</label>
              <input
                type="number"
                min={0}
                className="nm-field"
                placeholder="e.g. 10"
                value={details.numInvites}
                onChange={(e) => field('numInvites', e.target.value)}
              />
            </div>
          </div>

          <button type="button" onClick={createInvitation} className="nm-btn nm-btn-gold w-full py-3.5 text-[13.5px] mt-1">
            Create invitation
          </button>
          {savedStatus && <span className="text-[11px] text-muted2 font-semibold text-center">{savedStatus}</span>}
        </div>
      )}

      {sub === 'preview' && (
        <div className="flex flex-col gap-3">
          <label className="nm-label">What guests will see</label>
          {/* styled like a WhatsApp message bubble so "preview" means what it says */}
          <div className="rounded-2xl rounded-tl-sm bg-[#0b2e1f] border border-[#1f5c3d] p-4 max-w-[420px]">
            <pre className="text-[12.5px] text-[#e3f6ea] font-medium whitespace-pre-wrap leading-relaxed">{effectiveMessage}</pre>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={copyMessage} className="nm-btn px-4 py-2 text-[11.5px] bg-ink2 text-white border border-white/10">
              Copy message
            </button>
            <button type="button" onClick={() => setSub('create')} className="text-[11.5px] font-bold text-[#ff8fd1]">
              Edit invitation details
            </button>
            {copyStatus && <span className="text-[11px] text-muted2 font-semibold">{copyStatus}</span>}
          </div>
        </div>
      )}

      {sub === 'guests' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="nm-label">Add a guest</label>
            <div className="flex gap-2 flex-wrap">
              <input
                className="nm-field flex-1 min-w-[140px] !py-2 text-[12.5px]"
                placeholder="Name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
              <input
                className="nm-field w-36 !py-2 text-[12.5px]"
                placeholder="Mobile number"
                value={invitePhone}
                onChange={(e) => setInvitePhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addInvitee()}
              />
              {contactPickerSupported && (
                <button
                  type="button"
                  onClick={pickContact}
                  className="nm-btn px-3.5 py-2 text-[11.5px] bg-ink2 text-white border border-white/10"
                >
                  Add from contacts
                </button>
              )}
              <button type="button" onClick={addInvitee} className="nm-btn nm-btn-gold px-4 text-[12.5px]">
                Add
              </button>
            </div>
            {!contactPickerSupported && (
              <p className="text-[11px] text-muted2 font-medium mt-1.5">
                Contact-book picking isn&apos;t available on this device -- type the name and number instead.
              </p>
            )}
          </div>

          <div>
            <label className="nm-label">Guests ({data.invitees.length})</label>
            <div className="flex flex-col gap-2">
              {data.invitees.length === 0 && <div className="text-[12px] text-muted2 font-semibold">Nobody added yet.</div>}
              {data.invitees.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between gap-2 bg-ink2 rounded-xl border border-white/10 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="font-bold text-[12.5px] truncate">{inv.name}</div>
                    {inv.phone && <div className="text-[11px] text-muted2 font-semibold">{inv.phone}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {inv.invitedAt ? (
                      <span className="text-[11px] font-bold text-[#7fe3a1]">Invited ✓</span>
                    ) : inv.phone ? (
                      <a
                        href={waLink(
                          inv.phone,
                          data.invitationMessage ??
                            (data.invitationDetails ? inviteTextFromDetails(data.invitationDetails, inv.name) : inviteText(eventInfo, inv.name))
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markInvited(inv.id)}
                        className="nm-btn px-3 py-1.5 text-[11px] bg-ink text-white border border-white/10"
                      >
                        Send invitation
                      </a>
                    ) : (
                      <button type="button" onClick={() => markInvited(inv.id)} className="nm-btn px-3 py-1.5 text-[11px] bg-ink text-white border border-white/10">
                        Mark invited
                      </button>
                    )}
                    <button type="button" onClick={() => removeInvitee(inv.id)} className="text-[10.5px] text-muted2 font-semibold hover:text-[#ff9ecb]">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {sub === 'approvals' && (
        <div className="flex flex-col gap-2.5">
          {data.invitees.length === 0 && <div className="text-[12px] text-muted2 font-semibold">No guests to approve yet -- add some under Invite Guests.</div>}
          {data.invitees.map((inv) => {
            const seatedTable = inv.tableId ? data.tables.find((t) => t.id === inv.tableId) : null
            return (
              <div key={inv.id} className="bg-ink2 rounded-xl border border-white/10 px-3 py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-[12.5px] truncate">{inv.name}</div>
                  <div className="text-[11px] text-muted2 font-semibold">
                    {inv.invitedAt ? 'Invited' : 'Not invited yet'}
                    {inv.phone ? ` · ${inv.phone}` : ''}
                  </div>
                </div>
                {inv.approved ? (
                  <span className="text-[11px] font-bold text-[#7fe3a1] shrink-0">
                    Seated{seatedTable ? ` at ${seatedTable.name}` : ''} ✓
                  </span>
                ) : data.tables.length === 0 ? (
                  <button type="button" onClick={() => goTab('tables')} className="nm-btn px-3 py-1.5 text-[11px] bg-ink text-white border border-white/10 shrink-0">
                    Add a table first
                  </button>
                ) : (
                  <ApproveControl tableOptions={data.tables} onApprove={(tableId) => approve(inv.id, tableId)} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ApproveControl({ tableOptions, onApprove }: { tableOptions: { id: string; name: string }[]; onApprove: (tableId: string) => void }) {
  const [tableId, setTableId] = useState(tableOptions[0]?.id ?? '')
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <select
        value={tableId}
        onChange={(e) => setTableId(e.target.value)}
        className="nm-field !py-1.5 !px-2 text-[11px] w-28"
      >
        {tableOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => tableId && onApprove(tableId)} className="nm-btn nm-btn-gold px-3 py-1.5 text-[11px]">
        Approve
      </button>
    </div>
  )
}
