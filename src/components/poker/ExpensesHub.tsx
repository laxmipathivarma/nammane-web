'use client'

import { useState } from 'react'
import { EXPENSE_CATEGORIES, expenseBreakdown, money, newId, nameFor, type PokerTable } from '@/lib/pokerLedger'
import type { PokerTabProps } from './types'
import TableSwitcher from './TableSwitcher'

export default function ExpensesHub({ data, save, activeTableId, setActiveTableId }: PokerTabProps) {
  const table = data.tables.find((t) => t.id === activeTableId) || null
  if (!table) return <TableSwitcher data={data} onPick={setActiveTableId} emptyHint="Add a table first, under Poker Tables." />
  return <ExpensesTableView data={data} save={save} table={table} setActiveTableId={setActiveTableId} />
}

function ExpensesTableView({
  data,
  save,
  table,
  setActiveTableId,
}: Pick<PokerTabProps, 'data' | 'save' | 'setActiveTableId'> & { table: PokerTable }) {
  const updateTable = (next: PokerTable) => save({ ...data, tables: data.tables.map((t) => (t.id === table.id ? next : t)) })
  const breakdown = expenseBreakdown(table)
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [customLabel, setCustomLabel] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [amt, setAmt] = useState('')
  const [paidBy, setPaidBy] = useState('bank')
  const [rakeDraft, setRakeDraft] = useState(String(table.ledger.rake || ''))

  const addExpense = () => {
    const label = useCustom ? customLabel.trim() : category
    const amount = Number(amt)
    if (!label || !(amount > 0)) return
    updateTable({
      ...table,
      ledger: { ...table.ledger, expenses: [...table.ledger.expenses, { id: newId(), label, amt: amount, split: 'players', by: paidBy, at: Date.now() }] },
    })
    setAmt('')
    setCustomLabel('')
    setUseCustom(false)
  }

  const removeExpense = (id: string) => updateTable({ ...table, ledger: { ...table.ledger, expenses: table.ledger.expenses.filter((e) => e.id !== id) } })

  const saveRake = () => updateTable({ ...table, ledger: { ...table.ledger, rake: Number(rakeDraft) || 0 } })

  const maxBreakdown = Math.max(breakdown.house, ...breakdown.players.map((p) => p.amt), 1)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-[15px]">{table.name}</h2>
        <button type="button" onClick={() => setActiveTableId(null)} className="text-[11.5px] font-bold text-[#ff8fd1]">
          Switch table
        </button>
      </div>

      <div>
        <label className="nm-label">House rake</label>
        <div className="flex gap-2">
          <input type="number" className="nm-field flex-1" placeholder="0" value={rakeDraft} onChange={(e) => setRakeDraft(e.target.value)} onBlur={saveRake} />
        </div>
      </div>

      <div>
        <label className="nm-label">Add an expense</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {!useCustom ? (
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="nm-field !py-2 text-[12.5px] w-32">
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <input className="nm-field !py-2 text-[12.5px] w-32" placeholder="Expense type" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} />
          )}
          <button
            type="button"
            onClick={() => setUseCustom((v) => !v)}
            className="nm-btn px-3 py-2 text-[11px] bg-ink text-white border border-white/10 shrink-0"
          >
            {useCustom ? 'Use list' : '+ Add type'}
          </button>
          <input
            type="number"
            className="nm-field !py-2 text-[12.5px] w-28"
            placeholder={`Amount (${table.ledger.currency})`}
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
          />
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="nm-field !py-2 text-[12.5px] w-32">
            <option value="bank">Paid by House</option>
            {table.ledger.players.map((p) => (
              <option key={p.id} value={p.id}>
                Paid by {p.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={addExpense} className="nm-btn nm-btn-gold px-4 py-2 text-[12.5px] shrink-0">
            Add
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {table.ledger.expenses.length === 0 && <div className="text-[12px] text-muted2 font-semibold">No expenses logged yet.</div>}
          {table.ledger.expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between text-[12px] bg-ink2 border border-white/10 rounded-xl px-3 py-2">
              <div>
                <span className="font-bold">{e.label}</span>{' '}
                <span className="text-muted2 font-semibold">· {e.by === 'bank' ? 'House' : nameFor(table.ledger, e.by)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-extrabold">{money(e.amt, table.ledger.currency)}</span>
                <button type="button" onClick={() => removeExpense(e.id)} className="text-[10.5px] text-muted2 font-semibold hover:text-[#ff9ecb]">
                  Remove
                </button>
              </div>
            </div>
          ))}
          {table.ledger.expenses.length > 0 && (
            <div className="flex items-center justify-between text-[12.5px] font-extrabold pt-1.5 border-t border-white/10 mt-1">
              <span>Total expenses</span>
              <span className="text-gold-text">{money(breakdown.total, table.ledger.currency)}</span>
            </div>
          )}
        </div>
      </div>

      {(breakdown.players.length > 0 || breakdown.house > 0) && (
        <div>
          <label className="nm-label">Who fronted the cash</label>
          <div className="flex flex-col gap-2">
            {breakdown.players.map((row) => (
              <div key={row.id} className="flex items-center gap-2">
                <span className="text-[11.5px] font-bold w-20 shrink-0 truncate">{row.name}</span>
                <div className="flex-1 h-2 bg-ink2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full" style={{ width: `${(row.amt / maxBreakdown) * 100}%` }} />
                </div>
                <span className="text-[11.5px] font-extrabold w-20 text-right shrink-0">{money(row.amt, table.ledger.currency)}</span>
              </div>
            ))}
            {breakdown.house > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-bold w-20 shrink-0">House</span>
                <div className="flex-1 h-2 bg-ink2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4cc9f0] to-[#8b3ffb] rounded-full" style={{ width: `${(breakdown.house / maxBreakdown) * 100}%` }} />
                </div>
                <span className="text-[11.5px] font-extrabold w-20 text-right shrink-0">{money(breakdown.house, table.ledger.currency)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
