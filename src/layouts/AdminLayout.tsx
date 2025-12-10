import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, MessageSquare, Settings, BookOpen, LogOut, Home as HomeIcon, MessageSquareDashed, Lock, ArrowRight } from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Cursos', path: '/admin/courses' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: MessageSquare, label: 'Comentarios', path: '/admin/comments' },
    { icon: HomeIcon, label: 'Home Config', path: '/admin/home-config' },
    { icon: MessageSquareDashed, label: 'Popup Banner', path: '/admin/popup-config' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Admin Auth State
    const [isAdminAuth, setIsAdminAuth] = useState(() => {
        return sessionStorage.getItem('admin_secret_auth') === 'true';
    });
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded secret as requested (In production this should be server-side!)
        if (passwordInput === 'millonario0000') {
            setIsAdminAuth(true);
            sessionStorage.setItem('admin_secret_auth', 'true');
            setError(false);
        } else {
            setError(true);
        }
    };

    // If not authenticated, show Lock Screen
    if (!isAdminAuth) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
                <div className="w-full max-w-md">
                     <div className="text-center mb-10">
                         <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-neon-green/30">
                             <Lock size={32} className="text-neon-green" />
                         </div>
                         <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                             GABO <span className="text-neon-green">ADMIN</span>
                         </h1>
                         <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Acceso Restringido</p>
                     </div>

                     <form onSubmit={handleLogin} className="space-y-4">
                         <div className="relative">
                             <input 
                               type="password" 
                               value={passwordInput}
                               onChange={(e) => setPasswordInput(e.target.value)}
                               placeholder="Contraseña Maestra"
                               className="w-full bg-white/5 border border-white/10 focus:border-neon-green rounded-xl px-6 py-4 text-white placeholder:text-gray-600 outline-none text-center font-mono tracking-widest text-lg transition-all"
                               autoFocus
                             />
                         </div>
                         {error && <p className="text-red-500 text-xs text-center font-bold uppercase animate-pulse">Contraseña Incorrecta</p>}
                         
                         <button 
                           type="submit"
                           className="w-full bg-neon-green text-black font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2bff00] hover:scale-[1.02] transition-all uppercase tracking-wide shadow-lg shadow-neon-green/20"
                         >
                             Desbloquear <ArrowRight size={20} strokeWidth={3} />
                         </button>

                         <Link to="/" className="block text-center text-gray-600 hover:text-white text-xs uppercase font-bold mt-8 transition-colors">
                             Volver al Sitio
                         </Link>
                     </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex text-sm relative">
            
            {/* MOBILE TOGGLE */}
            <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-full backdrop-blur-md"
            >
                <Menu size={24} />
            </button>

            {/* SIDEBAR BACKDROP */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <div className={`
                fixed lg:sticky top-0 h-screen w-64 bg-[#050505] border-r border-white/5 flex flex-col z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black italic tracking-tighter text-white">
                        GABO <span className="text-neon-green">ADMIN</span>
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map(item => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        
                        return (
                            <Link 
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive 
                                    ? 'bg-neon-green text-black font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <button onClick={() => {
                        sessionStorage.removeItem('admin_secret_auth');
                        setIsAdminAuth(false);
                    }} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-400 transition-colors w-full text-left">
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors">
                        <HomeIcon size={18} />
                        <span>Ir a Web</span>
                    </Link>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen bg-background relative">
                <Outlet />
            </main>
        </div>
    );
}
