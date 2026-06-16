-- 004_bootstrap_test_inspector.sql
-- MVP/dev: test verified_inspector bootstrap
-- Founder admin: emirhanakdemir9@gmail.com
-- Test müfettiş: emirhanakdemir9+inspector@gmail.com

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.user_role;
  normalized_email TEXT;
BEGIN
  normalized_email := LOWER(TRIM(NEW.email));

  IF normalized_email = 'emirhanakdemir9@gmail.com' THEN
    assigned_role := 'admin';
  ELSIF normalized_email = 'emirhanakdemir9+inspector@gmail.com' THEN
    assigned_role := 'verified_inspector';
  ELSE
    assigned_role := 'citizen';
  END IF;

  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;

UPDATE public.profiles
SET role = 'verified_inspector'
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE LOWER(TRIM(email)) = 'emirhanakdemir9+inspector@gmail.com'
)
AND role IS DISTINCT FROM 'verified_inspector';
