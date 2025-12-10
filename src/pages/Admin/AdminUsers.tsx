import { useState, useEffect } from 'react';
import { User, Shield, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

export default function AdminUsers() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black italic">
          USUARIOS <span className="text-neon-green">({users.length})</span>
        </h1>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Usuario</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Rol</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase">Registro</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center">
                      <User size={20} className="text-neon-green" />
                    </div>
                    <span className="font-bold">{user.full_name || 'Sin nombre'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleRole(user.id, user.role)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {user.role === 'admin' && <Shield size={12} />}
                    {user.role}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={16} />
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
