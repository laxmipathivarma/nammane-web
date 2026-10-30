'use client'

import { useState } from 'react'
import { calc, money, tableRanking } from '@/lib/pokerLedger'
import type { PokerTabProps } from './types'

export default function GamesHub({ data }: PokerTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (data.tables.length === 0) {
    return <div className="text-[12.5px] text-muted2 font-semibold">No games yet -- tables you run will show up here.</div>
  }

  const totalRake = data.tables.reduce((a, t) => a + calc(t.ledger).R, 0)
  const totalBuyins = data.tables.reduce((a, t) => a + calc(t.ledger).B, 0)
  const currency = data.tables[0].ledger.currency

  return (
    <div className="flex flex-col gap-5">
      <div className="nm-field bg-ink2">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[10px] text-muted2 font-bold uppercase">Tables run</div>
            <div className="text-[15px] font-extrabold">{data.tables.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted2 font-bold uppercase">Total buy-ins</div>
            <div className="text-[15px] font-extrabold">{money(totalBuyins, currency)}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted2 font-bold uppercase">Total rake</div>
            <div className="text-[15px] font-extrabold text-gold-text">{money(totalRake, currency)}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {[...data.tables].reverse().map((t) => {
          const c = calc(t.ledger)
          const ranking = tableRanking(t)
          const open = expanded === t.id
          return (
            <div key={t.id} className="nm-field bg-ink2">
              <button type="button" onClick={() => setExpanded(open ? null : t.id)} className="w-full flex items-center justify-between text-left">
                <div>
                  <div className="font-extrabold text-[13.5px]">{t.name}</div>
                  <div className="text-[11px] text-muted2 font-semibold mt-0.5">
                    {t.ledger.players.length} players · buy-ins {money(c.B, t.ledger.currency)} · rake {money(c.R, t.ledger.currency)}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                    t.status === 'settled' ? 'bg-[#8fe3b0]/[0.18] text-[#8fe3b0]' : 'bg-gold/[0.09] text-gold-text'
                  }`}
                >
                  {t.status === 'settled' ? 'Settled' : 'Running'}
                </span>
              </button>

              {open && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
                  {ranking.length === 0 && <div className="text-[11.5px] text-muted2 font-semibold">No completed hands yet.</div>}
                  {ranking.map((r, i) => (
                    <div key={r.id} className="flex items-center justify-between text-[12px]">
                      <span className="font-bold">
                        #{i + 1} {r.name}
                      </span>
                      <span className={`font-extrabold ${(r.net as number) >= 0 ? 'text-[#7fe3a1]' : 'text-[#ff9ecb]'}`}>
                        {(r.net as number) >= 0 ? '+' : ''}
                        {money(r.net as number, t.ledger.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
