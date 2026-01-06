
import React, { useEffect, useState } from 'react';
import { User, Tournament, Player } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: any, id?: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onNavigate }) => {
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    // In production, fetch joined tournaments for this userId from API
    const players: Player[] = JSON.parse(localStorage.getItem('ff_players') || '[]');
    const tournaments: Tournament[] = JSON.parse(localStorage.getItem('ff_tournaments') || '[]');
    
    const joinedIds = players.filter(p => p.userId === user.id).map(p => p.tournamentId);
    const joinedTourneys = tournaments.filter(t => joinedIds.includes(t.id));
    setMyTournaments(joinedTourneys);
  }, [user.id]);

  return (
    <div className="animate-in slide-in-from-bottom duration-500 max-w-4xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-gaming-orange to-orange-800"></div>
        <div className="px-8 pb-8 -mt-12">
          <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center shadow-xl overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-3xl font-oswald font-bold text-white uppercase">{user.name}</h1>
                <p className="text-zinc-500 font-medium">UID: <span className="text-zinc-300">{user.ff_uid}</span></p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 px-6 py-2 rounded-xl font-bold transition flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Joined</p>
          <p className="text-3xl font-bold text-white">{myTournaments.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
          <p className="text-3xl font-bold text-green-500 uppercase text-sm mt-2">Active Player</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Rank</p>
          <p className="text-3xl font-bold text-gaming-orange text-sm mt-2 uppercase">Elite member</p>
        </div>
      </div>

      <h2 className="text-2xl font-oswald font-bold mb-6 flex items-center uppercase">
        <div className="w-2 h-8 bg-gaming-orange mr-3"></div>
        My Registered Tournaments
      </h2>

      {myTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myTournaments.map(t => (
            <div key={t.id} className="gaming-card p-6 rounded-2xl group cursor-pointer" onClick={() => onNavigate('details', t.id)}>
              <div className="flex justify-between mb-4">
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Joined</span>
                <span className="text-zinc-500 text-xs">{new Date(t.dateTime).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gaming-orange transition">{t.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-gaming-orange font-bold">{t.prizePool} Prize</p>
                <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded transition">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-3xl p-12 text-center">
          <p className="text-zinc-500 mb-6 italic text-lg">You haven't joined any tournaments yet.</p>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-gaming-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg glow-orange uppercase tracking-wider"
          >
            Explore Tournaments
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
