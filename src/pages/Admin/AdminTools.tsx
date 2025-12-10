import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, User, BookOpen, Check, AlertTriangle } from 'lucide-react';

type Course = {
  id: string;
  title: string;
};

export default function AdminTools() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [email, setEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id, title');
    setCourses(data || []);
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
        // 1. Find User by Email (in public.profiles)
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('email', email) // Assuming email is stored in profiles
            .single();

        if (profileError || !profiles) {
            throw new Error('Usuario no encontrado. Asegúrate de que se haya registrado primero.');
        }

        if (!selectedCourse) {
            throw new Error('Selecciona un curso.');
        }

        // 2. Check if already enrolled
        const { data: existing } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', profiles.id)
            .eq('course_id', selectedCourse)
            .single();

        if (existing) {
            throw new Error('El usuario ya tiene acceso a este curso.');
        }

        // 3. Grant Access (Insert Enrollement)
        const { error: enrollError } = await supabase
            .from('enrollments')
            .insert([{
                user_id: profiles.id,
                course_id: selectedCourse
            }]);

        if (enrollError) throw enrollError;

        setMessage({
            type: 'success',
            text: `¡Acceso otorgado a ${profiles.full_name || email} exitosamente!`
        });
        setEmail('');

    } catch (error: any) {
        setMessage({
            type: 'error',
            text: error.message
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
        <ShieldCheck className="text-neon-green" size={40} />
        Herramientas de Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD: GRANT ACCESS */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen size={24} className="text-blue-400" />
                Otorgar Acceso Manual
            </h2>

            <form onSubmit={handleGrantAccess} className="space-y-6">
                
                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Email del Usuario
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@email.com"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-neon-green transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* Course Select */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Curso a Otorgar
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-neon-green transition-colors appearance-none"
                            required
                        >
                            <option value="">Selecciona un curso...</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-neon-green text-black font-black py-4 rounded-xl hover:bg-[#2bff00] transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? 'Procesando...' : 'Otorgar Acceso GRATIS'}
                    {!loading && <CheckCircleIcon size={20} />}
                </button>

                {/* Messages */}
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${
                        message.type === 'success' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                        {message.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                        <span className="font-bold">{message.text}</span>
                    </div>
                )}

            </form>
        </div>

        {/* INFO CARD */}
        <div className="space-y-8">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Advertencia
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Esta herramienta otorga acceso <strong>permanente y gratuito</strong> al curso seleccionado. 
                    El usuario podrá ver todo el contenido inmediatamente en su panel de "Mis Cursos".
                    Esto no procesa ningún pago.
                </p>
            </div>

             <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">
                <h3 className="text-blue-500 font-bold mb-2 flex items-center gap-2">
                    <User size={20} />
                     Verificación de Usuario
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Solo puedes dar acceso a usuarios que <strong>ya existan</strong> en la base de datos (se hayan registrado).
                    Si el email no existe, primero pídeles que se creen una cuenta gratuita.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}

function CheckCircleIcon({ size }: { size: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
