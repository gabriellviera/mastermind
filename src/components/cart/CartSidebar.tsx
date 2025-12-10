import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cart, removeFromCart, total } = useCart();

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
               <h2 className="text-xl font-bold italic flex items-center gap-2">
                 <ShoppingBag className="text-neon-green" />
                 TU CARRITO
               </h2>
               <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X size={24} />
               </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p>Tu carrito está vacío</p>
                 </div>
               ) : (
                 cart.map(item => (
                   <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                        <p className="text-neon-green font-mono">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors self-start"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                 ))
               )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Total</span>
                    <span className="text-3xl font-bold text-neon-green font-mono">${total}</span>
                 </div>
                 <Link 
                   to="/checkout"
                   onClick={toggleCart}
                   className="w-full bg-neon-green text-black font-black py-4 rounded-xl uppercase tracking-wider hover:bg-[#2bff00] transition-all transform active:scale-95 shadow-lg shadow-neon-green/20 flex items-center justify-center gap-2"
                 >
                    Proceder al Pago
                 </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
