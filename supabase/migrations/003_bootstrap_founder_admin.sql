-- 003_bootstrap_founder_admin.sql
-- MVP/dev: kurucu admin bootstrap
-- Founder e-posta: emirhanakdemir9@gmail.com

-- Yeni kayıt: founder admin, diğerleri citizen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.user_role;
BEGIN
  IF LOWER(TRIM(NEW.email)) = 'emirhanakdemir9@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'citizen';
  END IF;

  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;

-- Mevcut founder hesabı varsa role admin yap (idempotent)
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE LOWER(TRIM(email)) = 'emirhanakdemir9@gmail.com'
)
AND role IS DISTINCT FROM 'admin';
