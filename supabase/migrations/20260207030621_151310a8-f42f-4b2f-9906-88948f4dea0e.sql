-- Fix remaining issues: advisories and govt_schemes write protection
-- Also ensure profiles INSERT requires authentication

-- Re-create profiles INSERT policy with auth.uid() check
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Advisories: Add INSERT and DELETE blocking (SELECT and UPDATE already exist)
CREATE POLICY "No direct insert on advisories"
ON public.advisories
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct delete on advisories"
ON public.advisories
FOR DELETE
USING (false);

-- Govt schemes: Add INSERT, UPDATE, DELETE blocking (SELECT already exists)
CREATE POLICY "No direct insert on govt_schemes"
ON public.govt_schemes
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct update on govt_schemes"
ON public.govt_schemes
FOR UPDATE
USING (false);

CREATE POLICY "No direct delete on govt_schemes"
ON public.govt_schemes
FOR DELETE
USING (false);

-- Market prices: Add INSERT, UPDATE, DELETE blocking (SELECT already exists)
CREATE POLICY "No direct insert on market_prices"
ON public.market_prices
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct update on market_prices"
ON public.market_prices
FOR UPDATE
USING (false);

CREATE POLICY "No direct delete on market_prices"
ON public.market_prices
FOR DELETE
USING (false);