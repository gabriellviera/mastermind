import { useState } from 'react';
import { Save, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AdminPopupConfig() {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

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
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">URL del Recurso (Imagen o Video Embed)</label>
              <input 
                type="text" 
                value={localSettings.popupMediaUrl || ''}
                onChange={e => setLocalSettings({...localSettings, popupMediaUrl: e.target.value})}
                placeholder="https://..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-green"
              />
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
