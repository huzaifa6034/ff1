
import React, { useState } from 'react';
import { User, Admin } from '../types';

interface AuthProps {
  mode: 'login' | 'signup';
  isAdmin?: boolean;
  onSuccess: (user: User | Admin) => void;
  onToggleMode?: () => void;
  apiUrl: string;
}

const Auth: React.FC<AuthProps> = ({ mode: initialMode, isAdmin, onSuccess, onToggleMode, apiUrl }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    ff_uid: '',
    whatsapp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload = mode === 'signup' 
        ? { ...formData }
        : isAdmin 
          ? { username: formData.email, password: formData.password, type: 'admin' }
          : { email: formData.email, password: formData.password, type: 'user' };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Authentication failed');
      }

      const data = await response.json();
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 animate-in fade-in zoom-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gaming-orange/10 blur-3xl rounded-full"></div>
        
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-4xl font-oswald font-bold mb-2 uppercase tracking-tighter">
            {isAdmin ? 'Admin Portal' : (mode === 'login' ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p className="text-zinc-500">
            {isAdmin ? 'Authorized access only' : (mode === 'login' ? 'Login to join tournaments' : 'Sign up to start your journey')}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-6 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'signup' && !isAdmin && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" required placeholder="John Doe"
                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-gaming-orange text-white transition"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">{isAdmin ? 'Username' : 'Email Address'}</label>
            <input 
              type={isAdmin ? "text" : "email"} required placeholder={isAdmin ? "admin" : "player@example.com"}
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-gaming-orange text-white transition"
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {mode === 'signup' && !isAdmin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">FF UID</label>
                <input 
                  type="text" required placeholder="12345678"
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-gaming-orange text-white transition"
                  value={formData.ff_uid} onChange={e => setFormData({ ...formData, ff_uid: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                <input 
                  type="tel" required placeholder="9876543210"
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-gaming-orange text-white transition"
                  value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-gaming-orange text-white transition"
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gaming-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition flex items-center justify-center glow-orange disabled:opacity-50 mt-4 uppercase tracking-wider"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isAdmin ? 'Admin Sign In' : (mode === 'login' ? 'Login Now' : 'Create Account')
            )}
          </button>
        </form>

        {!isAdmin && (
          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">{mode === 'login' ? "Don't have an account?" : "Already have an account?"}</span>
            <button 
              onClick={() => {
                const newMode = mode === 'login' ? 'signup' : 'login';
                setMode(newMode);
                if (onToggleMode) onToggleMode();
              }}
              className="ml-2 text-gaming-orange font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
