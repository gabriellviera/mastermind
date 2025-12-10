import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, ShieldCheck, ArrowRight, Lock, Key, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Empty State - Elegant
  if (cart.length === 0) {
      return (
          <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center bg-background transition-colors duration-300">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <CreditCard className="text-muted-foreground" size={40} />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2 text-foreground">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-8">Parece que aún no has elegido tu camino.</p>
              <Link to="/cursos" className="bg-foreground text-background font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform">
                  EXPLORAR CURSOS
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black tracking-tight mb-1 text-foreground">Finalizar Compra</h1>
                <p className="text-sm text-muted-foreground">Estás a un paso de acceder al contenido.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* LEFT: ORDER ITEMS */}
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">Tu Pedido</h3>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-3 items-center">
                                    <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden relative flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-base text-foreground leading-tight">{item.title}</h4>
                                        <span className="text-xs font-bold bg-neon-green/10 text-neon-green px-2 py-0.5 rounded mt-1 inline-block">Pro License</span>
                                    </div>
                                    <div className="text-lg font-bold text-foreground">
                                        ${item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: SUMMARY CARD - COMPACT */}
                <div className="md:col-span-1">
                    <div className="bg-foreground text-background dark:bg-card dark:text-foreground dark:border dark:border-border p-6 rounded-2xl sticky top-24 shadow-2xl relative overflow-hidden">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/20 rounded-full blur-[50px] pointer-events-none"></div>

                        <h3 className="font-bold text-xl mb-4 relative z-10">Resumen</h3>

                        <div className="space-y-3 mb-6 relative z-10 opacity-90">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span className="font-bold">${total}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Impuestos</span>
                                <span className="font-bold text-green-500">$0.00</span>
                            </div>
                            <div className="h-px bg-current opacity-10 my-3"></div>
                            <div className="flex justify-between text-lg font-black">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full bg-background text-foreground dark:bg-neon-green dark:text-black font-black py-4 rounded-xl text-base hover:scale-[1.02] active:scale-95 transition-all shadow-lg relative z-10 flex items-center justify-center gap-2"
                        >
                            Pagar Ahora <ArrowRight size={18} strokeWidth={3} />
                        </button>

                        <p className="text-center text-xs mt-4 opacity-60">
                            Acceso inmediato tras el pago.
                        </p>
                    </div>
                </div>

            </div>
        </div>

        {/* ELEGANT MODAL */}
        <AnimatePresence>
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setShowPaymentModal(false)}
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 40 }}
                        className="bg-card w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-border relative z-[101]"
                    >
                         <div className="flex items-center justify-between mb-8">
                             <div>
                                 <h2 className="text-2xl font-black text-foreground">Detalles de Pago</h2>
                                 <p className="text-sm text-muted-foreground">Procesado de forma segura.</p>
                             </div>
                             <button onClick={() => setShowPaymentModal(false)} className="bg-secondary p-2 rounded-full text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                                 ✕
                             </button>
                         </div>

                         <form className="space-y-5" onSubmit={(e) => {
                            e.preventDefault();
                            setLoading(true);
                            setTimeout(() => {
                                setLoading(false);
                                clearCart();
                                setShowPaymentModal(false);
                                alert('¡Pago Exitoso!');
                            }, 2000);
                        }}>
                             <div className="space-y-4">
                                 <div className="bg-secondary/50 p-4 rounded-2xl flex items-center gap-4 cursor-pointer border border-primary/20">
                                     <div className="w-5 h-5 rounded-full border-[5px] border-primary"></div>
                                     <span className="font-bold text-foreground">Tarjeta de Crédito</span>
                                     <div className="ml-auto flex gap-2">
                                         {/* Cards */}
                                         <div className="w-8 h-5 bg-foreground/20 rounded"></div>
                                         <div className="w-8 h-5 bg-foreground/20 rounded"></div>
                                     </div>
                                 </div>
                                 <div className="bg-background border border-border p-4 rounded-2xl flex items-center gap-4 cursor-pointer opacity-60 hover:opacity-100">
                                     <div className="w-5 h-5 rounded-full border border-muted-foreground"></div>
                                     <span className="font-bold text-foreground">Payoneer</span>
                                 </div>
                             </div>

                             <div className="space-y-3 pt-2">
                                 <input type="text" placeholder="Número de Tarjeta" className="w-full bg-secondary border-transparent focus:bg-background focus:border-ring rounded-xl px-4 py-4 outline-none font-mono text-foreground placeholder:text-muted-foreground transition-all" required />
                                 <div className="grid grid-cols-2 gap-3">
                                     <input type="text" placeholder="MM/YY" className="w-full bg-secondary border-transparent focus:bg-background focus:border-ring rounded-xl px-4 py-4 outline-none font-mono text-center text-foreground placeholder:text-muted-foreground transition-all" required />
                                     <input type="text" placeholder="CVC" className="w-full bg-secondary border-transparent focus:bg-background focus:border-ring rounded-xl px-4 py-4 outline-none font-mono text-center text-foreground placeholder:text-muted-foreground transition-all" required />
                                 </div>
                                 <input type="text" placeholder="Nombre del Titular" className="w-full bg-secondary border-transparent focus:bg-background focus:border-ring rounded-xl px-4 py-4 outline-none text-foreground placeholder:text-muted-foreground transition-all uppercase" required />
                             </div>

                             <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground font-black text-lg py-5 rounded-2xl hover:brightness-110 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                             >
                                {loading ? 'Procesando...' : `Pagar $${total}`}
                             </button>
                         </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
}
