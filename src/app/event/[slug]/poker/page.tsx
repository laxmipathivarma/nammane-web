'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BackButton from '@/components/BackButton'
import { useAuth } from '@/lib/AuthProvider'
import {
  calc,
  minTransfers,
  money,
  nameFor,
  settleNets,
  sumBuyins,
  type PokerLedger,
} from '@/lib/pokerLedger'
import { inviteText, mapsLinkFor, waLink, type InviteEventInfo } from '@/lib/invite'

const nid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)

export default function PokerLedgerPage() {
  const params = useParams<{ slug: string }>()
  const { user, loading: authLoading } = useAuth()

  const [ledger, setLedger] = useState<PokerLedger | null>(null)
  const [eventInfo, setEventInfo] = useState<InviteEventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [newName, setNewName] = useState('')
  const [buyAmt, setBuyAmt] = useState('1000')
  const [rakeAmt, setRakeAmt] = useState('')
  const [expLabel, setExpLabel] = useState('')
  const [expAmt, setExpAmt] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setError('Sign in as the host to open this ledger.')
      setLoading(false)
      return
    }
    fetch(`/api/events/${params.slug}/poker`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load ledger')
        setLedger(j.ledger as PokerLedger)
        setEventInfo(j.event as InviteEventInfo)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [params.slug, user, authLoading])

  const save = async (next: PokerLedger) => {
    setLedger(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/events/${params.slug}/poker`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ledger: next }),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error || 'Could not save')
      }
    } catch {
      setError('Could not reach the server to save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="nm-bg min-h-screen text-white flex items-center justify-center text-muted">Loading ledger…</div>
  if (error && !ledger)
    return (
      <div className="nm-bg min-h-screen text-white flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="text-[13px] text-muted2 font-semibold">{error}</div>
        <BackButton fallbackHref="/discover" label="Back to Discover" />
      </div>
    )
  if (!ledger) return null

  const g = ledger
  const c = calc(g)
  const nets = settleNets(g)
  const transfers = g.settle ? g.settle.list : nets ? minTransfers(nets) : []
  const groupMessage = eventInfo ? inviteText(eventInfo) : ''
  const mapsLink = eventInfo ? mapsLinkFor(eventInfo) : null

  const addInvitee = () => {
    if (!inviteName.trim()) return
    save({
      ...g,
      invitees: [...g.invitees, { id: nid(), name: inviteName.trim(), phone: invitePhone.trim() || undefined, invitedAt: null }],
    })
    setInviteName('')
    setInvitePhone('')
  }

  const removeInvitee = (id: string) => {
    save({ ...g, invitees: g.invitees.filter((inv) => inv.id !== id) })
  }

  const markInvited = (id: string) => {
    save({ ...g, invitees: g.invitees.map((inv) => (inv.id === id ? { ...inv, invitedAt: Date.now() } : inv)) })
  }

  const copyGroupMessage = async () => {
    try {
      await navigator.clipboard.writeText(groupMessage)
      setCopyStatus('Copied.')
    } catch {
      setCopyStatus('Could not copy -- select and copy manually.')
    }
    setTimeout(() => setCopyStatus(''), 2500)
  }

  const addPlayer = () => {
    if (!newName.trim()) return
    save({ ...g, players: [...g.players, { id: nid(), name: newName.trim(), buyins: [], out: null }] })
    setNewName('')
  }

  const addBuyIn = (pid: string) => {
    const amt = Number(buyAmt)
    if (!(amt > 0)) return
    save({
      ...g,
      players: g.players.map((p) =>
        p.id === pid
          ? { ...p, out: null, buyins: [...p.buyins, { id: nid(), amt, method: 'cash', at: Date.now() }] }
          : p
      ),
    })
  }

  const setCashOut = (pid: string, value: string) => {
    const amt = value === '' ? null : Number(value)
    save({ ...g, players: g.players.map((p) => (p.id === pid ? { ...p, out: amt } : p)) })
  }

  const removePlayer = (pid: string) => {
    save({ ...g, players: g.players.filter((p) => p.id !== pid) })
  }

  const addExpense = () => {
    const amt = Number(expAmt)
    if (!expLabel.trim() || !(amt > 0)) return
    save({
      ...g,
      expenses: [...g.expenses, { id: nid(), label: expLabel.trim(), amt, split: 'players', by: 'bank', at: Date.now() }],
    })
    setExpLabel('')
    setExpAmt('')
  }

  const doSettle = () => {
    if (!nets) return
    save({ ...g, settle: { at: Date.now(), list: minTransfers(nets) } })
  }

  const toggleDone = (i: number) => {
    if (!g.settle) return
    const list = g.settle.list.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t))
    save({ ...g, settle: { ...g.settle, list } })
  }

  return (
    <div className="nm-bg min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-5 pt-7 pb-28">
        <div className="flex items-center gap-3 mb-6">
          <BackButton variant="circle" fallbackHref={`/event/${params.slug}`} label="Back" className="!w-8 !h-8 bg-ink2 border-0" />
          <h1 className="nm-marquee text-xl text-gold-text">Poker · Ledger</h1>
          {saving && <span className="text-[10.5px] text-muted2 font-semibold ml-auto">Saving…</span>}
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-[#3a1030] border border-[#ff4f9e]/40 px-3.5 py-3 text-[12px] font-semibold text-[#ff9ecb]">
            {error}
          </div>
        )}

        {/* Invite -- ported from lucky-poker's "Invite" tab: a shareable
            message built from the event's own date/venue/maps link, sent
            per-person over WhatsApp, with who's been sent one tracked
            alongside the ledger. */}
        <div className="nm-field bg-ink2 mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="nm-label !mb-0">Invite players</label>
            {mapsLink && (
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-[#ff8fd1]">
                Check venue on Maps
              </a>
            )}
          </div>
          <pre className="text-[11.5px] text-muted font-medium whitespace-pre-wrap leading-relaxed bg-ink rounded-xl p-3 border border-white/10">
            {groupMessage}
          </pre>
          <div className="flex items-center gap-3">
            <button type="button" onClick={copyGroupMessage} className="nm-btn px-4 py-2 text-[11.5px] bg-ink text-white border border-white/10">
              Copy message
            </button>
            {copyStatus && <span className="text-[11px] text-muted2 font-semibold">{copyStatus}</span>}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              className="nm-field flex-1 !py-2 text-[12.5px]"
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
            <button type="button" onClick={addInvitee} className="nm-btn nm-btn-gold px-4 text-[12.5px]">
              Invite
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {g.invitees.length === 0 && <div className="text-[12px] text-muted2 font-semibold">Nobody invited yet.</div>}
            {g.invitees.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-2 bg-ink rounded-xl border border-white/10 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="font-bold text-[12.5px] truncate">{inv.name}</div>
                  {inv.phone && <div className="text-[11px] text-muted2 font-semibold">{inv.phone}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {inv.invitedAt ? (
                    <span className="text-[11px] font-bold text-[#7fe3a1]">Invited ✓</span>
                  ) : inv.phone ? (
                    <a
                      href={waLink(inv.phone, inviteText(eventInfo as InviteEventInfo, inv.name))}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markInvited(inv.id)}
                      className="nm-btn px-3 py-1.5 text-[11px] bg-ink2 text-white border border-white/10"
                    >
                      Send on WhatsApp
                    </a>
                  ) : (
                    <button type="button" onClick={() => markInvited(inv.id)} className="nm-btn px-3 py-1.5 text-[11px] bg-ink2 text-white border border-white/10">
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

        {/* Add player */}
        <label className="nm-label">Add a player</label>
        <div className="flex gap-2 mb-6">
          <input
            className="nm-field flex-1"
            placeholder="Player name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button type="button" onClick={addPlayer} className="nm-btn nm-btn-gold px-5">
            Add
          </button>
        </div>

        {/* Players table */}
        <label className="nm-label">Players ({g.players.length})</label>
        <div className="flex flex-col gap-2.5 mb-6">
          {g.players.length === 0 && <div className="text-[12px] text-muted2 font-semibold">No players yet.</div>}
          {g.players.map((p) => {
            const b = sumBuyins(p)
            const res = p.out == null ? null : p.out - b
            return (
              <div key={p.id} className="nm-field bg-ink2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-[13px]">{p.name}</div>
                  <button type="button" onClick={() => removePlayer(p.id)} className="text-[10.5px] text-muted2 font-semibold hover:text-[#ff9ecb]">
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[11.5px] text-muted font-semibold">
                  <span>Bought in {money(b, g.currency)}</span>
                  <span>
                    {p.out == null ? (
                      <span className="text-gold-text">Playing</span>
                    ) : (
                      <span className={res != null && res >= 0 ? 'text-[#7fe3a1]' : 'text-[#ff9ecb]'}>
                        {res != null && res >= 0 ? '+' : ''}
                        {res != null ? money(res, g.currency) : ''}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => addBuyIn(p.id)} className="nm-btn px-3 py-2 text-[11px] bg-ink text-white border border-white/10">
                    + Buy-in {money(Number(buyAmt) || 0, g.currency)}
                  </button>
                  <input
                    type="number"
                    placeholder="Cash out"
                    defaultValue={p.out ?? ''}
                    onBlur={(e) => setCashOut(p.id, e.target.value)}
                    className="nm-field flex-1 !py-2 text-[12px]"
                  />
                </div>
              </div>
            )
          })}
        </div>
        <label className="nm-label">Default buy-in amount</label>
        <input
          type="number"
          className="nm-field mb-6"
          value={buyAmt}
          onChange={(e) => setBuyAmt(e.target.value)}
        />

        {/* Rake + expenses */}
        <label className="nm-label">Rake taken</label>
        <input
          type="number"
          className="nm-field mb-4"
          placeholder="0"
          value={rakeAmt || g.rake || ''}
          onChange={(e) => setRakeAmt(e.target.value)}
          onBlur={() => save({ ...g, rake: Number(rakeAmt) || 0 })}
        />

        <label className="nm-label">Shared expenses (split across all players)</label>
        <div className="flex gap-2 mb-2">
          <input className="nm-field flex-1" placeholder="e.g. Snacks" value={expLabel} onChange={(e) => setExpLabel(e.target.value)} />
          <input type="number" className="nm-field w-28" placeholder="Amount" value={expAmt} onChange={(e) => setExpAmt(e.target.value)} />
          <button type="button" onClick={addExpense} className="nm-btn px-4 bg-ink2 text-white border border-white/10">
            Add
          </button>
        </div>
        <div className="flex flex-col gap-1.5 mb-6">
          {g.expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between text-[12px] text-muted font-semibold">
              <span>{e.label}</span>
              <span>{money(e.amt, g.currency)}</span>
            </div>
          ))}
        </div>

        {/* House summary */}
        <div className="nm-field bg-ink2 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] text-muted2 font-bold uppercase">Total buy-ins</div>
              <div className="text-[15px] font-extrabold">{money(c.B, g.currency)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted2 font-bold uppercase">Rake</div>
              <div className="text-[15px] font-extrabold">{money(c.R, g.currency)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted2 font-bold uppercase">House keeps</div>
              <div className="text-[15px] font-extrabold text-gold-text">{money(c.house, g.currency)}</div>
            </div>
          </div>
        </div>

        {/* Settle up */}
        <label className="nm-label">Settle up</label>
        {!c.allOut || c.n === 0 ? (
          <div className="text-[12px] text-muted2 font-semibold mb-4">
            Settle up unlocks once every player has a cash-out amount entered.
          </div>
        ) : (
          <>
            <button type="button" onClick={doSettle} className="nm-btn nm-btn-gold w-full py-3 text-[13px] mb-3">
              {g.settle ? 'Recalculate settle-up' : 'Calculate settle-up'}
            </button>
            <div className="flex flex-col gap-2 mb-6">
              {transfers.length === 0 && <div className="text-[12px] text-muted2 font-semibold">Everyone is already square.</div>}
              {transfers.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDone(i)}
                  className={`nm-field flex items-center justify-between text-left ${t.done ? 'opacity-50' : ''}`}
                >
                  <div className="text-[12.5px] font-bold">
                    {nameFor(g, t.from)} → {nameFor(g, t.to)}
                  </div>
                  <div className="text-[13px] font-extrabold text-gold-text">{money(t.amt, g.currency)}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
