'use client'

import { useState } from 'react'
import { calc, minTransfers, money, nameFor, settleNets, tableRanking, type PokerTable } from '@/lib/pokerLedger'
import type { PokerTabProps } from './types'
import TableSwitcher from './TableSwitcher'

export default function SettleHub({ data, save, activeTableId, setActiveTableId }: PokerTabProps) {
  const table = data.tables.find((t) => t.id === activeTableId) || null
  if (!table) return <TableSwitcher data={data} onPick={setActiveTableId} emptyHint="No tables running yet -- add one under Poker Tables." />
  return <SettleTableView data={data} save={save} table={table} setActiveTableId={setActiveTableId} />
}

function SettleTableView({
  data,
  save,
  table,
  setActiveTableId,
}: Pick<PokerTabProps, 'data' | 'save' | 'setActiveTableId'> & { table: PokerTable }) {
  const updateTable = (next: PokerTable) => save({ ...data, tables: data.tables.map((t) => (t.id === table.id ? next : t)) })

  const c = calc(table.ledger)
  const nets = settleNets(table.ledger)
  const transfers = table.ledger.settle ? table.ledger.settle.list : nets ? minTransfers(nets) : []
  const playerTransfers = transfers.filter((t) => t.from !== 'bank' && t.to !== 'bank')
  const houseTransfers = transfers.filter((t) => t.from === 'bank' || t.to === 'bank')
  const ranking = tableRanking(table)

  const [rakeDraft, setRakeDraft] = useState(String(table.ledger.rake || ''))

  const cashedOut = table.ledger.players.filter((p) => p.out != null).length
  const total = table.ledger.players.length

  const doSettle = () => {
    if (!nets) return
    updateTable({
      ...table,
      status: 'settled',
      ledger: { ...table.ledger, rake: Number(rakeDraft) || 0, settle: { at: Date.now(), list: minTransfers(settleNets({ ...table.ledger, rake: Number(rakeDraft) || 0 }) || []) } },
    })
  }

  const toggleDone = (i: number) => {
    if (!table.ledger.settle) return
    const list = table.ledger.settle.list.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t))
    updateTable({ ...table, ledger: { ...table.ledger, settle: { ...table.ledger.settle, list } } })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-[15px]">{table.name}</h2>
          <p className="text-[11.5px] text-muted2 font-semibold mt-0.5">
            {cashedOut}/{total} cashed out
          </p>
        </div>
        <button type="button" onClick={() => setActiveTableId(null)} className="text-[11.5px] font-bold text-[#ff8fd1]">
          Switch table
        </button>
      </div>

      {total === 0 ? (
        <div className="text-[12.5px] text-muted2 font-semibold">Add players under Poker Tables before settling up.</div>
      ) : !c.allOut ? (
        <div className="nm-field bg-ink2">
          <div className="text-[12.5px] text-muted font-semibold mb-2">Waiting on cash-outs:</div>
          <div className="flex flex-col gap-1">
            {table.ledger.players
              .filter((p) => p.out == null)
              .map((p) => (
                <div key={p.id} className="text-[12px] font-bold text-gold-text">
                  {p.name} -- still playing
                </div>
              ))}
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="nm-label">Final house rake</label>
            <input type="number" className="nm-field" placeholder="0" value={rakeDraft} onChange={(e) => setRakeDraft(e.target.value)} />
          </div>

          <button type="button" onClick={doSettle} className="nm-btn nm-btn-gold w-full py-3.5 text-[13.5px]">
            {table.ledger.settle ? 'Recalculate settle-up' : 'Settle up'}
          </button>

          <div>
            <label className="nm-label">Player settle-up</label>
            <div className="flex flex-col gap-2">
              {playerTransfers.length === 0 && <div className="text-[12px] text-muted2 font-semibold">No player-to-player transfers needed.</div>}
              {playerTransfers.map((t, i) => {
                const idx = transfers.indexOf(t)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDone(idx)}
                    className={`nm-field flex items-center justify-between text-left ${t.done ? 'opacity-50' : ''}`}
                  >
                    <div className="text-[12.5px] font-bold">
                      {nameFor(table.ledger, t.from)} → {nameFor(table.ledger, t.to)}
                    </div>
                    <div className="text-[13px] font-extrabold text-gold-text">{money(t.amt, table.ledger.currency)}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="nm-label">Expenses settle-up (with the house)</label>
            <div className="flex flex-col gap-2">
              {houseTransfers.length === 0 && <div className="text-[12px] text-muted2 font-semibold">Nothing owed to or from the house.</div>}
              {houseTransfers.map((t, i) => {
                const idx = transfers.indexOf(t)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDone(idx)}
                    className={`nm-field flex items-center justify-between text-left ${t.done ? 'opacity-50' : ''}`}
                  >
                    <div className="text-[12.5px] font-bold">
                      {t.from === 'bank' ? 'House' : nameFor(table.ledger, t.from)} → {t.to === 'bank' ? 'House' : nameFor(table.ledger, t.to)}
                    </div>
                    <div className="text-[13px] font-extrabold text-gold-text">{money(t.amt, table.ledger.currency)}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {ranking.length > 0 && (
        <div>
          <label className="nm-label">Table summary -- ranking</label>
          <div className="flex flex-col gap-1.5">
            {ranking.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between bg-ink2 rounded-xl border border-white/10 px-3 py-2">
                <span className="text-[12px] font-bold">
                  #{i + 1} {r.name}
                </span>
                <span className={`text-[12.5px] font-extrabold ${(r.net as number) >= 0 ? 'text-[#7fe3a1]' : 'text-[#ff9ecb]'}`}>
                  {(r.net as number) >= 0 ? '+' : ''}
                  {money(r.net as number, table.ledger.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
