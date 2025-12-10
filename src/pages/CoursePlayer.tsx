import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, MessageSquare, ArrowLeft, Download, Lock, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: number | null;
  is_free: boolean;
  order_index: number;
};

type Course = {
  id: string;
  title: string;
  description: string | null;
};

export default function CoursePlayer() {
  const { id: courseId } = useParams(); // ID or Slug
  const [searchParams] = useSearchParams();
  const requestedLessonId = searchParams.get('lesson');
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId, requestedLessonId]);

  const loadCourseData = async () => {
    try {
        setLoading(true);
        
        // 1. Get Course Details
        // 1. Get Course Details -- Support UUID or Slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId!);
        
        let data, error;
        
        if (isUuid) {
            const result = await supabase.from('courses').select('id, title, description').eq('id', courseId).single();
            data = result.data;
            error = result.error;
        } else {
            const result = await supabase.from('courses').select('id, title, description').eq('slug', courseId).single();
            data = result.data;
            error = result.error;
        }

        if (error || !data) throw new Error('Course not found');
        
        // Cast to Course type manually to hush TS if needed, though 'data' inference usually works
        const courseData = data as Course;
        setCourse(courseData);

        // 2. Get Lessons
        const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseData.id)
            .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);

        // 3. Determine Active Lesson
        let currentLesson = lessonsData?.[0];
        if (requestedLessonId) {
            const found = lessonsData?.find(l => l.id === requestedLessonId);
            if (found) currentLesson = found;
        }
        setActiveLesson(currentLesson || null);

        // 4. Check Access Logic
        await checkAccess(courseData.id, currentLesson);

    } catch (error) {
        console.error('Error loading course:', error);
    } finally {
        setLoading(false);
    }
  };

  const checkAccess = async (realCourseId: string, currentLesson: Lesson | undefined) => {
      setCheckingAccess(true);
      try {
          const { data: { user } } = await supabase.auth.getUser();

          // A. If it's a free lesson, ALLOW access immediately
          if (currentLesson?.is_free) {
              setHasAccess(true);
              return;
          }

          // B. If no user, DENY access (unless free, handled above)
          if (!user) {
              setHasAccess(false);
              return;
          }

          // C. Check Enrollment
          const { data: enrollment } = await supabase
              .from('enrollments')
              .select('id')
              .eq('user_id', user.id)
              .eq('course_id', realCourseId)
              .single();

          if (enrollment) {
              setHasAccess(true);
          } else {
              setHasAccess(false);
          }

      } catch (error) {
          console.error('Access check error:', error);
          setHasAccess(false);
      } finally {
          setCheckingAccess(false);
      }
  };

  // --- RENDERS ---

  if (loading || checkingAccess) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
          </div>
      );
  }

  // ACCESS DENIED VIEW
  if (!hasAccess) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[100px] -z-10"></div>
              
              <div className="glass-panel p-10 md:p-14 rounded-3xl text-center max-w-lg w-full border border-white/10 shadow-2xl">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 ring-1 ring-white/10">
                      <Lock size={40} className="text-neon-green" />
                  </div>
                  
                  <h2 className="text-4xl font-black italic mb-4 tracking-tight text-white">ACCESO DENEGADO</h2>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                      Este contenido es exclusivo para estudiantes inscritos.
                      {activeLesson ? ' Esta lección no es gratuita.' : ' Debes adquirir el curso.'}
                  </p>
                  
                  <button 
                    onClick={() => navigate('/checkout')} 
                    className="block w-full bg-neon-green text-black font-black text-lg py-4 rounded-xl uppercase tracking-wider hover:bg-[#2bff00] hover:scale-105 transition-all shadow-lg shadow-neon-green/20 mb-4"
                  >
                      Desbloquear Acceso Completamente
                  </button>
                  
                  <Link to="/cursos" className="block text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold">
                      Volver al Catálogo
                  </Link>
              </div>
          </div>
      )
  }

  // MAIN PLAYER VIEW
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
            <Link to="/my-courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Volver a Mis Cursos
            </Link>
            {activeLesson?.is_free && (
                <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-xs font-bold border border-neon-green/50">
                    VISTA PREVIA GRATUITA
                </span>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Player Area */}
            <div className="lg:col-span-2 space-y-6">
                {/* VIDEO CONTAINER */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                    {activeLesson?.video_url ? (
                        <video 
                            id="main-video"
                            src={activeLesson.video_url} 
                            controls 
                            className="w-full h-full object-contain"
                            poster={course?.title ? undefined : "https://via.placeholder.com/1280x720/000000/333333?text=Video+Player"}
                        >
                            Tu navegador no soporta video HTML5.
                        </video>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-gray-500">
                           <Play size={64} className="opacity-50" />
                           <p>Selecciona una lección para ver</p>
                        </div>
                    )}
                </div>
                
                {/* INFO */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {activeLesson?.title || course?.title}
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {activeLesson?.description || course?.description || 'Sin descripción disponible.'}
                    </p>
                </div>

                {/* COMMENTS SECTION REPLACEMENT (Placeholder) */}
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-white font-bold mb-4">
                        <MessageSquare size={20} /> Comentarios de la clase
                    </h3>
                    <p className="text-gray-500 text-sm">
                        La sección de comentarios estará disponible pronto.
                    </p>
                 </div>
            </div>

            {/* RIGHT: Playlist */}
            <div className="lg:h-[calc(100vh-140px)] lg:sticky lg:top-24 flex flex-col">
                <div className="glass-panel rounded-2xl p-6 h-full flex flex-col border border-white/10">
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <h3 className="font-bold text-xl text-white mb-1">{course?.title}</h3>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                            {lessons.length} Lecciones
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {lessons.map((lesson, idx) => {
                            const isActive = activeLesson?.id === lesson.id;
                            return (
                                <button 
                                  key={lesson.id}
                                  onClick={() => {
                                      setActiveLesson(lesson);
                                      // IMPORTANT: Re-check access when switching lessons!
                                      checkAccess(course!.id, lesson); 
                                  }}
                                  className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all group ${
                                      isActive 
                                      ? 'bg-neon-green/10 border-neon-green/50' 
                                      : 'hover:bg-white/5 border-transparent'
                                  } border`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                        isActive 
                                        ? 'bg-neon-green text-black' 
                                        : 'bg-white/10 text-gray-400'
                                    }`}>
                                        {isActive ? <Play size={12} fill="currentColor" /> : idx + 1}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate ${isActive ? 'text-neon-green' : 'text-gray-300 group-hover:text-white'}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            {lesson.duration && <span>{lesson.duration} min</span>}
                                            {lesson.is_free && (
                                                <span className="text-green-400 font-bold flex items-center gap-1">
                                                    <Check size={10} /> FREE
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {isActive ? (
                                        <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#39ff14]"></div>
                                    ) : (
                                        lesson.is_free ? null : <Lock size={14} className="text-gray-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
