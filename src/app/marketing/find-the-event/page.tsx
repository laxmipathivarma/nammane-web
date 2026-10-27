export default function FindTheEventPage() {
  return (
    <div className="px-5 py-16 max-w-3xl mx-auto">
      <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5">
        DISCOVER
      </div>
      <h1 className="nm-marquee text-3xl md:text-4xl text-white mb-4">Find the Event</h1>
      <p className="text-muted text-[15px] font-medium leading-relaxed max-w-xl mb-10">
        Poker, rummy, drinks, dinner, karaoke and more — browse what&apos;s on near you tonight,
        filtered by category, city and vibe.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <Step n="1" title="Pick a category" text="Poker, rummy, drinks, dinner, karaoke, or something else entirely." />
        <Step n="2" title="Browse your city" text="See what hosts near you are putting together this week." />
        <Step n="3" title="Request to join" text="Found one you like? Send a request and wait for approval." />
      </div>

      <a href="https://app.nammane.in/discover" className="nm-btn nm-btn-gold px-7 py-3.5 text-[14.5px] inline-block">
        Browse events →
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
