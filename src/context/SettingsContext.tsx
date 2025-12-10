import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type HomeSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  videoUrl: string;
  videoCover: string;
  showPopup?: boolean;
  popupType?: 'image' | 'video';
  popupMediaUrl?: string;
  popupAutoplay?: boolean;
};

type SettingsContextType = {
  settings: HomeSettings;
  updateSettings: (newSettings: Partial<HomeSettings>) => void;
  resetSettings: () => void;
};

// Default Values
const defaultSettings: HomeSettings = {
  heroTitle: 'LIMITLESS POTENTIAL',
  heroSubtitle: 'EL SISTEMA PROHIBIDO PARA DESBLOQUEAR TU MÁXIMO NIVEL DE CONSCIENCIA Y RIQUEZA.',
  heroImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop', // Gabo Placeholder
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  videoCover: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HomeSettings>(() => {
    const saved = localStorage.getItem('gabo-site-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('gabo-site-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<HomeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
