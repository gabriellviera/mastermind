-- ============================================
-- CREAR BUCKET PÚBLICO PARA LECCIONES GRATUITAS
-- ============================================

-- 1. Crear bucket público (manually in Supabase UI or via SQL)
-- Ve a Storage → New bucket:
-- Name: public-lessons
-- Public: YES ✓
-- Or run this in SQL:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-lessons', 'public-lessons', true, 524288000, ARRAY['video/*']);

-- 2. Policies para public-lessons (TODOS pueden ver, solo ADMINS pueden subir)

CREATE POLICY "Anyone can view public lessons"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-lessons');

CREATE POLICY "Admins can upload public lessons"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-lessons'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update public lessons"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public-lessons'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete public lessons"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-lessons'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. VERIFICAR
SELECT * FROM storage.buckets WHERE id = 'public-lessons';
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%public lessons%';
