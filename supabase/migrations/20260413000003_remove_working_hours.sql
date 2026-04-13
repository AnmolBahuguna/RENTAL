-- migration to drop working_hours and is_open from service_providers
ALTER TABLE public.service_providers DROP COLUMN IF EXISTS working_hours;
ALTER TABLE public.service_providers DROP COLUMN IF EXISTS is_open;
