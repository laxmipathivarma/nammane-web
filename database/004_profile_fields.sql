-- Adds the fields the real profile-edit page needs: an avatar choice
-- (a key into a fixed catalog of built-in avatars, not an uploaded photo),
-- interests (max 5-6, enforced in the app layer), a government ID on file
-- for trust/verification (type + number -- India-specific types only, this
-- is a Wave 1 India-only app), and a profile_status so an under-18 signup
-- can be held as "pending" instead of silently treated as a normal active
-- profile. city and date_of_birth already existed (001_initial_schema.sql)
-- but were never actually editable from the app until now.
--
-- Run directly against production via the Supabase SQL editor, same as
-- 003_event_details_column.sql -- this file documents the change for
-- anyone diffing the schema later.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_key TEXT,
  ADD COLUMN IF NOT EXISTS interests TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS govt_id_type TEXT
    CHECK (govt_id_type IS NULL OR govt_id_type IN ('aadhaar', 'pan', 'voter_id', 'passport')),
  ADD COLUMN IF NOT EXISTS govt_id_number TEXT,
  ADD COLUMN IF NOT EXISTS govt_id_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS profile_status TEXT NOT NULL DEFAULT 'active'
    CHECK (profile_status IN ('active', 'pending_age_review'));

COMMENT ON COLUMN profiles.avatar_key IS
  'Key into the built-in avatar catalog (src/lib/avatars.ts), e.g. "cat" or "shield-guardian". Never an uploaded photo -- Wave 1 uses picked avatars only.';
COMMENT ON COLUMN profiles.interests IS
  'Up to 6 interest tags, picked from a fixed list or typed in by the user (src/lib/interests.ts).';
COMMENT ON COLUMN profiles.govt_id_type IS
  'Which Indian government ID is on file: aadhaar, pan, voter_id, or passport.';
COMMENT ON COLUMN profiles.govt_id_number IS
  'The ID number itself, format-validated client- and server-side per govt_id_type (src/lib/govtId.ts). Not cross-checked against any government database -- self-declared, same trust level as phone/email verification.';
COMMENT ON COLUMN profiles.govt_id_verified IS
  'Always false for now -- there is no integration verifying the ID number against a real registry yet. Reserved for when/if that is added.';
COMMENT ON COLUMN profiles.profile_status IS
  '"active" (default) or "pending_age_review" -- set to pending_age_review whenever the saved date_of_birth implies the person is under 18. A pending profile is held back from hosting/joining events until manually reviewed.';
