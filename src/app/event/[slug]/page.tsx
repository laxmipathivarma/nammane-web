import { notFound } from 'next/navigation'
import { EVENTS, categoryHero, categoryIcon, type EventCategory } from '@/lib/sampleEvents'
import BackButton from '@/components/BackButton'
import ShareEventModal from '@/components/ShareEventModal'
import JoinRequestButton from '@/components/JoinRequestButton'
import GuestRequestsPanel from '@/components/GuestRequestsPanel'
import HostDetailsModal from '@/components/HostDetailsModal'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { createServerSupabaseClient } from '@/lib/auth'
import { isEventCompleted } from '@/lib/eventStatus'

export function generateStaticParams() {
  return Object.keys(EVENTS).map((slug) => ({ slug }))
}

// Real events created through /host/create are stored in Supabase and
// identified by UUID, not one of the handful of static demo slugs this
// page was originally built around -- look them up and map them onto the
// same shape the rest of this page already renders, rather than 404ing
// on every real event. isHost compares the signed-in viewer's own id
// against host_id so the sticky CTA below can stop showing a host
// "Request to join" their own party.
async function fetchLiveEvent(id: string, viewerId: string | null) {
  const admin = createAdminClient()
  const { data } = await admin.from('events').select('*').eq('id', id).maybeSingle()
  if (!data) return null

  // Real seat count instead of the permanent "0/N" this used to show --
  // approved bookings only, so a pile of still-pending requests doesn't
  // make the event look fuller than it actually is.
  //
  // Alongside that, pull everything a guest needs to judge the host's
  // credibility before requesting to join: their public profile, how
  // many events they've actually hosted (not the old hardcoded "1"),
  // and their rating/reviews so far (reviews.reviewed_id -- the FK hint
  // picks reviewer_id's relation to profiles, since reviews has two FKs
  // into profiles and a plain embed would be ambiguous). All of this is
  // public info by design (same as "Public profiles are viewable" in
  // 001_initial_schema.sql), so it's safe to show before a guest is
  // approved -- it's what they're using to decide whether to ask at all.
  const [{ count: approvedCount }, { data: hostProfile }, { count: eventsHostedCount }, { data: reviewRows }] =
    await Promise.all([
      admin.from('bookings').select('id', { count: 'exact', head: true }).eq('event_id', id).eq('status', 'approved'),
      admin.from('profiles').select('id,display_name,avatar_url,bio,city').eq('id', data.host_id).maybeSingle(),
      admin.from('events').select('id', { count: 'exact', head: true }).eq('host_id', data.host_id),
      admin
        .from('reviews')
        .select('rating,comment,created_at,profiles!reviews_reviewer_id_fkey(display_name)')
        .eq('reviewed_id', data.host_id)
        .order('created_at', { ascending: false }),
    ])

  const ratings = (reviewRows ?? []).map((r) => r.rating as number).filter((r) => typeof r === 'number')
  const ratingAvg = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : null
  const reviews = (reviewRows ?? []).slice(0, 5).map((r) => ({
    rating: r.rating as number | null,
    comment: r.comment as string | null,
    createdAt: r.created_at as string,
    reviewerName:
      (Array.isArray(r.profiles) ? r.profiles[0]?.display_name : (r.profiles as { display_name: string | null } | null)?.display_name) ||
      'Guest',
  }))

  return {
    id: data.id as string,
    title: data.title,
    category: data.category as EventCategory,
    tagLabel: String(data.category).toUpperCase(),
    startsAt: data.starts_at as string | null,
    schedule: data.starts_at
      ? new Date(data.starts_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : 'Date & time TBD',
    area: data.address || data.city || (data.is_public ? 'Shared after approval' : 'Private event'),
    host: {
      name: hostProfile?.display_name || 'the host',
      avatarUrl: hostProfile?.avatar_url ?? null,
      bio: hostProfile?.bio ?? null,
      city: hostProfile?.city ?? null,
      ratingAvg,
      ratingCount: ratings.length,
      reviews,
    },
    eventsHosted: eventsHostedCount ?? 1,
    guests: [],
    seatsLabel: data.capacity ? `${approvedCount ?? 0}/${data.capacity} seats` : 'Open seats',
    houseRules: data.description || 'No details added yet.',
    priceLabel: data.contribution_amount ? `₹${data.contribution_amount}` : undefined,
    isHost: viewerId != null && data.host_id === viewerId,
    isLive: true as const,
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const demoEvent = EVENTS[params.slug]
  const event = demoEvent
    ? { ...demoEvent, isHost: false, isLive: false as const, startsAt: null as string | null }
    : await fetchLiveEvent(params.slug, user?.id ?? null)
  if (!event) notFound()

  const completed = isEventCompleted(event.startsAt)

  const icon = categoryIcon[event.category]

  return (
    <div className="bg-ink min-h-screen text-white">
      {/* hero */}
      <div className="relative h-[260px] md:h-[300px] overflow-hidden" style={{ background: categoryHero[event.category] }}>
        <div className="absolute w-[300px] h-[300px] -right-[100px] -top-[80px] rounded-full opacity-60 blur-sm" style={{ background: 'radial-gradient(circle,#ff4f9e,transparent 70%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-5 pt-5 flex items-center justify-between">
          <BackButton variant="circle" fallbackHref="/discover" label="Back" />
          <ShareEventModal slug={params.slug} title={event.title} category={event.category} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-[180px]">
          <div className="w-[86px] h-[86px] rounded-full flex items-center justify-center shadow-2xl" style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,.35), rgba(255,255,255,.06) 65%)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#fff">
              <use href={`#${icon}`} />
            </svg>
          </div>
          <div className="text-[11px] font-extrabold tracking-wide text-[#e4d4ff] mt-3.5">{event.tagLabel}</div>
        </div>
      </div>

      <div className="relative -mt-5 bg-ink rounded-t-[24px] max-w-3xl mx-auto px-5 pb-32 pt-6">
        <h1 className="nm-marquee text-2xl md:text-3xl text-white leading-tight">{event.title}</h1>
        {completed ? (
          <div className="text-[11px] font-extrabold mt-2 px-3 py-1.5 rounded-full inline-block w-fit" style={{ background: 'rgba(255,255,255,.08)', color: '#a79ecb' }}>
            Event completed
          </div>
        ) : (
          <div className="text-[11px] font-extrabold mt-2 px-3 py-1.5 rounded-full inline-block w-fit" style={{ background: 'rgba(139,63,251,.18)', color: '#c9a8ff' }}>
            Approval required before entry
          </div>
        )}

        <div className="flex items-center gap-3 py-3 border-b border-white/[0.08]">
          <div className="w-9 h-9 rounded-[11px] bg-white/[0.07] flex items-center justify-center shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" stroke="#c9a8ff" fill="none">
              <use href="#i-calendar" />
            </svg>
          </div>
          <div>
            <div className="text-[13.5px] font-bold">{event.schedule}</div>
            <div className="text-[11.5px] text-[#a79ecb] font-semibold">Add to calendar</div>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3 border-b border-white/[0.08]">
          <div className="w-9 h-9 rounded-[11px] bg-white/[0.07] flex items-center justify-center shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" stroke="#5fd0ff" fill="none">
              <use href="#i-pin" />
            </svg>
          </div>
          <div>
            <div className="text-[13.5px] font-bold">{event.area}</div>
            <div className="text-[11.5px] text-[#a79ecb] font-semibold">Exact address shared after approval</div>
          </div>
        </div>
        {event.isLive ? (
          <HostDetailsModal host={event.host} eventsHosted={event.eventsHosted} />
        ) : (
          <div className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-[11px] bg-white/[0.07] flex items-center justify-center shrink-0">
              <svg width="17" height="17" viewBox="0 0 24 24" stroke="#ff8fd1" fill="none">
                <use href="#i-shield" />
              </svg>
            </div>
            <div>
              <div className="text-[13.5px] font-bold">Hosted by {event.host.name}</div>
              <div className="text-[11.5px] text-[#a79ecb] font-semibold">
                Verified host · {event.eventsHosted} events hosted
              </div>
            </div>
          </div>
        )}

        <div className="nm-glass rounded-[18px] p-4 mt-4">
          <div className="text-[12px] font-extrabold text-muted mb-2 tracking-wide">WHO&apos;S GOING</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {event.guests.map((g, i) => (
                <div
                  key={i}
                  className="w-[30px] h-[30px] rounded-full border-2 border-ink text-white text-[10px] font-extrabold flex items-center justify-center"
                  style={{ background: g.color, marginLeft: i === 0 ? 0 : -9 }}
                >
                  {g.initials}
                </div>
              ))}
            </div>
            <div className="text-[12px] font-bold text-[#a79ecb]">{event.seatsLabel}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[12px] font-extrabold text-muted mb-2 tracking-wide">ABOUT THIS NIGHT</div>
          <p className="text-[13px] text-muted font-medium leading-relaxed">{event.houseRules}</p>
        </div>

        {event.isHost && event.isLive && <GuestRequestsPanel eventId={event.id} />}

        {event.priceLabel && (
          <div className="mt-5 nm-glass rounded-2xl p-3.5 flex items-center justify-between">
            <div className="text-[12.5px] font-bold text-muted">Buy-in · set by host</div>
            <div className="text-[15px] font-extrabold text-gold-text">{event.priceLabel}</div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-5 text-[11px] text-muted2 font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="#776fa0" fill="none">
            <use href="#i-shield" />
          </svg>
          Real-money wagering is disabled pending legal &amp; app-store review
        </div>
      </div>

      {/* sticky CTA -- poker events also get a link to the host-only
          toolkit (invitations, tables, buy-ins, settle-up, games history).
          /api/events/[id]/poker still rejects anyone who isn't the host
          server-side (the real gate), but the viewer's own id is now
          looked up above so the host sees their own tools instead of a
          "Request to join" button for a party they're throwing. */}
      <div className="sticky bottom-0 bg-gradient-to-t from-ink via-ink/95 to-transparent pt-6 pb-5 px-5">
        <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
          {event.category === 'poker' && (
            <a
              href={`/event/${params.slug}/poker`}
              className={`nm-btn w-full py-3.5 text-[13.5px] text-center ${
                event.isHost ? 'nm-btn-gold' : 'bg-ink2 text-white border border-white/10'
              }`}
            >
              Poker host tools{event.isHost ? '' : ' (host only)'}
            </a>
          )}
          {event.isHost ? (
            <>
              {/* A host can change anything about their event right up
                  until it starts -- once it's over (completed above),
                  this link disappears rather than sending them to a form
                  that would just refuse the edit server-side too. */}
              {!completed && (
                <a
                  href={`/host/${params.slug}/edit`}
                  className="nm-btn nm-btn-gold w-full py-3.5 text-[13.5px] text-center"
                >
                  Modify event
                </a>
              )}
              <a href="/host" className="nm-btn w-full py-3.5 text-[13.5px] bg-ink2 text-white border border-white/10 text-center">
                Back to my events
              </a>
            </>
          ) : event.isLive ? (
            <JoinRequestButton eventId={event.id} />
          ) : (
            <button className="nm-btn nm-btn-gold w-full py-4 text-[14.5px]">Request to join →</button>
          )}
        </div>
      </div>
    </div>
  )
}
