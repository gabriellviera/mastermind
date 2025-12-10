import { useState, useEffect } from 'react';
import { PlayCircle, Upload, Trash2, Plus, Save, X, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

export default function AdminLessons({ courseId, courseName }: { courseId: string; courseName: string }) {
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
    fetchLessons();
  }, [courseId]);

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
      const filePath = `course-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-lessons')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('course-lessons').getPublicUrl(filePath);
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
        // Update
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create
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
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green"></div>
    </div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white">
          LECCIONES DE: <span className="text-neon-orange">{courseName}</span>
        </h3>
        <button
          onClick={() => setEditingId('new')}
          className="bg-neon-green text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Nueva Lección
        </button>
      </div>

      {/* FORM */}
      {editingId && (
        <div className="bg-black/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">{editingId === 'new' ? 'Nueva Lección' : 'Editar Lección'}</h4>
            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Título de la lección"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-green"
          />

          <textarea
            placeholder="Descripción (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-green"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Duración (minutos)"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-neon-green"
            />

            <label className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_free}
                onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-white text-sm">Lección Gratuita (Preview)</span>
            </label>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-neon-green transition-colors">
              <Upload size={18} className="text-white" />
              <span className="text-white text-sm">{uploading ? 'Subiendo video...' : 'Subir Video Privado'}</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <input
              type="text"
              placeholder="O pega la URL del video (YouTube, Vimeo, etc)"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-400 text-sm"
            />

            {formData.video_url && (
              <p className="text-xs text-green-400">✓ Video configurado</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveLesson}
              className="bg-neon-green text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              <Save size={16} /> Guardar
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', description: '', video_url: '', duration: 0, is_free: false });
              }}
              className="bg-white/10 text-white px-6 py-2 rounded-xl font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay lecciones aún. Crea la primera.</p>
        ) : (
          lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors"
            >
              <GripVertical className="text-gray-600 cursor-move" size={20} />
              
              <div className="w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center text-neon-green font-bold text-sm">
                {index + 1}
              </div>

              <PlayCircle className="text-blue-400" size={20} />

              <div className="flex-1">
                <h5 className="font-bold text-white">{lesson.title}</h5>
                <div className="flex gap-4 text-xs text-gray-400 mt-1">
                  {lesson.duration && <span>⏱ {lesson.duration} min</span>}
                  {lesson.is_free && <span className="text-green-400">🎁 Gratis</span>}
                  {lesson.video_url && <span className="text-blue-400">📹 Video</span>}
                </div>
              </div>

              <div className="flex gap-2">
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
                  className="text-blue-400 hover:text-blue-300 p-2"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="text-red-500 hover:text-red-400 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
