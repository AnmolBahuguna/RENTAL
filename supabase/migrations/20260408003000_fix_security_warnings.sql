-- Fix Function Search Path Mutable warning for increment_views
CREATE OR REPLACE FUNCTION increment_views(property_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.properties
  SET views = views + 1
  WHERE id = property_id;
END;
$$;

-- Fix RLS Enabled No Policy warning for favorites table
DROP POLICY IF EXISTS "Users view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users delete own favorites" ON public.favorites;

CREATE POLICY "Users view own favorites" 
    ON public.favorites FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users insert own favorites" 
    ON public.favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own favorites" 
    ON public.favorites FOR DELETE 
    USING (auth.uid() = user_id);
