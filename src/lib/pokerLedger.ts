// Poker ledger math, ported from laxmipathivarma/lucky-poker (poker.nammane.in)
// -- specifically its `calc()`/`settleNets()`/`minTransfers()` functions in
// index.html. This is the core of what made that app useful: buy-ins,
// cash-outs, shared expenses and a minimum-transfer settle-up, now stored
// on `events.event_details` (JSONB) for category='poker' events instead
// of a separate Apps Script + Google Sheet backend. Not ported: multi-table
// seating, dealer-bonus splitting, the Google Sheet export, and the
// email-OTP player accounts (Nammane already has its own auth) --
// everything that made an event a *poker* event, not everything about the
// standalone app's own account/sync system.

export type BuyIn = { id: string; amt: number; method: 'cash' | 'upi' | 'credit'; at: number }
export type Expense = {
  id: string
  label: string
  amt: number
  split: 'players' | 'bank'
  by: string // player id or 'bank'
  at: number
}
export type PokerPlayer = {
  id: string
  name: string
  phone?: string
  buyins: BuyIn[]
  out: number | null // cash-out amount, null while still playing
}
export type Transfer = { from: string; to: string; amt: number; done: boolean }
// Invite list, ported from lucky-poker's "Invite" tab (index.html's
// invitees/invList/inviteText) -- host adds people by name + phone, sends
// each a WhatsApp message built from the event's own details, and the app
// just tracks who's been sent one. Not ported: the player-side RSVP
// (accept/decline) that lucky-poker tracks through its own phone-based
// player accounts -- Nammane already has its own join/approve flow for
// that, so an invite here is "I sent this person a message" rather than a
// tracked yes/no.
export type Invitee = { id: string; name: string; phone?: string; invitedAt: number | null }
export type PokerLedger = {
  currency: string
  players: PokerPlayer[]
  rake: number
  expenses: Expense[]
  settle: { at: number; list: Transfer[] } | null
  invitees: Invitee[]
}

export function emptyLedger(): PokerLedger {
  return { currency: '₹', players: [], rake: 0, expenses: [], settle: null, invitees: [] }
}

const r2 = (n: number) => Math.round(n * 100) / 100
export const sumBuyins = (p: PokerPlayer) => p.buyins.reduce((a, b) => a + b.amt, 0)

export function calc(g: PokerLedger) {
  const ps = g.players
  const n = ps.length
  const B = ps.reduce((a, p) => a + sumBuyins(p), 0)
  const pExp = g.expenses.filter((e) => e.split === 'players').reduce((a, e) => a + e.amt, 0)
  const bankExp = g.expenses.filter((e) => e.split === 'bank').reduce((a, e) => a + e.amt, 0)
  const share = n ? pExp / n : 0
  const outs = ps.filter((p) => p.out != null)
  const C = outs.reduce((a, p) => a + (p.out as number), 0)
  const allOut = n > 0 && outs.length === n

  const rows = ps.map((p) => {
    const b = sumBuyins(p)
    const paid = g.expenses.filter((e) => e.by === p.id).reduce((a, e) => a + e.amt, 0)
    const c = p.out
    const res = c == null ? null : c - b
    return { p, b, paid, c, res, share, final: res == null ? null : r2(res - share) }
  })

  const house = r2(-rows.reduce((a, r) => a + (r.c == null ? 0 : r.c - r.b - share + r.paid), 0) - g.rake - bankExp)

  return { n, B, R: g.rake, pExp, bankExp, share, C, allOut, rows, house }
}

export type NetParty = { id: string; name: string; net: number }

// Each player's net = cash-out - bought-in - expense share + expenses they
// fronted. "Bank" (the house/rake pot) absorbs whatever that leaves
// unbalanced -- rake taken and bank-paid expenses -- so the whole set of
// nets always sums to zero before minTransfers runs.
export function settleNets(g: PokerLedger): NetParty[] | null {
  const c = calc(g)
  if (!c.n || !c.allOut) return null
  const P: NetParty[] = c.rows.map((r) => ({
    id: r.p.id,
    name: r.p.name,
    net: r2((r.c as number) - r.b - r.share + r.paid),
  }))
  const bankNet = r2(-P.reduce((a, x) => a + x.net, 0) - c.R - c.bankExp)
  if (Math.abs(bankNet) >= 0.005) P.push({ id: 'bank', name: 'Bank / host', net: bankNet })
  return P
}

// Greedy largest-creditor-to-largest-debtor matching -- minimizes the
// number of payments needed to settle everyone up.
export function minTransfers(P: NetParty[]): Transfer[] {
  const cr = P.filter((x) => x.net > 0.004)
    .map((x) => ({ id: x.id, v: x.net }))
    .sort((a, b) => b.v - a.v)
  const db = P.filter((x) => x.net < -0.004)
    .map((x) => ({ id: x.id, v: -x.net }))
    .sort((a, b) => b.v - a.v)
  const out: Transfer[] = []
  let i = 0
  let j = 0
  while (i < db.length && j < cr.length) {
    const a = Math.min(db[i].v, cr[j].v)
    if (a >= 0.005) out.push({ from: db[i].id, to: cr[j].id, amt: r2(a), done: false })
    db[i].v -= a
    cr[j].v -= a
    if (db[i].v < 0.005) i++
    if (cr[j].v < 0.005) j++
  }
  return out
}

export function nameFor(g: PokerLedger, id: string) {
  if (id === 'bank') return 'Bank / host'
  return g.players.find((p) => p.id === id)?.name || 'Removed player'
}

export const money = (n: number, cur = '₹') =>
  (n < 0 ? '−' : '') + cur + Math.abs(r2(n)).toLocaleString('en-IN', { maximumFractionDigits: 2 })
