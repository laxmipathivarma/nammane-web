// Whether an event's own scheduled time has passed -- the single source of
// truth for "Event completed" badges and for locking out host edits. An
// event with no starts_at set (date/time still TBD) is never "completed"
// since there's nothing to have passed yet.
export function isEventCompleted(startsAt: string | null | undefined): boolean {
  if (!startsAt) return false
  const t = new Date(startsAt).getTime()
  if (Number.isNaN(t)) return false
  return t < Date.now()
}
