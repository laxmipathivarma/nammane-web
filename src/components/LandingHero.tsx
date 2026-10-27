const deck = [
  {
    icon: 'i-spade',
    label: 'Poker',
    sub: "Texas Hold'em & more",
    bg: 'linear-gradient(160deg,#ffffff,#e9e3f7)',
    color: '#1b1030',
    iconBg: 'rgba(27,16,48,.08)',
    ringBg: 'radial-gradient(circle at 35% 28%, rgba(139,63,251,.22), rgba(139,63,251,.05) 65%)',
    shadow: '0 2px 0 rgba(255,255,255,.8) inset, 0 10px 18px rgba(20,8,50,.18), 0 40px 70px rgba(139,63,251,.35)',
    delay: '0s',
  },
  {
    icon: 'i-diamond',
    label: 'Rummy',
    sub: '13-card classic nights',
    bg: 'linear-gradient(160deg,#c9a8ff,#8b3ffb)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
    ringBg: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,.3), rgba(255,255,255,.04) 65%)',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 10px 18px rgba(80,20,170,.25), 0 40px 70px rgba(107,30,220,.45)',
    delay: '-2s',
  },
  {
    icon: 'i-martini',
    label: 'Drinks',
    sub: 'Rooftop pours & mixers',
    bg: 'linear-gradient(160deg,#8fe3ff,#1a8fd1)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.18)',
    ringBg: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,.3), rgba(255,255,255,.04) 65%)',
    shadow: '0 2px 0 rgba(255,255,255,.3) inset, 0 10px 18px rgba(10,70,150,.25), 0 40px 70px rgba(26,100,209,.45)',
    delay: '-4s',
  },
  {
    icon: 'i-dine',
    label: 'Dinner',
    sub: 'Chef tables & feasts',
    bg: 'linear-gradient(160deg,#ffd37a,#e8942c)',
    color: '#3a2608',
    iconBg: 'rgba(58,38,8,.12)',
    ringBg: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,.45), rgba(255,255,255,.08) 65%)',
    shadow: '0 2px 0 rgba(255,255,255,.4) inset, 0 10px 18px rgba(130,80,10,.25), 0 40px 70px rgba(180,110,20,.4)',
    delay: '-6s',
  },
  {
    icon: 'i-mic',
    label: 'Karaoke',
    sub: 'Open mic & sing-alongs',
    bg: 'linear-gradient(160deg,#ff8fd1,#ff4f9e)',
    color: '#fff',
    iconBg: 'rgba(255,255,255,.2)',
    ringBg: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,.3), rgba(255,255,255,.04) 65%)',
    shadow: '0 2px 0 rgba(255,255,255,.35) inset, 0 10px 18px rgba(170,20,90,.25), 0 40px 70px rgba(255,79,158,.4)',
    delay: '-8s',
  },
]

export default function LandingHero() {
  return (
    <div className="relative overflow-hidden">
      {/* glow blobs */}
      <div className="absolute w-[640px] h-[640px] -left-[180px] -top-[160px] rounded-full opacity-55 blur-sm" style={{ background: 'radial-gradient(circle,#8b3ffb,transparent 70%)' }} />
      <div className="absolute w-[560px] h-[560px] -right-[120px] top-[60px] rounded-full opacity-45 blur-sm" style={{ background: 'radial-gradient(circle,#ff4f9e,transparent 70%)' }} />
      <div className="absolute w-[500px] h-[500px] right-[160px] -bottom-[200px] rounded-full opacity-35 blur-sm" style={{ background: 'radial-gradient(circle,#4cc9f0,transparent 70%)' }} />

      <div className="relative z-10 text-center text-[11.5px] text-muted2 font-bold tracking-wide pt-6 px-5">
        Shuffling through every night out — Poker · Rummy · Drinks · Dinner · Karaoke
      </div>

      <div className="relative z-10 flex items-center flex-wrap gap-10 px-5 md:px-12 py-8 md:py-12 max-w-6xl mx-auto">
        {/* left: copy */}
        <div className="flex-[1_1_440px] min-w-0 max-w-xl">
          <div className="nm-glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11.5px] font-extrabold tracking-wide text-[#e4d4ff] mb-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff8fd1">
              <use href="#i-star" />
            </svg>
            POKER · DINNER · DRINKS · KARAOKE
          </div>
          <h1 className="nm-marquee text-[40px] md:text-[54px] leading-[1.08] font-extrabold text-white">
            Find your{' '}
            <span style={{ background: 'linear-gradient(120deg,#c57bff,#ff6fc2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              kind
            </span>
            <br />
            of night out
          </h1>
          <p className="text-[15px] md:text-base leading-relaxed text-muted font-medium mt-5 max-w-md">
            Poker nights, dinner parties, rooftop drinks and karaoke sessions — hosted by real people, with approval
            before you show up. One app, 10+ ways to spend tonight.
          </p>
          <div className="flex items-center gap-3.5 mt-7 flex-wrap">
            <a href="/auth/signup" className="nm-btn nm-btn-gold px-7 py-4 text-[14.5px]">
              Find your night →
            </a>
            <a href="/discover" className="nm-btn nm-btn-outline px-6 py-4 text-[14.5px] gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" className="bg-white/10 rounded-full p-1">
                <use href="#i-play" />
              </svg>
              See it in action
            </a>
          </div>
          <div className="flex items-center gap-3.5 mt-9">
            <div className="flex">
              <div className="w-8.5 h-8.5 rounded-full border-2 border-ink flex items-center justify-center text-[11px] font-extrabold" style={{ width: 34, height: 34, background: '#ff7fc2' }}>RK</div>
              <div className="w-8.5 h-8.5 rounded-full border-2 border-ink flex items-center justify-center text-[11px] font-extrabold -ml-2.5" style={{ width: 34, height: 34, background: '#5fd0ff' }}>SM</div>
              <div className="w-8.5 h-8.5 rounded-full border-2 border-ink flex items-center justify-center text-[11px] font-extrabold -ml-2.5" style={{ width: 34, height: 34, background: '#b968ff' }}>AJ</div>
            </div>
            <div className="text-[13px] font-bold text-[#e4e0f4]">4.9+ ★ rating from guests all over India</div>
          </div>
        </div>

        {/* right: 3D shuffling card deck */}
        <div className="flex-[1_1_380px] min-w-[300px] max-w-[520px] h-[460px] relative flex items-center justify-center">
          <div className="absolute w-[380px] h-[380px] rounded-full blur-sm" style={{ background: 'radial-gradient(circle,rgba(201,104,255,.5),transparent 70%)' }} />

          <div className="relative w-[244px] h-[330px]">
            {deck.map((card) => (
              <div
                key={card.label}
                className="nm-deck-card"
                style={{ background: card.bg, boxShadow: card.shadow, animationDelay: card.delay, color: card.color }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7.5 h-7.5 rounded-[10px] flex items-center justify-center" style={{ width: 30, height: 30, background: card.iconBg }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <use href={`#${card.icon}`} />
                    </svg>
                  </div>
                </div>
                <div className="self-center w-[118px] h-[118px] rounded-full flex items-center justify-center" style={{ background: card.ringBg }}>
                  <svg width="58" height="58" viewBox="0 0 24 24" fill="currentColor">
                    <use href={`#${card.icon}`} />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="w-6.5 h-[3px] rounded" style={{ width: 26, background: 'currentColor' }} />
                  <div className="nm-marquee text-[19px] font-extrabold tracking-wide">{card.label}</div>
                  <div className="text-[11px] font-bold opacity-70">{card.sub}</div>
                </div>
                <div className="nm-deck-sheen" />
              </div>
            ))}
          </div>

          {/* chip stack accent */}
          <svg width="150" height="130" className="absolute left-1 bottom-2.5 opacity-90" style={{ overflow: 'visible', filter: 'drop-shadow(0 18px 20px rgba(0,0,0,.45))' }}>
            <defs>
              <radialGradient id="g-chipA" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#b968ff" /><stop offset="1" stopColor="#6d1fd1" /></radialGradient>
              <radialGradient id="g-chipB" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#ff7fc2" /><stop offset="1" stopColor="#d81e85" /></radialGradient>
              <radialGradient id="g-chipC" cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#5fd0ff" /><stop offset="1" stopColor="#1a8fd1" /></radialGradient>
            </defs>
            <use href="#nm-chip-flat" className="nm-bob1" fill="url(#g-chipA)" />
            <use href="#nm-chip-flat" className="nm-bob2" fill="url(#g-chipB)" />
            <use href="#nm-chip-flat" className="nm-bob3" fill="url(#g-chipC)" />
          </svg>

          {/* dice accent */}
          <div className="absolute right-3.5 bottom-3.5 w-[112px] h-[76px]">
            <div className="nm-bob-dice absolute" style={{ right: 38, bottom: 8, width: 62, height: 62 }}>
              <svg width="62" height="62" viewBox="0 0 78 78" style={{ display: 'block', filter: 'drop-shadow(0 16px 18px rgba(0,0,0,.4))' }}>
                <rect x="4" y="4" width="70" height="70" rx="16" fill="#fff" />
                <rect x="4" y="4" width="70" height="70" rx="16" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1" />
                <circle cx="24" cy="24" r="6" fill="#6d1fd1" /><circle cx="54" cy="24" r="6" fill="#6d1fd1" />
                <circle cx="24" cy="54" r="6" fill="#6d1fd1" /><circle cx="54" cy="54" r="6" fill="#6d1fd1" />
                <circle cx="39" cy="39" r="6" fill="#6d1fd1" />
              </svg>
            </div>
            <div className="nm-bob-dice2 absolute" style={{ right: 0, bottom: 0, width: 46, height: 46 }}>
              <svg width="46" height="46" viewBox="0 0 78 78" style={{ display: 'block', filter: 'drop-shadow(0 12px 14px rgba(0,0,0,.4))' }}>
                <rect x="4" y="4" width="70" height="70" rx="16" fill="#ffd37a" />
                <rect x="4" y="4" width="70" height="70" rx="16" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1" />
                <circle cx="22" cy="22" r="7" fill="#9a5a08" />
                <circle cx="39" cy="39" r="7" fill="#9a5a08" />
                <circle cx="56" cy="56" r="7" fill="#9a5a08" />
              </svg>
            </div>
          </div>

          {/* progress dots */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="nm-dot" /><div className="nm-dot" /><div className="nm-dot" /><div className="nm-dot" /><div className="nm-dot" />
          </div>
        </div>
      </div>

      {/* stats strip */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-center px-5 md:px-12 pb-12 max-w-6xl mx-auto">
        <div className="nm-glass flex-[1_1_220px] max-w-[280px] rounded-2xl p-5">
          <div className="nm-marquee text-[26px] font-extrabold text-white">10+</div>
          <div className="text-[12.5px] text-muted font-bold mt-1">Event categories — poker, rummy, drinks, dinner, karaoke &amp; more</div>
        </div>
        <div className="nm-glass flex-[1_1_220px] max-w-[280px] rounded-2xl p-5">
          <div className="nm-marquee text-[26px] font-extrabold text-white">100%</div>
          <div className="text-[12.5px] text-muted font-bold mt-1">Host-approved guests, on every event</div>
        </div>
        <div className="nm-glass flex-[1_1_220px] max-w-[280px] rounded-2xl p-5">
          <div className="nm-marquee text-[26px] font-extrabold text-white">8</div>
          <div className="text-[12.5px] text-muted font-bold mt-1">Major metro cities across India, and growing</div>
        </div>
      </div>
    </div>
  )
}
