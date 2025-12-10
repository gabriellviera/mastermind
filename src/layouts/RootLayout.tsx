import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, PlayCircle, ShoppingBag, User, Menu, X, Sun, Moon, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

export default function RootLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleCart, cart } = useCart();
  
  // Mock Auth State (Replace with real Supabase Auth)
  const [user, setUser] = useState<{name: string} | null>(null);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Toggle Logic
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
  }, [isDark]);

  // PWA Install Logic
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleMyCoursesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
        // Show simplified login alert/toast logic
        if(confirm("Inicia sesión para ver tus cursos")) {
            navigate('/login');
        }
    } else {
        // Navigate to my-courses (using dashboard logic for now or similar)
        // For now, let's say /cursos IS the library if logged in, but let's send to /cursos for demo
        navigate('/cursos');
    }
  };

  const MobileNavItem = ({ icon: Icon, label, path, onClick }: any) => {
      const isActive = location.pathname === path;
      return (
          <button 
            onClick={onClick || (() => navigate(path))}
            className="relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all"
          >
              {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
              )}
              <Icon 
                 size={22} 
                 className={`z-10 transition-colors ${isActive ? 'text-neon-green drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]' : 'text-gray-500'}`} 
                 strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] uppercase font-bold mt-1 z-10 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {label}
              </span>
          </button>
      )
  };

  return (
    <div className={`min-h-screen font-sans bg-background text-foreground selection:bg-neon-green/30`}>
      
      <CartSidebar />

      {/* HEADER DESKTOP / MOBILE STICKY */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-1 group">
                <span className="text-3xl font-black tracking-tighter italic bg-gradient-to-r from-neon-orange to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                    GABO
                </span>
                <span className="bg-foreground text-background dark:bg-white dark:text-black px-2 py-0.5 rounded-sm font-bold text-sm tracking-widest uppercase transform -skew-x-12 ml-1 transition-colors">
                    MASTERMIND
                </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8">
               <Link to="/" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-neon-green transition-colors">Inicio</Link>
               <Link to="/cursos" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-neon-green transition-colors">Academia</Link>
               <Link to="/cursos" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-neon-green transition-colors">Mis Cursos</Link>
            </nav>

            {/* ICONS AREA (RIGHT ALIGNED) */}
            <div className="flex items-center gap-2 text-foreground">
                {/* 1. THEME TOGGLE */}
                <button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground">
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* 2. INSTALL APP */}
                {deferredPrompt && (
                  <button 
                    onClick={handleInstallClick}
                    className="p-2 hover:bg-secondary rounded-full transition-colors text-neon-green"
                  >
                    <Download size={18} />
                  </button>
                )}

                {/* 3. CART ICON */}
                <button 
                  onClick={toggleCart}
                  className="relative p-2 hover:bg-secondary rounded-full transition-colors text-foreground"
                >
                    <ShoppingBag size={18} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-neon-green text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </button>
                
                {/* 4. LOGIN ICON */}
                <Link to="/login" className="hidden md:block p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                    <User size={18} />
                </Link>
            </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="pt-0">
         <Outlet />
      </main>

      {/* MOBILE FLOAT NAV (iOS Style) */}
      <div className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 w-[95%] max-w-sm z-50">
          <div className="ios-blur rounded-3xl border border-white/10 p-2 flex justify-between items-center shadow-2xl shadow-neon-green/10">
              <MobileNavItem icon={Home} label="Inicio" path="/" />
              <MobileNavItem icon={BookOpen} label="Tienda" path="/cursos" />
              
              {/* Mis Cursos Logic */}
              <button 
                onClick={() => user ? navigate('/cursos') : navigate('/login')}
                className="relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all"
              >
                  <PlayCircle size={22} className="text-gray-500 group-hover:text-neon-green transition-colors" strokeWidth={2} />
                  <span className="text-[10px] uppercase font-bold mt-1 text-gray-600">
                      Cursos
                  </span>
              </button>

              <MobileNavItem icon={User} label="Perfil" path="/login" />
          </div>
      </div>

    </div>
  );
}
