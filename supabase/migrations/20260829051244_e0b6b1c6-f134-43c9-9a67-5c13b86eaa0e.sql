CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  size text NOT NULL,
  pack_qty integer NOT NULL DEFAULT 3,
  price_tnd numeric NOT NULL,
  old_price_tnd numeric NOT NULL,
  image_url text,
  available boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.promotions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read promotions" ON public.promotions
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert promotions" ON public.promotions
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update promotions" ON public.promotions
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete promotions" ON public.promotions
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER promotions_set_updated_at BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.promotions (name, size, pack_qty, price_tnd, old_price_tnd, image_url, available, active, sort_order) VALUES
  ('Vivian', '2 L', 3, 12.000, 4.300, 'https://i.ibb.co/fGLRK8bQ/vivan-1-5.png', false, true, 10),
  ('Melina', '2 L', 3, 12.000, 4.300, 'https://i.ibb.co/ccjtXMkW/melina-2-L.webp', false, true, 20),
  ('Pristine', '2 L', 3, 12.000, 4.300, 'https://i.ibb.co/Z1dHMXk7/pristine-2l.webp', false, true, 30),
  ('My Tunisia', '2 L', 3, 12.000, 4.300, 'https://i.ibb.co/YBgd3Jr1/MY-TUNISIA-1-5.jpg', false, true, 40);

DROP INDEX IF EXISTS public.one_admin_only;
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_role_unique ON public.user_roles (user_id, role);