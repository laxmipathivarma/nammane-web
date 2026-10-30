'use client'

import type { PokerEventData } from '@/lib/pokerLedger'

export default function TableSwitcher({
  data,
  onPick,
  emptyHint,
}: {
  data: PokerEventData
  onPick: (id: string) => void
  emptyHint: string
}) {
  if (data.tables.length === 0) {
    return <div className="text-[12.5px] text-muted2 font-semibold">{emptyHint}</div>
  }
  return (
    <div>
      <label className="nm-label">Pick a table</label>
      <div className="flex flex-col gap-2">
        {data.tables.map((t) => (
          <button key={t.id} onClick={() => onPick(t.id)} className="nm-field bg-ink2 text-left flex items-center justify-between">
            <div>
              <div className="font-extrabold text-[13px]">{t.name}</div>
              <div className="text-[11px] text-muted2 font-semibold mt-0.5">{t.ledger.players.length} players</div>
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                t.status === 'settled' ? 'bg-[#8fe3b0]/[0.18] text-[#8fe3b0]' : 'bg-gold/[0.09] text-gold-text'
              }`}
            >
              {t.status === 'settled' ? 'Settled' : 'Running'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
