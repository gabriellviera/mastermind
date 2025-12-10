-- ============================================
-- ARREGLAR DUPLICADOS Y AGREGAR SLUGS
-- ============================================

-- 1. Eliminar cursos duplicados (dejando solo el más reciente de cada título)
DELETE FROM public.courses a USING public.courses b
WHERE a.id < b.id AND a.title = b.title;

-- 2. Agregar columna slug (si no existe)
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug text;

-- 3. Actualizar slugs
UPDATE public.courses
SET slug = lower(
    regexp_replace(
        regexp_replace(title, '[ÁÉÍÓÚáéíóúñÑ]', 'a', 'g'), 
        '[^a-zA-Z0-9]+', '-', 'g'
    )
);

-- Limpiar
UPDATE public.courses SET slug = trim(both '-' from slug);

-- 4. Ahora sí, hacerlo único y obligatorio
ALTER TABLE public.courses ADD CONSTRAINT courses_slug_key UNIQUE (slug);
ALTER TABLE public.courses ALTER COLUMN slug SET NOT NULL;

-- 5. Verificar resultado
SELECT title, slug FROM public.courses;
