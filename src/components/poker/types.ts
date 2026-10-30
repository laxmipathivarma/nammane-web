import type { PokerEventData } from '@/lib/pokerLedger'
import type { InviteEventInfo } from '@/lib/invite'

export type PokerTabKey = 'menu' | 'invite' | 'tables' | 'expenses' | 'settle' | 'games'

export type PokerTabProps = {
  data: PokerEventData
  save: (next: PokerEventData) => void
  eventInfo: InviteEventInfo
  activeTableId: string | null
  setActiveTableId: (id: string | null) => void
  goTab: (tab: PokerTabKey) => void
}
