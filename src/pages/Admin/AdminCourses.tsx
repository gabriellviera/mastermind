import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, Edit2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image_url: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, courseId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `course-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `course-images/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('course-content').getPublicUrl(filePath);
      
      if (courseId) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({ image_url: data.publicUrl })
          .eq('id', courseId);

        if (error) throw error;
        await fetchCourses();
      } else {
        // Store for new course
        setFormData({ ...formData, image_url: data.publicUrl });
      }

      alert('Imagen subida exitosamente');
    } catch (error: any) {
      console.error('Error uploading:', error);
      alert(`Error al subir imagen: ${error.message || 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('courses')
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({ title: '', description: '', price: 0, image_url: '' });
      setEditingId(null);
      await fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error al guardar curso');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este curso?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black italic">
          CURSOS <span className="text-neon-green">({courses.length})</span>
        </h1>
        <button
          onClick={() => setEditingId('new')}
          className="bg-neon-green text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo Curso
        </button>
      </div>

      {/* FORM */}
      {(editingId === 'new' || editingId) && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xl font-bold">
            {editingId === 'new' ? 'Nuevo Curso' : 'Editar Curso'}
          </h3>

          <input
            type="text"
            placeholder="Título del curso"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-green"
          />

          <textarea
            placeholder="Descripción del curso"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-green"
          />

          <input
            type="number"
            placeholder="Precio ($)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-green"
          />

          <div>
            <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-neon-green transition-colors">
              <Upload size={20} />
              <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl" />
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveCourse}
              className="bg-neon-green text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              <Save size={18} /> Guardar
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', description: '', price: 0, image_url: '' });
              }}
              className="bg-white/10 px-6 py-2 rounded-xl font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 group">
            <div className="relative">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-white/5 flex items-center justify-center">
                  <ImageIcon className="text-gray-600" size={48} />
                </div>
              )}
              <label className="absolute top-2 right-2 bg-black/80 p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, course.id)}
                  className="hidden"
                />
              </label>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-neon-green font-black text-xl">${course.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(course.id);
                      setFormData({
                        title: course.title,
                        description: course.description || '',
                        price: course.price,
                        image_url: course.image_url || '',
                      });
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
