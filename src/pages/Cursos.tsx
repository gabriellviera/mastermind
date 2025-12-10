import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { courses } from '../data/courses';
import { ShoppingCart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cursos() {
  const { addToCart, cart } = useCart();

  return (
    <div className="min-h-screen pt-32 px-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black italic mb-12 text-center">ACADEMIA <span className="text-neon-green">PRO</span></h1>
        
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
                     <img 
                       src={course.image} 
                       alt={course.title} 
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                     <div className="absolute bottom-4 left-4">
                        <span className="bg-neon-green text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                           Curso Online
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-6">
                     <h3 className="text-2xl font-bold mb-2 leading-tight">{course.title}</h3>
                     <p className="text-gray-400 text-sm mb-6">{course.description}</p>
                     
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
                               onClick={() => addToCart(course)}
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
      </div>
    </div>
  );
}
