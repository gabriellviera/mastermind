import { Users, Mail, Shield, MoreHorizontal } from 'lucide-react';

export default function AdminUsers() {
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@demo.com', role: 'Estudiante', status: 'Activo', joined: '10 Dic 2024' },
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id);

      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al cambiar rol');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
    </div>;
  }

  return (
               <thead className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                   <tr>
                       <th className="p-6">Usuario</th>
                       <th className="p-6">Rol</th>
                       <th className="p-6">Estado</th>
                       <th className="p-6">Fecha Registro</th>
                       <th className="p-6 text-right">Acciones</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                   {users.map(user => (
                       <tr key={user.id} className="hover:bg-white/5 transition-colors">
                           <td className="p-6">
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple/20 to-blue-500/20 flex items-center justify-center font-bold text-white">
                                       {user.name[0]}
                                   </div>
                                   <div>
                                       <div className="font-bold text-white">{user.name}</div>
                                       <div className="text-xs text-gray-500">{user.email}</div>
                                   </div>
                               </div>
                           </td>
                           <td className="p-6">
                               <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${user.role === 'Admin' ? 'bg-neon-orange/10 text-neon-orange' : 'bg-white/10 text-gray-300'}`}>
                                   {user.role === 'Admin' && <Shield size={12} />} {user.role}
                               </span>
                           </td>
                           <td className="p-6">
                               <span className="text-green-400 text-sm font-bold flex items-center gap-2">
                                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {user.status}
                               </span>
                           </td>
                           <td className="p-6 text-gray-400 text-sm">{user.joined}</td>
                           <td className="p-6 text-right">
                               <button className="text-gray-500 hover:text-white transition-colors">
                                   <MoreHorizontal size={20} />
                               </button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </div>
  );
}
