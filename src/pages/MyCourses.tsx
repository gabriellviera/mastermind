import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PlayCircle, Lock, ArrowRight } from 'lucide-react';

type EnrolledCourse = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export default function MyCourses() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      fetchMyCourses(user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchMyCourses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          created_at,
          courses (
            id,
            title,
            description,
            image_url
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const formatted = data?.map((item: any) => ({
        id: item.courses.id,
        title: item.courses.title,
        description: item.courses.description,
        image_url: item.courses.image_url,
        created_at: item.created_at,
      })) || [];

      setCourses(formatted);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // NOT LOGGED IN STATE
  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Lock className="text-gray-500" size={40} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Accede a tus <span className="text-neon-green">Cursos</span>
          </h1>
          
          <p className="text-gray-400 text-lg">
            Inicia sesión para ver todos los cursos que has adquirido y continuar tu aprendizaje.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-neon-green text-black font-black px-8 py-4 rounded-2xl text-lg hover:bg-[#2bff00] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-95"
          >
            Iniciar Sesión
            <ArrowRight size={20} strokeWidth={3} />
          </Link>

          <div className="pt-8">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta? <Link to="/login" className="text-neon-green hover:underline font-bold">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN - LOADING
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  // LOGGED IN - NO COURSES
  if (courses.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <PlayCircle className="text-gray-500" size={40} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Aún no tienes cursos
          </h1>
          
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Explora nuestro catálogo y comienza tu transformación hoy.
          </p>

          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 bg-neon-green text-black font-black px-8 py-4 rounded-2xl text-lg hover:bg-[#2bff00] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-95"
          >
            Explorar Cursos
            <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </div>
      </div>
    );
  }

  // LOGGED IN - HAS COURSES
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Mis <span className="text-neon-green">Cursos</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Continúa donde lo dejaste. Tienes {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/curso/${course.id}`}
              className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neon-green/50 transition-all hover:scale-[1.02] active:scale-95"
            >
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                  <PlayCircle size={48} className="text-gray-600" />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2 group-hover:text-neon-green transition-colors">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Inscrito {new Date(course.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2 text-neon-green font-bold text-sm">
                    Continuar
                    <ArrowRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
