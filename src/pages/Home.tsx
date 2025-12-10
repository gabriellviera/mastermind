import { motion } from 'framer-motion';
import { Play, ArrowRight, Star, Quote, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useRef } from 'react';

export default function Home() {
  const { settings } = useSettings();
  const trailerRef = useRef<HTMLDivElement>(null);
  
  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-foreground bg-background transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* DYNAMIC BACKGROUND IMAGE & OVERLAY */}
         <div className="absolute inset-0 z-0 select-none pointer-events-none">
            {/* The Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
              style={{ backgroundImage: `url(${settings.heroImage})` }}
            ></div>
            
            {/* Fade to Black/Background Gradient Logic */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
         </div>

         {/* Content */}
         <div className="relative z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
             >
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-pulse">
                     <span className="w-2 h-2 rounded-full bg-red-500"></span>
                     <span className="text-xs font-bold tracking-widest uppercase text-foreground">Nueva Generación 2025</span>
                 </div>

                 <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 text-foreground">
                    {settings.heroTitle}
                 </h1>

                 <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-2xl leading-relaxed">
                    {settings.heroSubtitle}
                 </p>

                 <div className="flex flex-col sm:flex-row gap-6">
                     <Link to="/cursos" className="group relative px-8 py-5 bg-foreground text-background font-black text-xl uppercase tracking-widest rounded-sm overflow-hidden transform hover:-translate-y-1 transition-all shadow-[8px_8px_0px_0px_var(--neon-green)] hover:shadow-[12px_12px_0px_0px_var(--neon-green)]">
                         <span className="relative z-10 flex items-center gap-3">
                            Empezar Ahora <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                         </span>
                     </Link>
                     
                     <button onClick={scrollToTrailer} className="flex items-center gap-4 px-8 py-5 group text-foreground hover:text-neon-green transition-colors">
                         <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-neon-green/10">
                             <Play fill="currentColor" size={20} />
                         </div>
                         <span className="font-bold text-sm tracking-widest uppercase">Ver Trailer</span>
                     </button>
                 </div>
             </motion.div>

         </div>
      </section>

      {/* VIDEO SECTION */}
      <section ref={trailerRef} className="py-24 bg-secondary/30 relative">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-neon-green mb-4">Masterclass Exclusiva</h2>
                  <h3 className="text-4xl md:text-5xl font-black italic text-foreground">¿QUÉ ES GABO MASTERMIND?</h3>
              </div>
              
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  {/* PLACEHOLDER OR IFRAME */}
                   <iframe 
                      className="w-full h-full"
                      src={settings.videoUrl} 
                      title="Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                  ></iframe>
              </div>
          </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-background relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="glass-panel p-8 rounded-3xl border border-border relative group hover:scale-[1.02] transition-transform">
                         <Quote className="absolute top-8 right-8 text-neon-green/20" size={40} />
                         <div className="flex items-center gap-2 mb-4">
                             {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-neon-orange" fill="currentColor" />)}
                         </div>
                         <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                             "Este sistema cambió mi forma de ver los negocios. Pasé de 0 a 10k en 3 meses aplicando solo la fase 1."
                         </p>
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">U{i}</div>
                             <div>
                                 <div className="font-bold text-foreground">Usuario Éxito {i}</div>
                                 <div className="text-xs font-bold text-neon-green uppercase">Alumno Verificado</div>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 flex items-center justify-center bg-foreground text-background text-center px-6">
          <div className="max-w-4xl">
              <h2 className="text-5xl md:text-7xl font-black italic mb-8 tracking-tighter">
                  NO MÁS EXCUSAS.
              </h2>
              <Link to="/cursos" className="inline-block bg-background text-foreground font-black text-2xl px-12 py-6 rounded-full hover:scale-105 transition-transform">
                  ÚNETE A LA ÉLITE
              </Link>
          </div>
      </section>

    </div>
  );
}
