-- Fix profiles INSERT policy - ensure it's properly restrictive
-- The policy should already exist but let's ensure auth.uid() IS NOT NULL check is there
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix price_notifications - block direct INSERT (only service role should insert)
CREATE POLICY "No direct insert on price_notifications"
ON public.price_notifications
FOR INSERT
WITH CHECK (false);