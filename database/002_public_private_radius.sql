-- Adds public/private visibility and a host-selected discovery radius to
-- events, plus plain lat/lng columns so the client can do simple distance
-- filtering (Haversine in JS) without needing PostGIS functions exposed
-- through the REST API. The existing `location GEOMETRY(POINT,4326)`
-- column is left as-is for any future geospatial query needs.

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS radius_km INTEGER,
  ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

ALTER TABLE events
  ADD CONSTRAINT events_radius_km_range
    CHECK (radius_km IS NULL OR (radius_km BETWEEN 1 AND 100));

COMMENT ON COLUMN events.is_public IS
  'true = discoverable by anyone within radius_km of the host''s location; false = visible only to the host and people they explicitly invite/approve.';
COMMENT ON COLUMN events.radius_km IS
  'Host-selected discovery radius in km (1-100), only meaningful when is_public = true.';
COMMENT ON COLUMN events.lat IS 'Host''s location latitude at publish time, used for radius filtering.';
COMMENT ON COLUMN events.lng IS 'Host''s location longitude at publish time, used for radius filtering.';

-- Public events are readable by anyone (even signed-out) once published --
-- that's the whole point of "public". Private events stay host-only for
-- now (inviting specific guests is a future enhancement on top of this).
DROP POLICY IF EXISTS "Public events are viewable by everyone" ON events;
CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (status = 'published' AND is_public = true);

DROP POLICY IF EXISTS "Hosts can view their own events" ON events;
CREATE POLICY "Hosts can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = host_id);

-- RLS was enabled on `events` in 001_initial_schema.sql but no INSERT/
-- UPDATE policy was ever added, so hosts could not actually create or
-- edit events through the anon/authenticated client at all -- only a
-- service-role request could write to this table. Add the policies a
-- host-create-event flow actually needs.
DROP POLICY IF EXISTS "Hosts can create their own events" ON events;
CREATE POLICY "Hosts can create their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can update their own events" ON events;
CREATE POLICY "Hosts can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = host_id);
