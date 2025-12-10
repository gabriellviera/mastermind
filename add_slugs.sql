-- ============================================
-- AGREGAR SLUGS AMIGABLES A CURSOS
-- ============================================

-- 1. Agregar columna slug
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug text;

-- 2. Crear extensión para limpiar texto (si es necesario unidecode, pero usaremos regex simple por ahora)
-- Actualizar slugs existentes basados en el título
UPDATE public.courses
SET slug = lower(
    regexp_replace(
        regexp_replace(title, '[ÁÉÍÓÚáéíóúñÑ]', 'a', 'g'), -- Simplificación básica (mejorar si es necesario)
        '[^a-zA-Z0-9]+', '-', 'g' -- Reemplazar no alfanuméricos con guiones
    )
);

-- Limpiar guiones al inicio o final
UPDATE public.courses SET slug = trim(both '-' from slug);

-- 3. Hacerlo único y obligatorio
ALTER TABLE public.courses ADD CONSTRAINT courses_slug_key UNIQUE (slug);
ALTER TABLE public.courses ALTER COLUMN slug SET NOT NULL;

-- 4. Verificar
SELECT title, slug FROM public.courses;
