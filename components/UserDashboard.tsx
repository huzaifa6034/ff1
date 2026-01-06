
import React, { useState, useEffect } from 'react';
import { User, Tournament } from '../types';

interface UserDashboardProps {
  user: User;
  apiUrl: string;
  onNavigate: (view: any, id?: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, apiUrl, onNavigate }) => {
  const [joined, setJoined] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/user/dashboard?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        setJoined(data);
        setLoading(false);
      });
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-oswald font-bold text-white uppercase mb-2">Welcome, {user.name}</h1>
          <p className="text-zinc-500">UID: <span className="text-zinc-300 font-mono">{user.ff_uid}</span></p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs font-bold uppercase text-zinc-500 mb-1 tracking-widest">Tournaments Joined</p>
          <p className="text-4xl font-bold text-gaming-orange">{joined.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-oswald font-bold mb-6 flex items-center uppercase">
        <div className="w-2 h-8 bg-gaming-orange mr-3"></div>
        My Match Lobby
      </h2>

      {loading ? (
        <div className="text-center py-10">Loading matches...</div>
      ) : joined.length > 0 ? (
        <div className="grid gap-6">
          {joined.map(t => (
            <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-gaming-orange transition group">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded uppercase">Registered</span>
                    {/* Fixed start_time to dateTime */}
                    <span className="text-zinc-500 text-xs">{new Date(t.dateTime).toLocaleString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{t.title}</h3>
                  
                  {/* Match Access Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Room ID</p>
                      <p className="font-mono text-white tracking-wider">{t.room_id || 'Waiting...'}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Password</p>
                      <p className="font-mono text-white tracking-wider">{t.room_pass || 'Waiting...'}</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-48 flex items-center">
                  <button 
                    onClick={() => onNavigate('details', t.id)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition uppercase text-xs tracking-widest"
                  >
                    Match Rules
                  </button>
                </div>
              </div>
              <div className="bg-zinc-800/50 px-6 py-2 text-[10px] text-zinc-500 flex justify-between items-center">
                {/* Fixed prize_pool to prizePool */}
                <span>PRIZE POOL: {t.prizePool}</span>
                <span className="text-gaming-orange font-bold">MODE: {t.mode}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-3xl p-16 text-center">
          <p className="text-zinc-500 mb-6 italic text-lg">You haven't joined any battle yet.</p>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-gaming-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg glow-orange uppercase tracking-wider"
          >
            Find Tournament
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
