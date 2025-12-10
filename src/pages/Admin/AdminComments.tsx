import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Trash2, Search, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Comment = {
  id: string;
  user_id: string;
  course_id: string;
  comment_text: string;
  likes: number;
  admin_reply: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
  courses: {
    title: string;
  };
};

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!user_id (full_name, email),
          courses!course_id (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComments(comments.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error al eliminar comentario');
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ admin_reply: replyText })
        .eq('id', id);

      if (error) throw error;
      
      setComments(comments.map(c => 
        c.id === id ? { ...c, admin_reply: replyText } : c
      ));
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error replying:', error);
      alert('Error al responder');
    }
  };

  const filteredComments = comments.filter(c =>
    c.comment_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courses?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
       <h1 className="text-3xl font-black italic mb-8">MODERACIÓN DE <span className="text-neon-blue">COMENTARIOS</span></h1>

       <div className="mb-8 relative">
           <input 
             type="text" 
             placeholder="Buscar comentarios..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-neon-blue outline-none text-white" 
           />
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
       </div>

       {filteredComments.length === 0 ? (
         <div className="text-center text-gray-500 py-12">
           <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
           <p>No hay comentarios aún</p>
         </div>
       ) : (
         <div className="space-y-4">
             {filteredComments.map(comment => (
                 <div key={comment.id} className="glass-panel p-6 rounded-2xl border border-white/5">
                     <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center font-bold text-lg flex-shrink-0">
                             {comment.profiles?.full_name?.[0] || comment.profiles?.email[0] || 'U'}
                         </div>
                         <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                                 <div>
                                     <h3 className="font-bold text-white">{comment.profiles?.full_name || comment.profiles?.email}</h3>
                                     <span className="text-xs text-neon-green font-bold uppercase">{comment.courses?.title}</span>
                                 </div>
                                 <span className="text-xs text-gray-500">
                                   {new Date(comment.created_at).toLocaleString()}
                                 </span>
                             </div>
                             
                             <p className="text-gray-300 mb-4">{comment.comment_text}</p>
                             
                             {comment.admin_reply && (
                               <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                                 <p className="text-xs font-bold text-blue-400 mb-1">RESPUESTA DEL ADMIN:</p>
                                 <p className="text-gray-300 text-sm">{comment.admin_reply}</p>
                               </div>
                             )}

                             {replyingTo === comment.id ? (
                               <div className="flex gap-2 mb-4">
                                 <input
                                   type="text"
                                   placeholder="Escribe tu respuesta..."
                                   value={replyText}
                                   onChange={(e) => setReplyText(e.target.value)}
                                   className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-400"
                                   autoFocus
                                 />
                                 <button 
                                   onClick={() => handleReply(comment.id)}
                                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                                 >
                                   <Send size={16} /> Enviar
                                 </button>
                                 <button 
                                   onClick={() => {
                                     setReplyingTo(null);
                                     setReplyText('');
                                   }}
                                   className="text-gray-400 hover:text-white px-4"
                                 >
                                   Cancelar
                                 </button>
                               </div>
                             ) : (
                               <div className="flex items-center gap-6 text-sm text-gray-500">
                                   <span className="flex items-center gap-2">
                                       <ThumbsUp size={16} /> {comment.likes}
                                   </span>
                                   <button 
                                     onClick={() => handleDelete(comment.id)}
                                     className="flex items-center gap-2 hover:text-red-500 transition-colors"
                                   >
                                       <Trash2 size={16} /> Eliminar
                                   </button>
                                   <button 
                                     onClick={() => setReplyingTo(comment.id)}
                                     className="text-blue-400 font-bold hover:underline"
                                   >
                                     {comment.admin_reply ? 'Editar Respuesta' : 'Responder'}
                                   </button>
                               </div>
                             )}
                         </div>
                     </div>
                 </div>
             ))}
         </div>
       )}
    </div>
  );
}
