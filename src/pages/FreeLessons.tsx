import { useState, useEffect } from 'react';
import { PlayCircle, Clock, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type FreeLesson = {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  video_url: string | null;
  course: {
    id: string;
    title: string;
    image_url: string | null;
  };
};

export default function FreeLessons() {
  const [lessons, setLessons] = useState<FreeLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreeLessons();
  }, []);

  const fetchFreeLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          duration,
          video_url,
          course:courses (
            id,
            title,
            image_url
          )
        `)
        .eq('is_free', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        duration: item.duration,
        video_url: item.video_url,
        course: item.course
      })) || [];

      setLessons(formatted);
    } catch (error) {
      console.error('Error fetching free lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Clases <span className="text-neon-green">Abiertas</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Explora nuestras lecciones gratuitas. {lessons.length} {lessons.length === 1 ? 'lección disponible' : 'lecciones disponibles'}.
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Lock className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No hay lecciones gratuitas disponibles aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/curso/${lesson.course.id}?lesson=${lesson.id}`}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-neon-green/50 transition-all hover:scale-[1.02] active:scale-95"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-black overflow-hidden">
                  {lesson.course.image_url ? (
                    <img
                      src={lesson.course.image_url}
                      alt={lesson.course.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    />
                  ) : null}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <PlayCircle className="text-neon-green" size={32} />
                    </div>
                  </div>

                  {/* FREE badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    GRATIS
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{lesson.course.title}</p>
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-neon-green transition-colors">
                    {lesson.title}
                  </h3>
                  
                  {lesson.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {lesson.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    {lesson.duration && (
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock size={14} />
                        <span>{lesson.duration} min</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-neon-green font-bold text-sm">
                      Ver Ahora
                      <PlayCircle size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
