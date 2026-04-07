-- Fix RLS for recently_viewed to correctly support upserts
DROP POLICY IF EXISTS "Users view own recently viewed" ON public.recently_viewed;
DROP POLICY IF EXISTS "Users insert/update own recently viewed" ON public.recently_viewed;

CREATE POLICY "Users view own recently viewed" 
    ON public.recently_viewed FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users insert/update own recently viewed" 
    ON public.recently_viewed FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Ensure unlocked_properties table exists and has proper RLS (for safety)
ALTER TABLE public.unlocked_properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own mapped properties" ON public.unlocked_properties;
CREATE POLICY "Users can view their own mapped properties" 
    ON public.unlocked_properties FOR SELECT 
    USING (auth.uid() = user_id);
