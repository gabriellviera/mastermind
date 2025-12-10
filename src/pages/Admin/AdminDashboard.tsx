import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, Eye, ShoppingCart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Stats = {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  pageViews: number;
  cartAbandoned: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pageViews: 0,
    cartAbandoned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Get total enrollments (proxy for revenue)
      const { count: enrollmentsCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      // Get analytics
      const { count: pageViewsCount } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view');

      const { count: cartAbandonedCount } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'add_to_cart');

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalRevenue: (enrollmentsCount || 0) * 99, // Assuming avg price $99
        pageViews: pageViewsCount || 0,
        cartAbandoned: cartAbandonedCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Usuarios', value: stats.totalUsers, color: 'text-blue-500' },
    { icon: BookOpen, label: 'Cursos Creados', value: stats.totalCourses, color: 'text-green-500' },
    { icon: DollarSign, label: 'Ingresos ($)', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'text-yellow-500' },
    { icon: Eye, label: 'Visitas Totales', value: stats.pageViews, color: 'text-purple-500' },
    { icon: ShoppingCart, label: 'Carritos Activos', value: stats.cartAbandoned, color: 'text-orange-500' },
    { icon: TrendingUp, label: 'Tasa Conversión', value: stats.totalCourses > 0 ? `${((stats.totalUsers / stats.pageViews) * 100 || 0).toFixed(1)}%` : '0%', color: 'text-pink-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
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
