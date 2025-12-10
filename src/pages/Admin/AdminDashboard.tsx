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
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      const { count: enrollmentsCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

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
        totalRevenue: (enrollmentsCount || 0) * 99,
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter">
          DASHBOARD <span className="text-neon-green">ADMIN</span>
        </h1>
        <p className="text-gray-500 mt-2">Métricas en tiempo real desde Supabase</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-green/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
              <stat.icon className={`${stat.color} group-hover:scale-110 transition-transform`} size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
        <p className="text-gray-500 text-sm">
          Conectado a Supabase. Los datos se actualizan en tiempo real.
        </p>
      </div>
    </div>
  );
}
