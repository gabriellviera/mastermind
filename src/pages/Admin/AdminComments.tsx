import { MessageSquare, ThumbsUp, Trash2, Search } from 'lucide-react';

export default function AdminComments() {
  const comments = [
    { id: 1, user: 'Juan Pérez', course: 'Mentalidad de Tiburón', text: '¡Increíble lección! Me cambió la perspectiva.', date: 'Hace 2h', likes: 5 },
    { id: 2, user: 'Maria García', course: 'Marketing Elite', text: '¿Podrían profundizar más en los funnels?', date: 'Hace 5h', likes: 2 },
    { id: 3, user: 'Pedro Lopez', course: 'Biohacking Total', text: 'No entendí la parte de los suplementos.', date: 'Hace 1d', likes: 0 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
       <h1 className="text-3xl font-black italic mb-8">MODERACIÓN DE <span className="text-neon-blue">COMENTARIOS</span></h1>

       <div className="mb-8 relative">
           <input type="text" placeholder="Buscar comentarios..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-neon-blue outline-none text-white" />
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
       </div>

       <div className="space-y-4">
           {comments.map(comment => (
               <div key={comment.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center font-bold text-lg">
                       {comment.user[0]}
                   </div>
                   <div className="flex-1">
                       <div className="flex items-center justify-between mb-2">
                           <div>
                               <h3 className="font-bold text-white">{comment.user}</h3>
                               <span className="text-xs text-neon-green font-bold uppercase">{comment.course}</span>
                           </div>
                           <span className="text-xs text-gray-500">{comment.date}</span>
                       </div>
                       
                       <p className="text-gray-300 mb-4">{comment.text}</p>
                       
                       <div className="flex items-center gap-6 text-sm text-gray-500">
                           <button className="flex items-center gap-2 hover:text-white transition-colors">
                               <ThumbsUp size={16} /> {comment.likes}
                           </button>
                           <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                               <Trash2 size={16} /> Eliminar
                           </button>
                           <button className="text-blue-400 font-bold hover:underline">Responder</button>
                       </div>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
}
