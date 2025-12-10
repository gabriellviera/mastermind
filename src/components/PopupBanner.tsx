import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { X, Volume2, VolumeX, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PopupBanner() {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Show popup on mount if enabled in settings
    if (settings.showPopup) {
      // Optional: Check sessionStorage to show only once per session
      const hasSeen = sessionStorage.getItem('hasSeenPopup');
      if (!hasSeen) {
         const timer = setTimeout(() => setIsVisible(true), 1500); // 1.5s Delay
         return () => clearTimeout(timer);
      }
    }
  }, [settings.showPopup]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenPopup', 'true');
  };

  if (!isVisible || !settings.showPopup) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 50 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 50 }}
             className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
           >
              {/* CLOSE BUTTON */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                  <X size={20} />
              </button>

              {/* MEDIA CONTENT */}
              <div className="aspect-video relative bg-gray-900 flex items-center justify-center">
                  {settings.popupType === 'image' ? (
                      <img 
                        src={settings.popupMediaUrl} 
                        alt="Promo" 
                        className="w-full h-full object-cover"
                      />
                  ) : (
                      // Video Logic
                      <div className="w-full h-full">
                         {settings.popupMediaUrl?.includes('youtube') || settings.popupMediaUrl?.includes('vimeo') ? (
                             <iframe 
                               src={`${settings.popupMediaUrl}${settings.popupMediaUrl?.includes('?') ? '&' : '?'}autoplay=1&mute=${isMuted ? 1 : 0}`} 
                               className="w-full h-full pointer-events-auto"
                               allow="autoplay; encrypted-media"
                             ></iframe>
                         ) : (
                             <video 
                               src={settings.popupMediaUrl}
                               autoPlay={settings.popupAutoplay}
                               muted={isMuted}
                               loop
                               className="w-full h-full object-cover"
                             ></video>
                         )}
                         
                         {/* Mute Toggle for Custom Video */}
                         {!(settings.popupMediaUrl?.includes('youtube') || settings.popupMediaUrl?.includes('vimeo')) && (
                             <button 
                               onClick={() => setIsMuted(!isMuted)}
                               className="absolute bottom-6 right-6 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md"
                             >
                                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                             </button>
                         )}
                      </div>
                  )}

                  {/* OVERLAY ACTION */}
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center text-center pointer-events-none">
                      <div className="pointer-events-auto mt-4">
                          <button onClick={handleClose} className="bg-neon-green text-black font-black uppercase text-xl px-10 py-4 rounded-full hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_20px_rgba(57,255,20,0.5)]">
                              <Play fill="black" size={20} /> Empezar Ahora
                          </button>
                      </div>
                  </div>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
