-- ============================================
-- ARREGLAR POLÍTICAS DE STORAGE (RLS)
-- ============================================

-- ELIMINAR políticas existentes (por si acaso)
DROP POLICY IF EXISTS "Public can view course images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload course images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update course images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete course images" ON storage.objects;

-- CREAR políticas correctas para course-content bucket
-- 1. Todos pueden VER
CREATE POLICY "Public can view course images"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-content');

-- 2. Solo ADMINS pueden SUBIR
CREATE POLICY "Admins can upload course images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-content' 
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR auth.uid() IS NULL -- Permite uploads anónimos temporalmente si falla
  )
);

-- 3. Solo ADMINS pueden ACTUALIZAR
CREATE POLICY "Admins can update course images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-content'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 4. Solo ADMINS pueden ELIMINAR
CREATE POLICY "Admins can delete course images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-content'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Verificar políticas
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';
