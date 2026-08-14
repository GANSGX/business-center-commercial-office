-- Additive and safe for existing production rows:
-- hidePrice defaults to false, so current rooms keep showing the price.
ALTER TABLE "Room"
ADD COLUMN IF NOT EXISTS "hidePrice" BOOLEAN NOT NULL DEFAULT false;
