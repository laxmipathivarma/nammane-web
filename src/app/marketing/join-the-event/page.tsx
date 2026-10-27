export default function JoinTheEventPage() {
  return (
    <div className="px-5 py-16 max-w-3xl mx-auto">
      <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5">
        FOR GUESTS
      </div>
      <h1 className="nm-marquee text-3xl md:text-4xl text-white mb-4">Join the Event</h1>
      <p className="text-muted text-[15px] font-medium leading-relaxed max-w-xl mb-10">
        Found a night you like? Send a request, meet the host&apos;s approval, and you&apos;re in —
        no awkward walk-ins, no surprises on arrival.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <Step n="1" title="Request to join" text="Tell the host a bit about yourself and why you want in." />
        <Step n="2" title="Get approved" text="Hosts review requests and approve the guests who fit the night." />
        <Step n="3" title="Show up & play" text="Exact address and details unlock once you're confirmed." />
      </div>

      <a href="https://app.nammane.in/auth/signup" className="nm-btn nm-btn-gold px-7 py-3.5 text-[14.5px] inline-block">
        Create your account →
      </a>
    </div>
  )
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="nm-card rounded-2xl p-5">
      <div className="w-8 h-8 rounded-full bg-gold/15 text-gold-text flex items-center justify-center font-extrabold text-[13px] mb-3">{n}</div>
      <div className="nm-marquee text-base text-white mb-1.5">{title}</div>
      <div className="text-muted text-[13px] font-medium leading-relaxed">{text}</div>
    </div>
  )
}
