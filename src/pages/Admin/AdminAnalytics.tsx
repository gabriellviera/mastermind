import { Activity, Users, ShoppingCart, DollarSign, Smartphone } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-black italic text-white">ANALYTICS <span className="text-neon-green">PRO</span></h2>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl border-t border-neon-green/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-green/10 rounded-lg text-neon-green"><Users size={24} /></div>
                    <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded">+12%</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider">Visitantes Únicos</h3>
                <p className="text-3xl font-bold mt-1">24,593</p>
            </div>
            
             <div className="glass p-6 rounded-2xl border-t border-blue-500/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><ShoppingCart size={24} /></div>
                    <span className="text-xs text-red-400 font-bold bg-red-400/10 px-2 py-1 rounded">-2%</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider">Carritos Abandonados</h3>
                <p className="text-3xl font-bold mt-1">142</p>
            </div>

             <div className="glass p-6 rounded-2xl border-t border-purple-500/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><DollarSign size={24} /></div>
                    <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded">+25%</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider">Ingresos Mes</h3>
                <p className="text-3xl font-bold mt-1">$45,231</p>
            </div>

             <div className="glass p-6 rounded-2xl border-t border-yellow-500/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500"><Smartphone size={24} /></div>
                    <span className="text-xs text-gray-400 font-bold bg-gray-400/10 px-2 py-1 rounded">58%</span>
                </div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider">Tráfico Móvil</h3>
                <p className="text-3xl font-bold mt-1">14,201</p>
            </div>
        </div>

        {/* Charts Mockups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl h-80 flex flex-col justify-between">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Activity size={20} className="text-neon-green" /> Actividad en Tiempo Real</h3>
                <div className="flex-1 flex items-end justify-between gap-2 px-4">
                    {[35, 60, 45, 75, 50, 80, 70, 90, 65, 55, 85, 95].map((h, i) => (
                        <div key={i} className="w-full bg-neon-green/20 hover:bg-neon-green transition-all rounded-t-sm relative group" style={{ height: `${h}%` }}>
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                 {h * 10}
                             </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                </div>
            </div>

            <div className="glass p-8 rounded-2xl h-80">
                 <h3 className="font-bold text-xl mb-6">Dispositivos</h3>
                 <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Mobile (iOS)</span>
                            <span className="text-neon-green">65%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-neon-green"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Mobile (Android)</span>
                            <span className="text-blue-400">20%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[20%] bg-blue-400"></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Desktop</span>
                            <span className="text-purple-400">15%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[15%] bg-purple-400"></div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
