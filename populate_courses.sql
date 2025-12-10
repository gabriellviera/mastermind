-- ============================================
-- INSERTAR CURSOS DE EJEMPLO EN SUPABASE
-- ============================================
-- Ejecuta este SQL en Supabase SQL Editor para crear cursos reales

INSERT INTO public.courses (id, title, description, price, image_url, created_at) VALUES
  (
    'mindset-tiburon',
    'Mentalidad de Tiburón',
    'Rompe tus límites mentales y domina tu entorno. Aprende las técnicas de los líderes más exitosos para desarrollar una mentalidad inquebrantable y alcanzar tus objetivos más ambiciosos.',
    99,
    'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    now()
  ),
  (
    'marketing-elite',
    'Marketing Elite',
    'Estrategias de venta para high-ticket. Domina el arte de vender productos y servicios premium, construye embudos de conversión efectivos y escala tu negocio al siguiente nivel.',
    149,
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    now()
  ),
  (
    'biohacking',
    'Biohacking Total',
    'Optimiza tu sueño, energía y testosterona. Descubre los secretos del biohacking para maximizar tu rendimiento físico y mental, mejorar tu salud y vivir con más energía.',
    199,
    'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    now()
  );

-- Verificar que se insertaron correctamente
SELECT * FROM public.courses ORDER BY created_at DESC;
