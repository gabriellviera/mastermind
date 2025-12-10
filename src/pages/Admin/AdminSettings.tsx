import { Save, Upload, Shield } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
  const [appName, setAppName] = useState('Gabo Mastermind');
  const [payoneerKey, setPayoneerKey] = useState('****************');
  const [payoneerSecret, setPayoneerSecret] = useState('****************');

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
       <h1 className="text-3xl font-black italic mb-8">CONFIGURACIÓN <span className="text-neon-orange">GLOBAL</span></h1>

       <div className="space-y-8">
           
           {/* BRANDING SECTION */}
           <div className="glass-panel p-8 rounded-3xl border border-white/10">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <span className="w-2 h-8 bg-neon-green rounded-full"></span>
                   Identidad de Marca & PWA
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                       <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nombre de la App</label>
                           <input type="text" value={appName} onChange={e => setAppName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green outline-none" />
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Icono de la App (512x512)</label>
                           <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-neon-green/50 transition-colors cursor-pointer bg-black/30">
                               <Upload className="text-gray-400 mb-2" size={32} />
                               <span className="text-sm font-bold text-gray-300">Subir Icono PNG</span>
                               <span className="text-xs text-gray-500 mt-1">Para PWA e Instalación</span>
                           </div>
                       </div>
                   </div>
                   
                   <div className="flex items-center justify-center">
                       {/* Preview */}
                       <div className="text-center">
                           <div className="w-24 h-24 bg-neon-green rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-neon-green/20">
                               <span className="font-black text-black text-3xl italic">G</span>
                           </div>
                           <p className="text-xs text-gray-500 uppercase font-bold">Vista Previa Icono</p>
                       </div>
                   </div>
               </div>
           </div>

           {/* PAYMENTS SECTION */}
           <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Shield size={64} className="text-white/5" />
               </div>
               
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <span className="w-2 h-8 bg-neon-orange rounded-full"></span>
                   Pasarela de Pagos (Payoneer)
               </h2>
               
               <div className="space-y-4 max-w-2xl">
                   <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-200 text-sm mb-4">
                       ⚠️ Advertencia: Estas claves permiten procesar pagos reales. No las compartas.
                   </div>

                   <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Payoneer Client ID</label>
                       <input type="password" value={payoneerKey} onChange={e => setPayoneerKey(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-orange outline-none font-mono tracking-widest" />
                   </div>
                   
                   <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Payoneer Client Secret</label>
                       <input type="password" value={payoneerSecret} onChange={e => setPayoneerSecret(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-orange outline-none font-mono tracking-widest" />
                   </div>

                   <div className="pt-4">
                       <label className="flex items-center gap-3 cursor-pointer">
                           <div className="w-12 h-6 bg-neon-green rounded-full relative">
                               <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                           </div>
                           <span className="font-bold">Modo Producción (Live)</span>
                       </label>
                   </div>
               </div>
           </div>

           <div className="flex justify-end pt-8">
               <button className="bg-white text-black font-black px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                   <Save size={20} /> Guardar Cambios
               </button>
           </div>

       </div>
    </div>
  );
}
