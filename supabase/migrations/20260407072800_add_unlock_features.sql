-- Add contact details and exact location to properties
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS exact_location text;

-- Create unlocked_properties table
CREATE TABLE IF NOT EXISTS public.unlocked_properties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.unlocked_properties ENABLE ROW LEVEL SECURITY;

-- Policies for unlocked_properties
-- 1. Users can view their own unlocked properties
CREATE POLICY "Users can view their own mapped properties" 
    ON public.unlocked_properties FOR SELECT 
    USING (auth.uid() = user_id);

-- 2. Landlords can view who unlocked their properties (optional, but good for future)
CREATE POLICY "Landlords can view unlocks for their properties" 
    ON public.unlocked_properties FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p 
            WHERE p.id = unlocked_properties.property_id 
            AND p.landlord_id = auth.uid()
        )
    );

-- 3. We do NOT allow inserts from the client. Inserts only happen from Edge Functions (Service Role).
