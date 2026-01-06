
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In production, this would be a POST to /api/admin/login
    // Here we simulate it with simple logic
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess();
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-oswald font-bold mb-6 text-center uppercase tracking-wider">Admin Access</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 focus:outline-none focus:border-gaming-orange text-white"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 focus:outline-none focus:border-gaming-orange text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-8 text-center text-zinc-600 text-xs">Only authorized administrators should access this area.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
