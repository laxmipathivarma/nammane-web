'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BackButton from '@/components/BackButton'
import HubBackdrop from '@/components/HubBackdrop'
import TiltTile from '@/components/TiltTile'
import { useAuth } from '@/lib/AuthProvider'
import { emptyPokerEventData, type PokerEventData } from '@/lib/pokerLedger'
import { cardStyle } from '@/lib/eventCardStyle'
import type { InviteEventInfo } from '@/lib/invite'
import InvitationHub, { type InvitationSubTab } from '@/components/poker/InvitationHub'
import TablesHub from '@/components/poker/TablesHub'
import ExpensesHub from '@/components/poker/ExpensesHub'
import SettleHub from '@/components/poker/SettleHub'
import GamesHub from '@/components/poker/GamesHub'
import type { PokerTabKey } from '@/components/poker/types'

const pokerStyle = cardStyle.poker

const MENU: { tab: PokerTabKey; sub?: InvitationSubTab; label: string; hint: string; icon: string }[] = [
  { tab: 'invite', sub: 'create', label: 'Create Invitation', hint: 'Write the message guests get', icon: 'i-ticket' },
  { tab: 'invite', sub: 'preview', label: 'Preview the Invitation', hint: 'See exactly what guests see', icon: 'i-eye' },
  { tab: 'invite', sub: 'guests', label: 'Invite Guests', hint: 'Add numbers, send on WhatsApp', icon: 'i-chat' },
  { tab: 'invite', sub: 'approvals', label: 'Guest Approvals', hint: 'Approve guests onto a table', icon: 'i-check' },
  { tab: 'tables', label: 'Poker Tables', hint: 'Players, buy-ins, cash-outs', icon: 'i-seat' },
  { tab: 'expenses', label: 'Rake & Expenses', hint: 'Food, drinks, who paid', icon: 'i-coins' },
  { tab: 'settle', label: 'Settle Up', hint: 'Who pays whom, how much', icon: 'i-shield' },
  { tab: 'games', label: 'Games', hint: 'Full history, every table', icon: 'i-club' },
]

const TAB_LABELS: Record<PokerTabKey, string> = {
  menu: 'Poker host tools',
  invite: 'Invitation',
  tables: 'Poker Tables',
  expenses: 'Rake & Expenses',
  settle: 'Settle Up',
  games: 'Games',
}

export default function PokerHubPage() {
  const params = useParams<{ slug: string }>()
  const { user, loading: authLoading } = useAuth()

  const [data, setData] = useState<PokerEventData | null>(null)
  const [eventInfo, setEventInfo] = useState<InviteEventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [tab, setTab] = useState<PokerTabKey>('menu')
  const [invitationSub, setInvitationSub] = useState<InvitationSubTab>('create')
  const [activeTableId, setActiveTableId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setError('Sign in as the host to open poker tools.')
      setLoading(false)
      return
    }
    fetch(`/api/events/${params.slug}/poker`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Could not load poker data')
        setData({ ...emptyPokerEventData(), ...(j.data as PokerEventData) })
        setEventInfo(j.event as InviteEventInfo)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [params.slug, user, authLoading])

  const save = async (next: PokerEventData) => {
    setData(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/events/${params.slug}/poker`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: next }),
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

  if (loading)
    return (
      <div className="min-h-screen text-white flex items-center justify-center text-muted relative">
        <HubBackdrop category="poker" />
        Loading poker tools…
      </div>
    )
  if (error && !data)
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center gap-3 px-6 text-center relative">
        <HubBackdrop category="poker" />
        <div className="text-[13px] text-muted2 font-semibold">{error}</div>
        <BackButton fallbackHref="/discover" label="Back to Discover" />
      </div>
    )
  if (!data || !eventInfo) return null

  const goTab = (t: PokerTabKey) => setTab(t)

  const tabProps = {
    data,
    save,
    eventInfo,
    activeTableId,
    setActiveTableId,
    goTab,
  }

  return (
    <div className="min-h-screen text-white relative">
      <HubBackdrop category="poker" />
      <div className="max-w-2xl mx-auto px-5 pt-7 pb-28 relative">
        <div className="flex items-center gap-3 mb-6">
          {tab === 'menu' ? (
            <BackButton variant="circle" fallbackHref={`/event/${params.slug}`} label="Back" className="!w-8 !h-8 bg-ink2 border-0" />
          ) : (
            <button
              type="button"
              onClick={() => setTab('menu')}
              aria-label="Back to poker host tools"
              className="w-8 h-8 rounded-full bg-ink2 flex items-center justify-center shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(139,63,251,.18)', color: '#c9a8ff' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <use href="#i-spade" />
            </svg>
          </div>
          <h1 className="nm-marquee text-xl text-gold-text">{TAB_LABELS[tab]}</h1>
          {saving && <span className="text-[10.5px] text-muted2 font-semibold ml-auto">Saving…</span>}
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-[#3a1030] border border-[#ff4f9e]/40 px-3.5 py-3 text-[12px] font-semibold text-[#ff9ecb]">{error}</div>
        )}

        {tab === 'menu' && (
          <div className="grid grid-cols-2 gap-3.5">
            {MENU.map((item) => (
              <TiltTile
                key={item.label}
                icon={item.icon}
                label={item.label}
                hint={item.hint}
                style={pokerStyle}
                onClick={() => {
                  setTab(item.tab)
                  if (item.sub) setInvitationSub(item.sub)
                }}
              />
            ))}
          </div>
        )}

        {tab === 'invite' && <InvitationHub {...tabProps} sub={invitationSub} setSub={setInvitationSub} />}
        {tab === 'tables' && <TablesHub {...tabProps} />}
        {tab === 'expenses' && <ExpensesHub {...tabProps} />}
        {tab === 'settle' && <SettleHub {...tabProps} />}
        {tab === 'games' && <GamesHub {...tabProps} />}
      </div>
    </div>
  )
}
