import { useState, useEffect } from 'react';
import { PlayCircle, Upload, Trash2, Plus, Save, X, GripVertical, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: number | null;
  order_index: number;
  is_free: boolean;
  created_at: string;
};

export default function AdminCourseLessons() {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    duration: 0,
    is_free: false,
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchLessons();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    const { data } = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .single();
    
    if (data) setCourseName(data.title);
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `lesson-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Choose bucket based on is_free
      const bucketName = formData.is_free ? 'public-lessons' : 'course-lessons';
      const filePath = `${bucketName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      setFormData({ ...formData, video_url: data.publicUrl });
      
      alert('Video subido exitosamente');
    } catch (error: any) {
      console.error('Error uploading:', error);
      alert(`Error al subir video: ${error.message || 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      if (editingId && editingId !== 'new') {
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([{ 
            ...formData, 
            course_id: courseId,
            order_index: lessons.length
          }]);

        if (error) throw error;
      }

      setFormData({ title: '', description: '', video_url: '', duration: 0, is_free: false });
      setEditingId(null);
      await fetchLessons();
      alert('Lección guardada');
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta lección?')) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLessons(lessons.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/courses" className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black">
              Gestionar Lecciones: <span className="text-neon-orange">{courseName}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">{lessons.length} lecciones creadas</p>
          </div>
          <button
            onClick={() => setEditingId('new')}
            className="ml-auto bg-neon-green text-black px-6 py-3 rounded-xl font-black flex items-center gap-2"
          >
            <Plus size={20} /> Nueva Lección
          </button>
        </div>

        {/* FORM (Full width cuando está abierto) */}
        {editingId && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId === 'new' ? 'Nueva Lección' : 'Editar Lección'}
              </h2>
              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título de la lección *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-neon-green text-lg"
                />

                <textarea
                  placeholder="Descripción (opcional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-neon-green"
                />

                <input
                  type="number"
                  placeholder="Duración (minutos)"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-neon-green"
                />

                <label className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="w-6 h-6"
                  />
                  <div>
                    <span className="text-white font-bold">Lección Gratuita (Preview)</span>
                    <p className="text-xs text

-gray-400 mt-1">Cualquier persona podrá ver esta lección</p>
                  </div>
                </label>
              </div>

              {/* RIGHT COLUMN - VIDEO */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 px-6 py-4 bg-blue-500/20 border-2 border-blue-500/50 rounded-xl cursor-pointer hover:bg-blue-500/30 transition-colors justify-center">
                  <Upload size={20} className="text-blue-400" />
                  <span className="text-white font-bold">
                    {uploading ? 'Subiendo video...' : formData.is_free ? 'Subir Video Público' : 'Subir Video Privado'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                <div className="text-center text-sm text-gray-500">O</div>

                <input
                  type="text"
                  placeholder="Pega URL del video (YouTube, Vimeo, etc)"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full bg-white/5 border border-blue-400/30 rounded-xl px-4 py-4 text-white outline-none focus:border-blue-400 text-sm"
                />

                {formData.video_url && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      ✓ Video configurado
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{formData.video_url}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveLesson}
                className="bg-neon-green text-black px-8 py-4 rounded-xl font-black flex items-center gap-2 text-lg hover:bg-[#2bff00]"
              >
                <Save size={20} /> Guardar Lección
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', description: '', video_url: '', duration: 0, is_free: false });
                }}
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <PlayCircle className="mx-auto text-gray-600 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No hay lecciones aún</p>
              <p className="text-gray-600 text-sm mt-2">Crea la primera lección para este curso</p>
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors group"
              >
                <GripVertical className="text-gray-600 cursor-move" size={24} />
                
                <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center text-neon-green font-black text-lg">
                  {index + 1}
                </div>

                <PlayCircle className="text-blue-400" size={28} />

                <div className="flex-1">
                  <h5 className="font-bold text-white text-lg">{lesson.title}</h5>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    {lesson.duration && <span>⏱ {lesson.duration} min</span>}
                    {lesson.is_free && <span className="text-green-400 font-bold">🎁 GRATIS</span>}
                    {lesson.video_url && <span className="text-blue-400">📹 Video configurado</span>}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(lesson.id);
                      setFormData({
                        title: lesson.title,
                        description: lesson.description || '',
                        video_url: lesson.video_url || '',
                        duration: lesson.duration || 0,
                        is_free: lesson.is_free,
                      });
                    }}
                    className="text-blue-400 hover:text-blue-300 p-3 hover:bg-blue-500/10 rounded-lg"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="text-red-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
