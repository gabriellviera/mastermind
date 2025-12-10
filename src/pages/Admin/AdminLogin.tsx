import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'millonario') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass rounded-2xl border border-neon-green/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
        
        <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                <Lock size={32} />
            </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-wider">ADMIN PORTAL</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter Access Code"
              className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.2)] transition-all text-center tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-neon-green text-black font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-[#2bff00] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all transform hover:scale-[1.02]"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
