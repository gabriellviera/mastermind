-- ============================================
-- ARREGLAR ERROR DE SIGNUP (Database Error)
-- ============================================

-- 1. VERIFICAR si la función existe
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- 2. ELIMINAR trigger y función viejos (por si acaso)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. CREAR FUNCIÓN CORREGIDA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'student'
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$;

-- 4. CREAR TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. VERIFICAR
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
