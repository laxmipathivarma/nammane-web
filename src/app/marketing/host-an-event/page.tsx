export default function HostAnEventPage() {
  return (
    <div className="px-5 py-16 max-w-3xl mx-auto">
      <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide mb-5">
        FOR HOSTS
      </div>
      <h1 className="nm-marquee text-3xl md:text-4xl text-white mb-4">Host an Event</h1>
      <p className="text-muted text-[15px] font-medium leading-relaxed max-w-xl mb-10">
        Turn your poker night, dinner table, rooftop or karaoke evening into something people
        request to join — you stay in control of who shows up, every time.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <Step n="1" title="Set up your night" text="Pick a category, add the schedule and area, and write a few house rules." />
        <Step n="2" title="Approve your guests" text="Every request comes to you first. Accept the people you want at your table." />
        <Step n="3" title="Run it your way" text="Chat with guests beforehand, keep contributions optional, and build a regular crew." />
      </div>

      <a href="https://app.nammane.in/host/create" className="nm-btn nm-btn-gold px-7 py-3.5 text-[14.5px] inline-block">
        Start hosting →
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
