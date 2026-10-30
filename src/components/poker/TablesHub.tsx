'use client'

import { useState } from 'react'
import { BUYIN_PRESETS, emptyTable, money, newId, sumBuyins, type PokerTable } from '@/lib/pokerLedger'
import type { PokerTabProps } from './types'

export default function TablesHub({ data, save, activeTableId, setActiveTableId }: PokerTabProps) {
  const table = data.tables.find((t) => t.id === activeTableId) || null

  if (!table) {
    return <TableList data={data} save={save} onOpen={setActiveTableId} />
  }
  return <TableDetail data={data} save={save} table={table} onBack={() => setActiveTableId(null)} />
}

function TableList({ data, save, onOpen }: Pick<PokerTabProps, 'data' | 'save'> & { onOpen: (id: string) => void }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState(`Table ${data.tables.length + 1}`)
  const [maxPlayers, setMaxPlayers] = useState(10)

  const addTable = () => {
    const t = emptyTable(name.trim() || `Table ${data.tables.length + 1}`, Math.max(2, Math.min(10, maxPlayers || 10)))
    save({ ...data, tables: [...data.tables, t] })
    setAdding(false)
    setName(`Table ${data.tables.length + 2}`)
    onOpen(t.id)
  }

  return (
    <div className="flex flex-col gap-3">
      {data.tables.length === 0 && <div className="text-[12.5px] text-muted2 font-semibold">No tables yet -- add your first one below.</div>}
      {data.tables.map((t) => {
        const playing = t.ledger.players.filter((p) => p.out == null).length
        // A table you just created has nobody in it yet -- "Running"
        // reads as if the game already started. Show that as "Not
        // started" instead; "Running" only once someone's actually
        // sitting at it.
        const label = t.status === 'settled' ? 'Settled' : t.ledger.players.length === 0 ? 'Not started' : 'Running'
        const labelClass =
          t.status === 'settled'
            ? 'bg-[#8fe3b0]/[0.18] text-[#8fe3b0]'
            : t.ledger.players.length === 0
              ? 'bg-white/10 text-muted2'
              : 'bg-gold/[0.09] text-gold-text'
        return (
          <button
            key={t.id}
            onClick={() => onOpen(t.id)}
            className="nm-field bg-ink2 text-left flex items-center justify-between"
          >
            <div>
              <div className="font-extrabold text-[13.5px]">{t.name}</div>
              <div className="text-[11.5px] text-muted font-semibold mt-0.5">
                {t.ledger.players.length}/{t.maxPlayers} seated · {playing} still playing
              </div>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 ${labelClass}`}>{label}</span>
          </button>
        )
      })}

      {adding ? (
        <div className="nm-field bg-ink2 flex flex-col gap-2.5">
          <div>
            <label className="nm-label">Table name</label>
            <input className="nm-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="nm-label">Max players (up to 10)</label>
            <input
              type="number"
              min={2}
              max={10}
              className="nm-field"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={addTable} className="nm-btn nm-btn-gold flex-1 py-2.5 text-[12.5px]">
              Create table
            </button>
            <button type="button" onClick={() => setAdding(false)} className="nm-btn px-4 py-2.5 text-[12px] bg-ink text-white border border-white/10">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="nm-btn nm-btn-gold w-full py-3 text-[13px]">
          + Add table
        </button>
      )}
    </div>
  )
}

const CHIP_COLORS: Record<number, string> = {
  5000: '#4cc9f0',
  10000: '#7fe3a1',
  15000: '#ffd166',
  20000: '#ff8fd1',
  30000: '#b968ff',
}

function TableDetail({
  data,
  save,
  table,
  onBack,
}: Pick<PokerTabProps, 'data' | 'save'> & { table: PokerTable; onBack: () => void }) {
  const [newName, setNewName] = useState('')
  const [guestId, setGuestId] = useState('')
  const [otherAmt, setOtherAmt] = useState<Record<string, string>>({})
  const [buyMethod, setBuyMethod] = useState<Record<string, 'paid' | 'credit'>>({})

  const updateTable = (next: PokerTable) => save({ ...data, tables: data.tables.map((t) => (t.id === table.id ? next : t)) })

  const full = table.ledger.players.length >= table.maxPlayers

  // Guests the host already invited (and, usually, approved) who aren't
  // sitting at any table yet -- picking one here seats them straight
  // from the guest list instead of retyping their name, and keeps
  // Guest Approvals in sync (marks them approved + seated here).
  const availableGuests = data.invitees.filter((i) => !i.tableId)

  const addPlayer = () => {
    if (!newName.trim() || full) return
    updateTable({ ...table, ledger: { ...table.ledger, players: [...table.ledger.players, { id: newId(), name: newName.trim(), buyins: [], out: null }] } })
    setNewName('')
  }

  const addFromGuestList = () => {
    if (!guestId || full) return
    const guest = data.invitees.find((i) => i.id === guestId)
    if (!guest) return
    const tables = data.tables.map((t) =>
      t.id === table.id
        ? { ...t, ledger: { ...t.ledger, players: [...t.ledger.players, { id: newId(), name: guest.name, phone: guest.phone, buyins: [], out: null }] } }
        : t
    )
    save({
      ...data,
      tables,
      invitees: data.invitees.map((i) => (i.id === guestId ? { ...i, approved: true, tableId: table.id } : i)),
    })
    setGuestId('')
  }

  const removePlayer = (pid: string) =>
    updateTable({ ...table, ledger: { ...table.ledger, players: table.ledger.players.filter((p) => p.id !== pid) } })

  const addBuyIn = (pid: string, amt: number) => {
    if (!(amt > 0)) return
    const method = buyMethod[pid] || 'paid'
    updateTable({
      ...table,
      ledger: {
        ...table.ledger,
        players: table.ledger.players.map((p) =>
          p.id === pid ? { ...p, out: null, buyins: [...p.buyins, { id: newId(), amt, method, at: Date.now() }] } : p
        ),
      },
    })
    setOtherAmt((o) => ({ ...o, [pid]: '' }))
  }

  const setCashOut = (pid: string, value: string) => {
    const amt = value === '' ? null : Number(value)
    updateTable({ ...table, ledger: { ...table.ledger, players: table.ledger.players.map((p) => (p.id === pid ? { ...p, out: amt } : p)) } })
  }

  const editName = (nextName: string) => updateTable({ ...table, name: nextName })
  const editMax = (nextMax: number) => updateTable({ ...table, maxPlayers: Math.max(table.ledger.players.length, Math.min(10, nextMax || 10)) })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="nm-btn !w-8 !h-8 bg-ink2 border-0 shrink-0 flex items-center justify-center text-[14px]">
          ←
        </button>
        <input value={table.name} onChange={(e) => editName(e.target.value)} className="nm-marquee text-[17px] bg-transparent border-0 outline-none flex-1 min-w-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10.5px] text-muted2 font-bold">MAX</span>
          <input
            type="number"
            min={table.ledger.players.length || 2}
            max={10}
            value={table.maxPlayers}
            onChange={(e) => editMax(Number(e.target.value))}
            className="nm-field !py-1.5 !px-2 text-[12px] w-14 text-center"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="nm-label !mb-0">Add a player ({table.ledger.players.length}/{table.maxPlayers})</label>

        {availableGuests.length > 0 && (
          <div className="flex gap-2">
            <select
              className="nm-field flex-1"
              value={guestId}
              disabled={full}
              onChange={(e) => setGuestId(e.target.value)}
            >
              <option value="">Pick from invited guests…</option>
              {availableGuests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                  {g.phone ? ` · ${g.phone}` : ''}
                  {g.invitedAt ? '' : ' (not invited yet)'}
                </option>
              ))}
            </select>
            <button type="button" onClick={addFromGuestList} disabled={!guestId || full} className="nm-btn nm-btn-gold px-5 disabled:opacity-40">
              Add
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {availableGuests.length > 0 && <span className="text-[10px] text-muted2 font-bold uppercase shrink-0">or</span>}
          <input
            className="nm-field flex-1"
            placeholder={full ? 'Table is full' : 'Type a player name manually'}
            value={newName}
            disabled={full}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button type="button" onClick={addPlayer} disabled={full} className="nm-btn nm-btn-gold px-5 disabled:opacity-40">
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {table.ledger.players.map((p) => {
          const bought = sumBuyins(p)
          const credit = p.buyins.filter((b) => b.method === 'credit').reduce((a, b) => a + b.amt, 0)
          const res = p.out == null ? null : p.out - bought
          const method = buyMethod[p.id] || 'paid'
          return (
            <div key={p.id} className="nm-field bg-ink2 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-[13.5px]">{p.name}</div>
                <button type="button" onClick={() => removePlayer(p.id)} className="text-[10.5px] text-muted2 font-semibold hover:text-[#ff9ecb]">
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11.5px] text-muted font-semibold flex-wrap">
                <span>Bought in {money(bought, table.ledger.currency)}</span>
                {credit > 0 && <span className="text-[#ff9ecb]">Credit {money(credit, table.ledger.currency)}</span>}
                {p.out == null ? (
                  <span className="text-gold-text">Playing</span>
                ) : (
                  <span className={res != null && res >= 0 ? 'text-[#7fe3a1]' : 'text-[#ff9ecb]'}>
                    {res != null && res >= 0 ? '+' : ''}
                    {res != null ? money(res, table.ledger.currency) : ''}
                  </span>
                )}
              </div>

              {/* Buy-in chips */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {BUYIN_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => addBuyIn(p.id, amt)}
                      className="rounded-full font-extrabold text-[11px] px-3.5 py-2 border-2 shrink-0"
                      style={{ borderColor: CHIP_COLORS[amt], color: CHIP_COLORS[amt], background: `${CHIP_COLORS[amt]}1a` }}
                    >
                      ₹{amt / 1000}k
                    </button>
                  ))}
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      placeholder="Other"
                      value={otherAmt[p.id] || ''}
                      onChange={(e) => setOtherAmt((o) => ({ ...o, [p.id]: e.target.value }))}
                      className="nm-field !py-2 !px-2.5 text-[11.5px] w-20"
                    />
                    <button
                      type="button"
                      onClick={() => addBuyIn(p.id, Number(otherAmt[p.id]) || 0)}
                      className="nm-btn px-2.5 py-2 text-[11px] bg-ink text-white border border-white/10"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] text-muted2 font-bold">NEW BUY-IN IS</span>
                  <button
                    type="button"
                    onClick={() => setBuyMethod((m) => ({ ...m, [p.id]: 'paid' }))}
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${method === 'paid' ? 'bg-[#7fe3a1]/20 text-[#7fe3a1]' : 'text-muted2'}`}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyMethod((m) => ({ ...m, [p.id]: 'credit' }))}
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${method === 'credit' ? 'bg-[#ff9ecb]/20 text-[#ff9ecb]' : 'text-muted2'}`}
                  >
                    Credit
                  </button>
                </div>
              </div>

              <div>
                <label className="nm-label !mb-1">Cash out</label>
                <input
                  type="number"
                  placeholder="Amount they're leaving the table with"
                  defaultValue={p.out ?? ''}
                  onBlur={(e) => setCashOut(p.id, e.target.value)}
                  className="nm-field !py-2 text-[12px]"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
