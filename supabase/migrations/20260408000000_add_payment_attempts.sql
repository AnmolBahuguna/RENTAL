-- payment_attempts table for rate limiting order creation
-- Max 5 attempts per user per hour enforced in Edge Function

CREATE TABLE IF NOT EXISTS payment_attempts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast rate-limit lookups: (user_id, created_at DESC)
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_time
  ON payment_attempts (user_id, created_at DESC);

-- Auto-cleanup: delete attempts older than 30 days to keep table lean
-- (Optional: set up a pg_cron job or handle via periodic Supabase function)

-- Row Level Security — users can only see their own attempts
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment attempts"
  ON payment_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Only Edge Functions (service role) can insert — users cannot insert directly
-- No INSERT policy for authenticated users intentionally
