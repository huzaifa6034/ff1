
import React from 'react';
import { Tournament, AppState, User } from '../types';

interface TournamentDetailsProps {
  tournament: Tournament;
  // Added user, apiUrl, and onRefresh props from App.tsx
  user: User | null;
  onNavigate: (view: AppState['view'], id?: string) => void;
  apiUrl: string;
  onRefresh: () => Promise<void>;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament, onNavigate }) => {
  // Use camelCase from updated types.ts
  const progress = (tournament.registeredCount / tournament.slots) * 100;

  return (
    <div className="animate-in fade-in duration-500">
      <button 
        onClick={() => onNavigate('home')}
        className="text-zinc-500 hover:text-white flex items-center mb-6 transition group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tournaments
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-48 md:h-64">
          <img src={`https://picsum.photos/seed/${tournament.id}/1200/600`} alt="Tournament Banner" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
          <div className="absolute bottom-6 left-8">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block ${tournament.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {tournament.status === 'open' ? 'Registration Open' : 'Registration Closed'}
            </span>
            <h1 className="text-3xl md:text-5xl font-oswald font-bold uppercase">{tournament.title}</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-black/40 border border-zinc-800 p-5 rounded-2xl">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Prize Pool</p>
              <p className="text-2xl font-bold text-gaming-orange">{tournament.prizePool}</p>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-5 rounded-2xl">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Entry Fee</p>
              <p className="text-2xl font-bold">{tournament.entryFee}</p>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-5 rounded-2xl">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Date & Time</p>
              <p className="text-lg font-bold">
                {new Date(tournament.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(tournament.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white uppercase font-oswald">Registration Status</h3>
              <span className="text-zinc-400 font-bold">{tournament.registeredCount} / {tournament.slots} Slots filled</span>
            </div>
            <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gaming-orange h-full rounded-full transition-all duration-1000 ease-out glow-orange"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-oswald font-bold text-white mb-4 uppercase border-b border-zinc-800 pb-2">Tournament Rules</h3>
              <div className="prose prose-invert max-w-none text-zinc-400 text-sm leading-relaxed">
                {tournament.rules ? (
                  <p className="whitespace-pre-line">{tournament.rules}</p>
                ) : (
                  <p>Standard survival rules apply. No emulators allowed. Minimum level 40 required for entry. All players must join the WhatsApp group for match updates.</p>
                )}
                <ul className="mt-4 space-y-2 list-disc pl-5">
                  <li>Map: Bermuda (Classic)</li>
                  <li>Mode: Solo/Squad</li>
                  <li>No Teaming</li>
                  <li>Recording mandatory for verification</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col justify-center bg-zinc-800/20 border border-zinc-800 p-8 rounded-3xl text-center">
              <h3 className="text-2xl font-oswald font-bold text-white mb-2 uppercase">Ready to Play?</h3>
              <p className="text-zinc-500 mb-8 text-sm">Make sure you have your Free Fire UID and WhatsApp number ready.</p>
              <button 
                disabled={tournament.status !== 'open'}
                // Changed 'register' to 'register' (which is now in the view union)
                onClick={() => onNavigate('register', tournament.id)}
                className={`w-full py-4 rounded-xl font-bold text-lg uppercase transition-all transform hover:scale-[1.02] active:scale-[0.98] ${tournament.status === 'open' ? 'bg-gaming-orange text-white glow-orange hover:bg-orange-600' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {tournament.status === 'open' ? 'Register Now' : 'Slots Full'}
              </button>
              <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Secure Payment via UPI/WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
