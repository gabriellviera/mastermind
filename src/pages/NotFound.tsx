import { Link } from 'react-router-dom';
import { Ghost, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-panel p-12 max-w-2xl w-full text-center relative z-10 border border-white/10 rounded-[3rem]">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-white/5 rounded-full mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Ghost size={64} className="text-gray-400 animate-bounce" />
        </div>

        <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-6">
            Página No Encontrada
        </h2>
        
        <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
            Parece que te has perdido en el ciberespacio. La página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                to="/"
                className="bg-white/10 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
                <Home size={20} />
                Inicio
            </Link>

            <Link 
                to="/cursos"
                className="bg-neon-green text-black font-black py-4 px-8 rounded-2xl hover:bg-[#2bff00] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95"
            >
                Ver Cursos
                <ArrowRight size={20} strokeWidth={3} />
            </Link>
        </div>
      </div>
    </div>
  );
}
