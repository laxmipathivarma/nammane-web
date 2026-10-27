'use client'

import AnimatedLogo from './AnimatedLogo'

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* brand panel */}
      <div className="nm-bg relative flex flex-col items-center justify-center px-8 py-16 md:w-1/2 text-white overflow-hidden">
        <div
          className="absolute -inset-x-20 -top-20 h-72 pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 0%, rgba(139,63,251,.18), rgba(255,79,158,.12), transparent 40%, transparent 60%, rgba(139,63,251,.18))',
            filter: 'blur(2px)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <AnimatedLogo size={120} />
          <p className="text-center text-[15px] text-muted font-semibold mt-6 max-w-xs leading-relaxed">
            Game nights, dinners, dance floors and birthdays, at home.
          </p>
          <p className="text-[11px] text-muted2 font-medium mt-10">© 2026 NamMane</p>
        </div>
      </div>

      {/* form panel */}
      <div className="flex-1 bg-ink flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
