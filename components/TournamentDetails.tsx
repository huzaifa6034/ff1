
import React from 'react';
import { Tournament, AppState } from '../types';

interface TournamentDetailsProps {
  tournament: Tournament;
  onNavigate: (view: AppState['view'], id?: string) => void;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({ tournament, onNavigate }) => {
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
            <