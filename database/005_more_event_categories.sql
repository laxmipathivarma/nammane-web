-- Widen events.category to allow the new event types the host-create
-- picker now offers (Marriage, Movie night, Trip, Birthday, Fest, Meet Up,
-- Cycling, Biking, Trekking, Outing, Get together, Engagement) alongside
-- the original six. The app's category metadata (labels/emoji/colors)
-- lives in src/lib/eventCardStyle.ts -- keep that list and this CHECK in
-- sync if more categories are added later.
--
-- Run this directly against production via the Supabase SQL editor
-- (no live DB connection from the assistant's environment).

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

ALTER TABLE events ADD CONSTRAINT events_category_check CHECK (
  category IN (
    'poker', 'rummy', 'drinks', 'dinner', 'party', 'other',
    'marriage', 'movie_night', 'trip', 'birthday', 'fest', 'meetup',
    'cycling', 'biking', 'trekking', 'outing', 'get_together', 'engagement'
  )
);
