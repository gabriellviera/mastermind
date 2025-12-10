import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, Star, CheckCircle, ShoppingCart, ArrowLeft, PlayCircle, Award, BadgeCheck } from 'lucide-react';
import { courses } from '../data/courses';
import { useCart } from '../context/CartContext';

export default function CourseDetail() {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  const { addToCart } = useCart();

  if (!course) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl">Curso no encontrado</div>;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 relative overflow-hidden transition-colors duration-300">
        {/* Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-900 dark:to-black -z-10 transition-colors"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-neon-blue/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-5xl mx-auto px-6">
            
            {/* Nav Back */}
            <Link to="/cursos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium">
                <ArrowLeft size={18} /> Volver a Cursos
            </Link>

            {/* HEADER GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                
                {/* Visuals */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative group"
                >
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl dark:shadow-neon-green/5 ring-1 ring-black/5 dark:ring-white/10 relative">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        
                         {/* Play Button Overlay */}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white shadow-lg cursor-pointer transform group-hover:scale-110 transition-all">
                                <PlayCircle size={40} fill="currentColor" className="opacity-90" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Info */}
                <motion.div 
                   initial={{ opacity: 0, x: 30 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                         <span className="px-4 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest">
                             SaaS Pro
                         </span>
                         <span className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                             <Star size={14} fill="currentColor" /> 4.9 (1.2k Alumnos)
                         </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-foreground">{course.title}</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        {course.description} La arquitectura definitiva para escalar tus conocimientos. 
                        Diseñado para la eficiencia y el impacto inmediato.
                    </p>

                    {/* Price & Action */}
                    <div className="flex items-center gap-6">
                        <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
                            <span className="block text-xs text-muted-foreground font-bold uppercase mb-1">Precio</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-foreground">${course.price}</span>
                                <span className="text-sm text-muted-foreground line-through font-medium">${course.price * 1.5}</span>
                            </div>
                        </div>
                        <button 
                           onClick={() => addToCart(course)}
                           className="flex-1 bg-foreground text-background dark:bg-neon-green dark:text-black font-bold h-full py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingCart size={20} /> <span className="uppercase tracking-wide">Comprar Ahora</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* iOS / Bento Grid Style Features */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {/* Card 1: Duration (Purple) */}
                <div className="col-span-1 bg-purple-50 dark:bg-purple-900/10 p-6 rounded-[2rem] border border-purple-100 dark:border-purple-500/20 flex flex-col items-center justify-center text-center gap-3 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">45h</div>
                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Contenido</div>
                    </div>
                </div>

                {/* Card 2: Lessons (Blue) */}
                <div className="col-span-1 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 flex flex-col items-center justify-center text-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                         <BookOpen size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">{course.lessons}</div>
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Lecciones</div>
                    </div>
                </div>

                {/* Card 3: Certificate (Black/White) */}
                <div className="col-span-2 bg-black dark:bg-white p-6 rounded-[2rem] flex items-center justify-between px-8 text-white dark:text-black group cursor-pointer shadow-xl">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Garantía</span>
                        <span className="text-2xl font-black">Certificado Pro</span>
                    </div>
                    <Award size={40} className="text-neon-green dark:text-black group-hover:rotate-12 transition-transform" />
                </div>

                {/* Card 4: Detailed List */}
                <div className="col-span-2 md:col-span-4 bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <BadgeCheck className="text-green-500" /> Lo que aprenderás
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Mentalidad de Alto Rendimiento', 'Estrategias de Venta High-Ticket', 'Biohacking y Energía', 'Comunidad Exclusiva 24/7', 'Herramientas de IA para escalar', 'Marca Personal Magnética'].map((item, i) => (
                             <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                                 <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                                     <CheckCircle size={12} />
                                 </div>
                                 <span className="text-sm font-medium text-foreground">{item}</span>
                             </div>
                        ))}
                    </div>
                </div>
            </motion.div>

        </div>
    </div>
  );
}
