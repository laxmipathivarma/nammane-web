'use client'

import { avatarByKey } from '@/lib/avatars'

// Renders a picked avatar (gradient circle + emoji) anywhere in the app,
// falling back to the person's initial when no avatar has been chosen yet
// -- same fallback the header/profile page already used before avatars
// existed, so nothing looks broken for an existing account that hasn't
// picked one.
export default function AvatarBadge({
  avatarKey,
  fallbackInitial,
  size = 40,
}: {
  avatarKey: string | null | undefined
  fallbackInitial: string
  size?: number
}) {
  const avatar = avatarByKey(avatarKey)
  const gradient = avatar ? avatar.gradient : (['#ff8fd1', '#8b3ffb'] as const)

  return (
    <span
      className="rounded-full flex items-center justify-center shrink-0 text-white font-extrabold shadow-xl"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(160deg,${gradient[0]},${gradient[1]})`,
        fontSize: avatar ? size * 0.55 : size * 0.4,
      }}
    >
      {avatar ? avatar.emoji : fallbackInitial}
    </span>
  )
}
