import { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../lib/supabase';

export default function AdminPopupConfig() {
  const { settings, updateSettings } = useSettings();
  const [uploading, setUploading] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `popup-${Date.now()}.${fileExt}`;
      const filePath = `popup-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('course-content').getPublicUrl(filePath);
      setLocalSettings({ ...localSettings, popupMediaUrl: data.publicUrl });
      
      alert('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert('Configuración guardada.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-black italic">POPUP <span className="text-neon-green">BANNER</span></h1>
         <button onClick={handleSave} className="bg-neon-green text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2">
             <Save size={18} /> Guardar
         </button>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
          
          <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={localSettings.showPopup || false}
                  onChange={e => setLocalSettings({...localSettings, showPopup: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                <span className="ml-3 text-sm font-bold uppercase text-white">Activar Popup</span>
              </label>
          </div>

          <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tipo de Contenido</label>
              <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalSettings({...localSettings, popupType: 'image'})}
                    className={`px-4 py-2 rounded-lg font-bold border ${localSettings.popupType === 'image' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                  >
                      Imagen
                  </button>
                  <button 
                    onClick={() => setLocalSettings({...localSettings, popupType: 'video'})}
                    className={`px-4 py-2 rounded-lg font-bold border ${localSettings.popupType === 'video' ? 'bg-white text-black border-white' : 'border-white/20 text-gray-400'}`}
                  >
                      Video
                  </button>
              </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Media del Popup</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-neon-green transition-colors">
                <Upload size={20} />
                <span>{uploading ? 'Subiendo...' : `Subir ${localSettings.popupType === 'image' ? 'Imagen' : 'Video'}`}</span>
                <input
                  type="file"
                  accept={localSettings.popupType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleMediaUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              {localSettings.popupMediaUrl && (
                <div className="mt-2">
                  {localSettings.popupType === 'image' ? (
                    <img src={localSettings.popupMediaUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                  ) : (
                    <video src={localSettings.popupMediaUrl} className="w-full max-w-md rounded-xl" controls />
                  )}
                </div>
              )}
              
              <input
                type="text"
                placeholder="O pega la URL aquí"
                value={localSettings.popupMediaUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, popupMediaUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-green text-sm"
              />
            </div>
          </div>

          {localSettings.popupType === 'video' && (
             <div className="flex items-center gap-2">
                 <input 
                   type="checkbox" 
                   checked={localSettings.popupAutoplay || false} 
                   onChange={e => setLocalSettings({...localSettings, popupAutoplay: e.target.checked})}
                 />
                 <span className="text-sm font-bold text-gray-400">Autoplay (Muted by default if required by browser)</span>
             </div>
          )}
          
      </div>
    </div>
  );
}
