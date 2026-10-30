-- Adds a JSONB `event_details` column directly on `events`, used by
-- category-specific tooling (currently just the poker host toolkit:
-- invitees, tables, buy-ins, rake/expenses, settle-up) to store its data
-- without a schema migration per category.
--
-- NOTE: this is intentionally separate from the pre-existing
-- `event_details` TABLE (event_id PK, details JSONB) in
-- 001_initial_schema.sql. That table was never actually wired up to any
-- application code -- the poker API route (src/app/api/events/[id]/poker)
-- was written assuming `events.event_details` was a column, and shipped
-- without anyone catching the mismatch (lint/type-check don't see the
-- live DB schema), so every read of it silently failed and the route
-- returned "Event not found" for every event. This column is the fix:
-- it matches what the app code already expects, inherits the existing
-- RLS policies on `events` (no new policy needed), and the unused
-- `event_details` table is left in place for now rather than risking a
-- drop against data nobody has audited.
--
-- Run directly against production via the Supabase SQL editor on
-- 2026-10-30 -- this file documents that change for anyone diffing the
-- schema later; it has not been re-run through a migration tool.

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS event_details JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN events.event_details IS
  'Category-specific data (e.g. {"poker": {...}} for poker events -- invitees, tables, ledgers). JSONB so each category can own its own shape without a schema migration.';
