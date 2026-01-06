
import React from 'react';
import { Tournament, AppState } from '../types';

interface HomeProps {
  tournaments: Tournament[];
  onNavigate: (view: AppState['view'], id?: string) => void;
}

const Home: React.FC<HomeProps> = ({ tournaments, onNavigate }) => {
  return (
    <div>
      <section className="mb-12 relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 h-64 md:h-80 flex items-center">
        <div className="absolute inset-0 opacity-40">
           <img src="https://picsum.photos/seed/ff1/1200/600" alt="Hero" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>
        <div className="relative z-10 px-8">
          <span className="bg-gaming-orange text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block tracking-widest uppercase">Limited Slots</span>
          <h1 className="text-4xl md:text-6xl font-oswald font-bold mb-4 leading-tight uppercase">Enter the <span className="text-gaming-orange">Arena</span></h1>
          <p className="text-zinc-400 max-w-md text-lg mb-6">Compete with the best players and win exciting prizes in our weekly tournaments.</p>
          <button 
            onClick={() => onNavigate('rules')}
            className="bg-white text-black font-bold py-3 px-8 rounded hover:bg-zinc-200 transition"
          >
            Read Guidelines
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-oswald font-bold flex items-center uppercase">
          <div className="w-2 h-8 bg-gaming-orange mr-3"></div>
          Upcoming Tournaments
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="gaming-card rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${tournament.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {tournament.status === 'open' ? 'Registration Open' : 'Full / Closed'}
                </span>
                <span className="text-zinc-500 text-xs">{new Date(tournament.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-gaming-orange transition">{tournament.title}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-800/50 p-3 rounded">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Entry Fee</p>
                  <p className="text-lg font-bold">{tournament.entryFee}</p>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Prize Pool</p>
                  <p className="text-lg font-bold text-gaming-orange">{tournament.prizePool}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="text-sm">
                <span className="text-zinc-400">Slots:</span>
                <span className="ml-2 font-bold text-white">{tournament.registeredCount}/{tournament.slots}</span>
              </div>
              <button 
                disabled={tournament.status !== 'open'}
                onClick={() => onNavigate('register', tournament.id)}
                className={`py-2 px-6 rounded font-bold transition ${tournament.status === 'open' ? 'bg-gaming-orange hover:bg-orange-600 text-white glow-orange' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {tournament.status === 'open' ? 'Register Now' : 'Closed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
