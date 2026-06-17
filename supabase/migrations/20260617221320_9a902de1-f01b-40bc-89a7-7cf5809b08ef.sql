
-- App roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see their roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Products
CREATE TYPE public.product_category AS ENUM ('water', 'sparkling', 'soft_drinks', 'packs');

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  category public.product_category NOT NULL,
  price_tnd NUMERIC(10,3) NOT NULL,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed products
INSERT INTO public.products (name, size, category, price_tnd, featured, sort_order) VALUES
('Water Bottle', '0.5L', 'water', 0.600, false, 10),
('Water Bottle', '1L', 'water', 0.900, true, 20),
('Water Bottle', '1.5L', 'water', 1.200, true, 30),
('Large Water Bottle', '6L', 'water', 2.500, false, 40),
('Gallon Water', '10L', 'water', 3.500, true, 50),
('Sparkling Water', '1L', 'sparkling', 1.000, false, 60),
('Sparkling Water', '1.5L', 'sparkling', 1.300, false, 70),
('Coca-Cola', '0.33L', 'soft_drinks', 1.200, false, 80),
('Coca-Cola', '1L', 'soft_drinks', 2.500, true, 90),
('Coca-Cola', '2L', 'soft_drinks', 3.500, false, 100),
('Fanta', '1L', 'soft_drinks', 2.300, false, 110),
('Sprite', '1L', 'soft_drinks', 2.300, false, 120),
('Pack Water', '6 × 1.5L', 'packs', 6.500, true, 130),
('Pack Water', '12 × 0.5L', 'packs', 6.000, false, 140),
('Family Mixed Pack', 'Mixed', 'packs', 10.000, true, 150),
('Office Bulk Pack', 'Bulk', 'packs', 20.000, true, 160);
