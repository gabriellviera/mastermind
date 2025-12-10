import { Save, Image as ImageIcon, Link as LinkIcon, Type, Upload } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../lib/supabase';

export default function AdminHomeConfig() {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('course-content').getPublicUrl(filePath);
      setLocalSettings({ ...localSettings, heroImage: data.publicUrl });
      
      alert('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  // Sync with context on save
  const handleSave = () => {
    updateSettings(localSettings);
    alert('¡Cambios guardados en la Home Page!');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
       <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black italic">EDITOR <span className="text-neon-green">HOME PAGE</span></h1>
            <button 
                onClick={handleSave}
                className="bg-neon-green text-black font-black px-6 py-3 rounded-xl hover:bg-[#2bff00] transition-colors flex items-center gap-2 shadow-lg"
            >
               <Save size={20} /> Guardar Cambios
            </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* TEXT CONTENT */}
           <div className="space-y-6">
               <div className="glass-panel p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <Type className="text-neon-orange" /> Textos Principales
                   </h3>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Título Principal (H1)</label>
                           <input 
                              type="text" 
                              value={localSettings.heroTitle}
                              onChange={e => setLocalSettings({...localSettings, heroTitle: e.target.value})}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none text-lg font-bold" 
                           />
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subtítulo (H2)</label>
                           <textarea 
                              value={localSettings.heroSubtitle}
                              onChange={e => setLocalSettings({...localSettings, heroSubtitle: e.target.value})}
                              rows={4}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none"
                           />
                       </div>
                   </div>
               </div>
           </div>

           {/* MEDIA CONTENT */}
           <div className="space-y-6">
               <div className="glass-panel p-6 rounded-2xl border border-white/10">
                   <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <ImageIcon className="text-neon-blue" /> Multimedia & Fondo
                   </h3>
                   
                   <div className="space-y-6">
                       <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Imagen de Fondo</label>
                           
                           {/* Upload Button */}
                           <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-neon-green transition-colors mb-3">
                               <Upload size={18} />
                               <span className="text-sm">{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                               <input
                                   type="file"
                                   accept="image/*"
                                   onChange={handleImageUpload}
                                   className="hidden"
                                   disabled={uploading}
                               />
                           </label>

                           {/* Preview */}
                           {localSettings.heroImage && (
                               <div className="mb-3">
                                   <img src={localSettings.heroImage} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                               </div>
                           )}

                           {/* URL Input */}
                           <div className="flex gap-2">
                               <input 
                                  type="text" 
                                  placeholder="O pega la URL aquí"
                                  value={localSettings.heroImage}
                                  onChange={e => setLocalSettings({...localSettings, heroImage: e.target.value})}
                                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-blue outline-none text-xs font-mono"
                               />
                           </div>
                           <p className="text-[10px] text-gray-500 mt-2">*Se aplicará un efecto de "Fade a Negro" automáticamente.</p>
                       </div>

                       <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Video Trailer (URL Embed)</label>
                           <div className="flex gap-2">
                                <span className="bg-white/5 flex items-center justify-center w-12 rounded-l-xl border border-white/10 border-r-0">
                                    <LinkIcon size={16} className="text-gray-500" />
                                </span>
                                <input 
                                  type="text" 
                                  value={localSettings.videoUrl}
                                  onChange={e => setLocalSettings({...localSettings, videoUrl: e.target.value})}
                                  className="w-full bg-black/50 border border-white/10 rounded-r-xl px-4 py-3 text-white focus:border-neon-blue outline-none text-xs font-mono"
                               />
                           </div>
                       </div>
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
}
