-- Add onboarding_data column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_data jsonb DEFAULT NULL;

COMMENT ON COLUMN public.profiles.onboarding_data IS 'Stores preferences from the onboarding quiz for personalized recommendations.';
