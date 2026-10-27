export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <path id="i-spade" d="M12 0C13.8 3.6 20 7 20 14 C20 17.6 16.6 19.8 13.4 18.2 C12.7 17.8 12.3 17.4 12 17 C12.3 19.4 13.1 21 14.6 23 H9.4 C10.9 21 11.7 19.4 12 17 C11.7 17.4 11.3 17.8 10.6 18.2 C7.4 19.8 4 17.6 4 14 C4 7 10.2 3.6 12 0Z" />
        <path id="i-heart" d="M12 22C9 18 2 13 2 7.6 C2 3.6 7 1 12 6 C17 1 22 3.6 22 7.6 C22 13 15 18 12 22Z" />
        <path id="i-diamond" d="M12 0 L21 12 L12 24 L3 12Z" />
        <g id="i-martini">
          <path d="M3 3 H21 L12 13 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <line x1="12" y1="13" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
          <line x1="7" y1="21" x2="17" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g id="i-dine">
          <path d="M6 2 V11 M4 2 V7 C4 8.5 5 9 6 9 M8 2 V7 C8 8.5 7 9 6 9 M6 9 V22" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 2 C14.5 2 13.5 5 13.5 8 C13.5 10.5 14.8 11.5 16 11.8 V22 M16 11.8 C17.2 11.5 18.5 10.5 18.5 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g id="i-party">
          <path d="M3 21 L10 6 L18 14 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="18" cy="5" r="1.6" fill="currentColor" />
          <circle cx="21" cy="10" r="1.1" fill="currentColor" />
          <circle cx="15" cy="2.5" r="1" fill="currentColor" />
        </g>
        <g id="i-grid">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </g>
        <g id="i-home">
          <path d="M4 11 L12 4 L20 11 V20 H14 V14 H10 V20 H4 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
        <g id="i-ticket">
          <path d="M3 9 C4.1 9 5 8.1 5 7 C5 5.9 4.1 5 3 5 V4 H21 V5 C19.9 5 19 5.9 19 7 C19 8.1 19.9 9 21 9 V15 C19.9 15 19 15.9 19 17 C19 18.1 19.9 19 21 19 V20 H3 V19 C4.1 19 5 18.1 5 17 C5 15.9 4.1 15 3 15 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
        <g id="i-plus">
          <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g id="i-chat">
          <path d="M4 5 H20 V16 H12 L7 20 V16 H4 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
        <g id="i-user">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 21 C4 16.5 7.5 14 12 14 C16.5 14 20 16.5 20 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g id="i-bell">
          <path d="M12 3 C9.5 3 8 5 8 8 V11 C8 13 7.3 14.3 6 15.5 H18 C16.7 14.3 16 13 16 11 V8 C16 5 14.5 3 12 3 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 18 C10 19.1 10.9 20 12 20 C13.1 20 14 19.1 14 18" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </g>
        <g id="i-star">
          <path d="M12 3 L14.7 9 L21 9.8 L16.3 14 L17.6 20.3 L12 17.1 L6.4 20.3 L7.7 14 L3 9.8 L9.3 9 Z" fill="currentColor" />
        </g>
        <g id="i-check">
          <circle cx="12" cy="12" r="10" fill="#b968ff" />
          <path d="M7.5 12.5 L10.3 15.3 L16.5 9" fill="none" stroke="#1f1810" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g id="i-seat">
          <circle cx="12" cy="7" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </g>
        <g id="i-pin">
          <path d="M12 22 C12 22 20 15 20 9 A8 8 0 0 0 4 9 C4 15 12 22 12 22Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2.6" fill="currentColor" stroke="none" />
        </g>
        <g id="i-clock">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7 V12 L16 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g id="i-shield">
          <path d="M12 3 L20 6 V12 C20 17 16.4 20 12 21.5 C7.6 20 4 17 4 12 V6 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8.6 12 L11 14.4 L15.6 9.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g id="i-chip-stack">
          <ellipse cx="0" cy="0" rx="19" ry="7" fill="#ff4f9e" />
          <path d="M-19 0 V4 A19 7 0 0 0 19 4 V0 Z" fill="#a01866" />
          <ellipse cx="0" cy="-5" rx="19" ry="7" fill="#ff4f9e" />
          <ellipse cx="0" cy="-5" rx="19" ry="7" fill="none" stroke="#f4efe2" strokeWidth="3.6" strokeDasharray="4 5" />
          <path d="M-19 -5 V-1 A19 7 0 0 0 19 -1 V-5 Z" fill="#a01866" />
          <ellipse cx="0" cy="-10" rx="19" ry="7" fill="#4cc9f0" />
          <ellipse cx="0" cy="-10" rx="19" ry="7" fill="none" stroke="#f4efe2" strokeWidth="3.6" strokeDasharray="4 5" />
        </g>
        <g id="i-calendar">
          <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.7" />
          <line x1="7" y1="3" x2="7" y2="7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="17" y1="3" x2="17" y2="7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </g>
        <g id="i-back">
          <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g id="i-share">
          <circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="6" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="18" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <line x1="8.2" y1="10.8" x2="14.9" y2="7.2" stroke="currentColor" strokeWidth="1.8" />
          <line x1="8.2" y1="13.2" x2="14.9" y2="16.8" stroke="currentColor" strokeWidth="1.8" />
        </g>
        <g id="i-lock">
          <rect x="5" y="10" width="14" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 10 V7 C8 4.8 9.8 3 12 3 C14.2 3 16 4.8 16 7 V10" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </g>
        <g id="i-flag">
          <path d="M6 21 V4 M6 4 H18 L15 8 L18 12 H6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
        <g id="i-cog">
          <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 3 V5.4 M12 18.6 V21 M3 12 H5.4 M18.6 12 H21 M5.6 5.6 L7.3 7.3 M16.7 16.7 L18.4 18.4 M18.4 5.6 L16.7 7.3 M7.3 16.7 L5.6 18.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </g>
        <g id="i-chev-r">
          <path d="M9 6 L15 12 L9 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g id="i-img">
          <rect x="3" y="4" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="9" r="1.6" fill="currentColor" />
          <path d="M4 16 L9 11 L13 14.5 L16 11.5 L20 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </g>
        <linearGradient id="l-goldline" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4d4ff" />
          <stop offset=".5" stopColor="#b968ff" />
          <stop offset="1" stopColor="#6d1fd1" />
        </linearGradient>
        <g id="i-mic">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path d="M6 11 C6 14.3 8.7 17 12 17 C15.3 17 18 14.3 18 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g id="nm-chip-flat">
          <ellipse cx="0" cy="0" rx="52" ry="19" />
          <ellipse cx="0" cy="0" rx="52" ry="19" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="10 13" opacity=".9" />
          <ellipse cx="0" cy="0" rx="34" ry="12.4" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".55" />
          <ellipse cx="-10" cy="-7" rx="28" ry="8" fill="#fff" opacity=".35" />
        </g>
        <g id="nm-mark">
          <circle cx="60" cy="60" r="58" fill="none" stroke="url(#l-goldline)" strokeWidth="2.4" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="url(#l-goldline)" strokeWidth="1" strokeDasharray="2.6 5.2" opacity=".8" />
          <text x="60" y="78" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="58" fill="url(#l-goldline)">N</text>
          <use href="#i-spade" transform="translate(60 93) scale(.62)" fill="url(#l-goldline)" />
        </g>
      </defs>
    </svg>
  )
}
