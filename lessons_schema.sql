-- ============================================
-- TABLA DE LECCIONES/CLASES DE CURSOS
-- ============================================

-- Crear tabla de lecciones
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  video_url text, -- URL del video en Supabase Storage o YouTube/Vimeo
  duration integer, -- Duración en minutos
  order_index integer DEFAULT 0, -- Para ordenar las lecciones
  is_free boolean DEFAULT false, -- Si es una lección gratuita (preview)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden ver lecciones gratuitas, solo inscritos ven premium
CREATE POLICY "Anyone can view free lessons" ON public.lessons
  FOR SELECT USING (is_free = true);

CREATE POLICY "Enrolled students can view lessons" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = lessons.course_id
      AND enrollments.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Solo admins pueden crear/editar/eliminar lecciones
CREATE POLICY "Admins can insert lessons" ON public.lessons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lessons" ON public.lessons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete lessons" ON public.lessons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS lessons_course_id_idx ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS lessons_order_idx ON public.lessons(order_index);

-- Verificar
SELECT * FROM public.lessons ORDER BY course_id, order_index;
