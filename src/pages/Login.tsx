import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Auto-login after signup (no email confirmation needed)
        if (data.user) {
          navigate('/my-courses'); // Redirect to their courses
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/my-courses'); // Redirect after login
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
           <h1 className="text-3xl font-black italic tracking-tighter mb-2 text-foreground">GABO <span className="text-neon-green">ID</span></h1>
           <p className="text-muted-foreground text-sm">Acceso a la plataforma Mastermind</p>
        </div>

        {/* ABSOLUTE TABS */}
        <div className="grid grid-cols-2 bg-secondary p-1 rounded-2xl mb-8 relative">
            <button 
              onClick={() => setMode('login')}
              className={`py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all z-10 ${mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
                Entrar
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all z-10 ${mode === 'register' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
                Crear Cuenta
            </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
            
            <div className="space-y-4">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input 
                      type="email" 
                      placeholder="Correo Electrónico" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary border-transparent focus:bg-background focus:border-ring rounded-2xl pl-12 pr-4 py-4 outline-none text-foreground placeholder:text-muted-foreground transition-all"
                      required
                    />
                </div>
                
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input 
                      type="password" 
                      placeholder="Contraseña" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-secondary border-transparent focus:bg-background focus:border-ring rounded-2xl pl-12 pr-4 py-4 outline-none text-foreground placeholder:text-muted-foreground transition-all"
                      required
                      minLength={6}
                    />
                </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-background dark:bg-neon-green dark:text-black font-black text-lg py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 uppercase tracking-wider"
            >
                {loading ? <Loader className="animate-spin" /> : (mode === 'login' ? 'Iniciar Sesión' : 'Registrarse Gratis')} 
                {!loading && <ArrowRight size={20} strokeWidth={3} />}
            </button>

        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
                Al continuar, aceptas nuestros <a href="#" className="underline hover:text-foreground">Términos</a> y <a href="#" className="underline hover:text-foreground">Privacidad</a>.
            </p>
        </div>

      </div>
    </div>
  );
}
