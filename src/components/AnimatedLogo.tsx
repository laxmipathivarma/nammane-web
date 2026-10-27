'use client'

export default function AnimatedLogo({
  size = 140,
  tagline,
}: {
  size?: number
  tagline?: string
}) {
  return (
    <div className="nm-logo-wrap" style={{ width: size * 1.6 }}>
      <svg
        className="nm-logo-house"
        width={size}
        height={size}
        viewBox="0 0 140 140"
        style={{ overflow: 'visible' }}
      >
        {/* sparkle above roof */}
        <g className="nm-spark">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = -90 + (i - 2.5) * 16
            const rad = (angle * Math.PI) / 180
            const x1 = 70 + Math.cos(rad) * 18
            const y1 = 28 + Math.sin(rad) * 18
            const x2 = 70 + Math.cos(rad) * 30
            const y2 = 28 + Math.sin(rad) * 30
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e8d9ac"
                strokeWidth="3"
                strokeLinecap="round"
                className="nm-spark-ray"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            )
          })}
        </g>

        {/* confetti */}
        <g className="nm-confetti">
          {Array.from({ length: 14 }).map((_, i) => {
            const cx = 20 + (i * 101) % 100
            const colors = ['#cda858', '#b23a4a', '#1e6e4a', '#e8d9ac']
            return (
              <rect
                key={i}
                x={cx}
                y={30}
                width="4"
                height="7"
                rx="1"
                fill={colors[i % colors.length]}
                className="nm-confetti-piece"
                style={{
                  animationDelay: `${0.4 + (i % 7) * 0.12}s`,
                  transformOrigin: `${cx + 2}px 30px`,
                }}
              />
            )
          })}
        </g>

        {/* house outline */}
        <g className="nm-house-body">
          <path
            d="M20 70 L70 32 L120 70 V118 H20 Z"
            fill="none"
            stroke="url(#nm-house-gold)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <rect x="12" y="116" width="116" height="4" rx="2" fill="#cda858" />

          {/* windows */}
          <rect className="nm-window" x="38" y="78" width="14" height="14" rx="2" fill="#e8d9ac" />
          <rect className="nm-window" x="88" y="78" width="14" height="14" rx="2" fill="#e8d9ac" style={{ animationDelay: '0.3s' }} />
          <circle className="nm-window" cx="70" cy="60" r="4" fill="#e8d9ac" style={{ animationDelay: '0.15s' }} />

          {/* door */}
          <g className="nm-door-frame">
            <path d="M58 118 V92 C58 86 63 82 70 82 C77 82 82 86 82 92 V118" fill="none" stroke="#cda858" strokeWidth="3" />
            <path className="nm-door nm-door-left" d="M58 118 V92 C58 88 61 85 64.5 83.5 V118 Z" fill="#15110b" />
            <path className="nm-door nm-door-right" d="M82 118 V92 C82 88 79 85 75.5 83.5 V118 Z" fill="#15110b" />
          </g>

          {/* guests */}
          <g className="nm-guest nm-guest-1" style={{ transformOrigin: '70px 118px' }}>
            <circle cx="70" cy="100" r="6" fill="#e8d9ac" />
            <path d="M62 118 C62 110 66 106 70 106 C74 106 78 110 78 118 Z" fill="#e8d9ac" />
          </g>
          <g className="nm-guest nm-guest-2" style={{ transformOrigin: '55px 118px' }}>
            <circle cx="55" cy="104" r="5" fill="#b23a4a" />
            <path d="M48 118 C48 112 51 108 55 108 C59 108 62 112 62 118 Z" fill="#b23a4a" />
          </g>
          <g className="nm-guest nm-guest-3" style={{ transformOrigin: '85px 118px' }}>
            <circle cx="85" cy="104" r="5" fill="#1e6e4a" />
            <path d="M78 118 C78 112 81 108 85 108 C89 108 92 112 92 118 Z" fill="#1e6e4a" />
          </g>
        </g>

        <defs>
          <linearGradient id="nm-house-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f1e3bd" />
            <stop offset=".5" stopColor="#cda858" />
            <stop offset="1" stopColor="#8a661f" />
          </linearGradient>
        </defs>
      </svg>

      <div className="nm-wordmark nm-marquee" style={{ fontSize: size * 0.34 }}>
        {'NamMane'.split('').map((ch, i) => (
          <span
            key={i}
            className="nm-letter"
            style={{
              animationDelay: `${0.75 + i * 0.05}s`,
              color: i < 3 ? '#f5efe3' : '#d9bd7a',
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {tagline && <div className="nm-logo-tagline">{tagline}</div>}
    </div>
  )
}
