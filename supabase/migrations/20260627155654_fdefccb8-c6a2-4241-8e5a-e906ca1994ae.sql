-- Move has_role to a non-exposed schema and enforce single-admin invariant.

-- 1. Private schema for security-definer helpers (not exposed to PostgREST).
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

-- 2. Recreate has_role in private schema.
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- 3. Update RLS policies on products to reference private.has_role.
DROP POLICY IF EXISTS "Admins delete products" ON public.products;
DROP POLICY IF EXISTS "Admins insert products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;

CREATE POLICY "Admins delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Drop the public-exposed has_role now that nothing references it.
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 5. Enforce at most one admin at the database level (prevents claim race).
CREATE UNIQUE INDEX IF NOT EXISTS one_admin_only
  ON public.user_roles ((1))
  WHERE role = 'admin'::public.app_role;
