import { ArrowUpRight, DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { label: 'Ventas Totales', value: '$12,450', change: '+15%', icon: DollarSign, color: 'text-neon-green', bg: 'bg-neon-green/10' },
    { label: 'Usuarios Activos', value: '1,234', change: '+5%', icon: Users, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
    { label: 'En Carrito', value: '56', change: '-2%', icon: ShoppingCart, color: 'text-neon-orange', bg: 'bg-neon-orange/10' },
    { label: 'Tasa Conversión', value: '3.2%', change: '+0.5%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
       <h1 className="text-3xl font-black italic mb-8">DASHBOARD <span className="text-neon-green">PRINCIPAL</span></h1>

       {/* STATS GRID */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {stats.map((stat, i) => (
               <motion.div 
                 key={stat.label}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors"
               >
                   <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform">
                       <div className={`${stat.bg} p-3 rounded-xl`}>
                           <stat.icon className={stat.color} size={24} />
                       </div>
                   </div>
                   
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-3xl font-black text-white mb-2">{stat.value}</h3>
                   <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                       {stat.change} mes pasado
                   </span>
               </motion.div>
           ))}
       </div>

       {/* RECENT ACTIVITY MOCK */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-8 rounded-3xl border border-white/10">
               <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                   <Users className="text-neon-blue" /> Nuevos Usuarios
               </h3>
               <div className="space-y-4">
                   {[1,2,3,4,5].map(i => (
                       <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">U{i}</div>
                               <div>
                                   <div className="font-bold text-sm">Usuario Demo {i}</div>
                                   <div className="text-xs text-gray-500">hace {i*5} min</div>
                               </div>
                           </div>
                           <span className="text-xs font-bold text-neon-green uppercase">Registrado</span>
                       </div>
                   ))}
               </div>
               <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                   Ver Todos <ArrowUpRight size={16} />
               </button>
           </div>

           <div className="glass-panel p-8 rounded-3xl border border-white/10">
               <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                   <ShoppingCart className="text-neon-orange" /> Ventas Recientes
               </h3>
               {/* Empty State Mock */}
               <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                   <ShoppingBagIcon className="w-16 h-16 mb-4 text-gray-600" />
                   <div className="text-sm font-bold text-gray-500">No hay ventas recientes</div>
               </div>
           </div>
       </div>
    </div>
  );
}

function ShoppingBagIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    )
}
