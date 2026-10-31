-- RLS was enabled on `bookings` in 001_initial_schema.sql but, like
-- `events` before 002_public_private_radius.sql, no actual policies were
-- ever added -- so the anon/authenticated client could not read or write
-- a single row, and the "Request to join" button had nothing it could
-- call. These are the policies a guest-requests/host-approves flow needs:
--
--  - a guest can create their own booking request (and only their own)
--  - a guest can see their own booking's status
--  - the event's host can see every booking made against their event
--  - the event's host can update (approve/reject) those bookings

DROP POLICY IF EXISTS "Guests can request to join an event" ON bookings;
CREATE POLICY "Guests can request to join an event"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = guest_id);

DROP POLICY IF EXISTS "Guests can view their own booking" ON bookings;
CREATE POLICY "Guests can view their own booking"
  ON bookings FOR SELECT
  USING (auth.uid() = guest_id);

DROP POLICY IF EXISTS "Hosts can view bookings on their events" ON bookings;
CREATE POLICY "Hosts can view bookings on their events"
  ON bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = bookings.event_id AND events.host_id = auth.uid()));

DROP POLICY IF EXISTS "Hosts can approve or reject bookings on their events" ON bookings;
CREATE POLICY "Hosts can approve or reject bookings on their events"
  ON bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = bookings.event_id AND events.host_id = auth.uid()));
