import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[70] h-full w-[85vw] sm:w-96 max-w-md bg-black border-l border-white/10 shadow-2xl flex flex-col text-white"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-xl">
              <h2 className="text-xl font-black italic flex items-center gap-2 text-white">
                TU <span className="text-neon-green">CARRITO</span>
              </h2>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                   <ShoppingBag size={48} className="text-gray-400" />
                   <p className="font-bold text-gray-400">El carrito está vacío</p>
                   <button onClick={toggleCart} className="text-neon-green uppercase font-bold text-sm hover:underline">
                      Volver a la tienda
                   </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 group relative"
                  >
                    <Link to={`/curso-info/${item.id}`} onClick={toggleCart} className="absolute inset-0 z-0" />
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl z-10 relative pointer-events-none group-hover:scale-105 transition-transform" />
                    <div className="flex-1 flex flex-col justify-between z-10 relative pointer-events-none">
                       <div>
                           <h4 className="font-bold text-sm leading-tight mb-1 text-white">{item.title}</h4>
                           <p className="text-xs text-neon-green font-bold uppercase">Curso Online</p>
                       </div>
                       <div className="flex items-center justify-between">
                           <span className="font-bold text-white">${item.price}</span>
                       </div>
                    </div>
                    <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             removeFromCart(item.id);
                         }}
                         className="relative z-20 text-gray-400 hover:text-red-500 transition-colors self-end"
                    >
                        <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/90 backdrop-blur-xl space-y-4">
                 <div className="flex justify-between items-end">
                     <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Subtotal</span>
                     <span className="text-3xl font-black text-white">${total}</span>
                 </div>
                 <button 
                   onClick={() => {
                       toggleCart();
                       navigate('/checkout');
                   }}
                   className="w-full bg-neon-green text-black font-black py-4 rounded-xl uppercase tracking-wider hover:bg-[#2bff00] shadow-[0_0_20px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2 transition-transform active:scale-95"
                 >
                     Tramitar Pedido <ArrowRight strokeWidth={3} size={18} />
                 </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
