'use client'

export default function AuthShell({
  children,
  blobs,
}: {
  children: React.ReactNode
  blobs?: { style: React.CSSProperties }[]
}) {
  const defaultBlobs: { style: React.CSSProperties }[] = [
    {
      style: {
        position: 'absolute',
        width: 420,
        height: 420,
        left: -160,
        top: -140,
        borderRadius: 999,
        background: 'radial-gradient(circle,#8b3ffb,transparent 70%)',
        opacity: 0.5,
        filter: 'blur(10px)',
      },
    },
    {
      style: {
        position: 'absolute',
        width: 360,
        height: 360,
        right: -140,
        top: 380,
        borderRadius: 999,
        background: 'radial-gradient(circle,#ff4f9e,transparent 70%)',
        opacity: 0.4,
        filter: 'blur(10px)',
      },
    },
  ]

  return (
    <div className="min-h-screen nm-bg relative overflow-hidden flex items-center justify-center px-5 py-12">
      {(blobs ?? defaultBlobs).map((b, i) => (
        <div key={i} style={b.style} />
      ))}
      <div className="w-full max-w-sm relative z-10">{children}</div>
    </div>
  )
}
