import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import FreeLessons from './FreeLessons';

type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
};

export default function Cursos() {
  const { addToCart, cart } = useCart();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'academy' | 'free'>('academy');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black italic mb-8 text-center">
          ACADEMIA <span className="text-neon-green">PRO</span>
        </h1>
        
        {/* TABS */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'academy'
                ? 'bg-neon-green text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('free')}
            className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'free'
                ? 'bg-neon-green text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Clases Abiertas 🎁
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === 'free' ? (
          <FreeLessons />
        ) : (
          <>
            {courses.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No hay cursos disponibles aún.</p>
            <p className="text-sm mt-2">Vuelve pronto para ver nuestros cursos 🚀</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const isInCart = cart.some(i => i.id === course.id);
              return (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-3xl overflow-hidden group hover:border-neon-green/50 transition-colors"
                >
                  <div className="h-48 overflow-hidden relative">
                    {course.image_url ? (
                      <img 
                        src={course.image_url} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <ShoppingCart className="text-gray-600" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-neon-green text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Curso Online
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 leading-tight">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">{course.description}</p>
                    
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-3xl font-black text-white">${course.price}</span>
                      
                      <div className="flex gap-2">
                        <Link 
                          to={`/curso-info/${course.id}`}
                          className="px-4 py-3 rounded-xl font-bold uppercase tracking-wide bg-white/10 hover:bg-white/20 transition-colors text-sm"
                        >
                          Ver Info
                        </Link>
                        <button 
                          onClick={() => addToCart({
                            id: course.id,
                            title: course.title,
                            price: course.price,
                            image: course.image_url || '',
                          })}
                          disabled={isInCart}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold uppercase tracking-wide transition-all ${
                            isInCart 
                            ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-neon-green hover:scale-105'
                          }`}
                        >
                          {isInCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
