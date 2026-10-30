// A fixed catalog of pickable profile avatars -- not uploaded photos.
// Each one is just an emoji + a gradient badge (rendered by AvatarBadge,
// src/components/AvatarBadge.tsx), so there's no image storage, no upload
// flow, and nothing to moderate. The "hero" group leans into a
// superhero/space-adventure mood (the vibe people asked for when they said
// "like Avengers and Star Wars") without using any actual copyrighted
// character likeness or name -- these are original archetypes (a shield,
// a hammer, a mech suit, a lightsaber-style blade), not the real thing.
export type AvatarGroup = 'people' | 'animals' | 'funny' | 'heroes'

export type AvatarOption = {
  key: string
  label: string
  emoji: string
  group: AvatarGroup
  gradient: readonly [string, string]
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  // People
  { key: 'male', label: 'Guy', emoji: '🧑', group: 'people', gradient: ['#4cc9f0', '#1a8fd1'] },
  { key: 'female', label: 'Woman', emoji: '👩', group: 'people', gradient: ['#ff8fd1', '#8b3ffb'] },

  // Animals
  { key: 'cat', label: 'Cat', emoji: '🐱', group: 'animals', gradient: ['#ffd166', '#e8942c'] },
  { key: 'dog', label: 'Dog', emoji: '🐶', group: 'animals', gradient: ['#c23ffb', '#8b3ffb'] },
  { key: 'fish', label: 'Fish', emoji: '🐟', group: 'animals', gradient: ['#4cc9f0', '#8b3ffb'] },

  // Funny
  { key: 'robot', label: 'Robot', emoji: '🤖', group: 'funny', gradient: ['#7fe3a1', '#4cc9f0'] },
  { key: 'alien', label: 'Alien', emoji: '👽', group: 'funny', gradient: ['#7fe3a1', '#8b3ffb'] },
  { key: 'ghost', label: 'Ghost', emoji: '👻', group: 'funny', gradient: ['#cfc9e6', '#8b3ffb'] },
  { key: 'unicorn', label: 'Unicorn', emoji: '🦄', group: 'funny', gradient: ['#ff8fd1', '#ffd166'] },
  { key: 'ninja', label: 'Ninja', emoji: '🥷', group: 'funny', gradient: ['#4a4a6a', '#1a1533'] },
  { key: 'wizard', label: 'Wizard', emoji: '🧙', group: 'funny', gradient: ['#8b3ffb', '#4cc9f0'] },

  // Heroes -- original superhero/space-adventure archetypes
  { key: 'shield-guardian', label: 'Shield Guardian', emoji: '🛡️', group: 'heroes', gradient: ['#4cc9f0', '#1a8fd1'] },
  { key: 'thunder-hammer', label: 'Thunder Hammer', emoji: '🔨', group: 'heroes', gradient: ['#ffd166', '#e8942c'] },
  { key: 'mech-suit', label: 'Mech Suit', emoji: '🦾', group: 'heroes', gradient: ['#ff4f9e', '#c23ffb'] },
  { key: 'galaxy-knight', label: 'Galaxy Knight', emoji: '⚔️', group: 'heroes', gradient: ['#7fe3a1', '#4cc9f0'] },
  { key: 'giant-smash', label: 'Giant Smash', emoji: '💥', group: 'heroes', gradient: ['#7fe3a1', '#2c8f4a'] },
  { key: 'star-ranger', label: 'Star Ranger', emoji: '🚀', group: 'heroes', gradient: ['#8b3ffb', '#ff4f9e'] },
]

export const AVATAR_GROUP_LABELS: Record<AvatarGroup, string> = {
  people: 'People',
  animals: 'Animals',
  funny: 'Just for fun',
  heroes: 'Heroes',
}

export function avatarByKey(key: string | null | undefined): AvatarOption | undefined {
  return AVATAR_OPTIONS.find((a) => a.key === key)
}
