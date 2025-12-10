import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, MessageSquare, ArrowLeft, Download, Lock } from 'lucide-react';
import { courses } from '../data/courses';

export default function CoursePlayer() {
  const { id } = useParams();
  const course = courses.find(c => c.id === id) || courses[0];
  const [activeLesson, setActiveLesson] = useState(0);
  // Mock Enrollment: Deny access if course ID is 'marketing-elite' for demo
  const [isEnrolled] = useState(id !== 'marketing-elite'); 

  if (!isEnrolled) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[100px] -z-10"></div>
              
              <div className="glass p-10 md:p-14 rounded-3xl text-center max-w-lg w-full border border-white/10 shadow-2xl">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 ring-1 ring-white/10">
                      <Lock size={40} className="text-neon-green" />
                  </div>
                  
                  <h2 className="text-4xl font-black italic mb-4 tracking-tight">ACCESO DENEGADO</h2>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                      Este contenido es exclusivo para miembros del círculo interno.
                      No tienes los permisos necesarios para visualizarlo.
                  </p>
                  
                  <Link to="/checkout" className="block w-full bg-neon-green text-black font-black text-lg py-4 rounded-xl uppercase tracking-wider hover:bg-[#2bff00] hover:scale-105 transition-all shadow-lg shadow-neon-green/20">
                      Desbloquear Acceso
                  </Link>
                  
                  <Link to="/cursos" className="block mt-6 text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold">
                      Volver al Catálogo
                  </Link>
              </div>
          </div>
      )
  }

  const lessons = Array.from({ length: course.lessons }, (_, i) => ({
    id: i,
    title: `Lección ${i + 1}: Dominancia Total`,
    duration: '12:00'
  }));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <Link to="/cursos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} /> Volver a Cursos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player */}
            <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={64} className="text-white opacity-50 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
                
                <div>
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-gray-400">{course.description}</p>
                </div>
            </div>

            {/* Playlist */}
            <div className="glass rounded-2xl p-6 h-fit max-h-[600px] overflow-y-auto no-scrollbar">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Download size={20} className="text-neon-green" /> Contenido
                </h3>
                <div className="space-y-2">
                    {lessons.map((lesson, idx) => (
                        <button 
                          key={lesson.id}
                          onClick={() => setActiveLesson(idx)}
                          className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all ${activeLesson === idx ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeLesson === idx ? 'bg-neon-green text-black' : 'bg-white/10 text-gray-400'}`}>
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <div className={`font-bold text-sm ${activeLesson === idx ? 'text-white' : 'text-gray-400'}`}>{lesson.title}</div>
                                <div className="text-xs text-gray-600">{lesson.duration}</div>
                            </div>
                            {activeLesson === idx && <Play size={16} className="text-neon-green" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
