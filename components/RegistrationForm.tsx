
import React, { useState } from 'react';
import { Tournament, AppState, Player, User } from '../types';

interface RegistrationFormProps {
  user: User;
  tournament: Tournament;
  onNavigate: (view: AppState['view']) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, tournament, onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Check if already registered
      const players: Player[] = JSON.parse(localStorage.getItem('ff_players') || '[]');
      const alreadyJoined = players.find(p => p.userId === user.id && p.tournamentId === tournament.id);
      
      if (alreadyJoined) {
        setError('You are already registered for this tournament.');
        setIsSubmitting(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        tournamentId: tournament.id,
        registrationDate: new Date().toISOString()
      };
      players.push(newPlayer);
      localStorage.setItem('ff_players', JSON.stringify(players));

      const tournaments = JSON.parse(localStorage.getItem('ff_tournaments') || '[]');
      const updatedTourneys = tournaments.map((t: Tournament) => 
        // Fixed property name registeredCount
        t.id === tournament.id ? { ...t, registeredCount: t.registeredCount + 1 } : t
      );
      localStorage.setItem('ff_tournaments', JSON.stringify(updatedTourneys));

      setSuccess(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-oswald font-bold mb-2 uppercase tracking-tighter">Registration Complete!</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">Awesome, <span className="text-white font-bold">{user.name}</span>! You are in. Details will be sent to your WhatsApp number.</p>
        
        <div className="space-y-4">
          <a 
            // Fixed property name whatsappLink
            href={tournament.whatsappLink || '#'} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:opacity-90 transition shadow-lg"
          >
            <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Join Match Group
          </a>
          <button 
            // Changed 'profile' to 'profile'
            onClick={() => onNavigate('profile')}
            className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition"
          >
            My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <button onClick={() => onNavigate('home')} className="text-zinc-500 hover:text-white flex items-center mb-4 transition group">
          <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="text-3xl font-oswald font-bold uppercase tracking-tighter">{tournament.title}</h2>
        <p className="text-zinc-500">Confirming your slot...</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gaming-orange/5 blur-3xl rounded-full"></div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm flex items-center">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        )}

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Player Name</span>
            <span className="text-white font-bold">{user.name}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Free Fire UID</span>
            <span className="text-white font-bold">{user.ff_uid}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">WhatsApp</span>
            <span className="text-white font-bold">{user.whatsapp}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Entry Fee</span>
            {/* Fixed property name entryFee */}
            <span className="text-gaming-orange font-bold text-lg">{tournament.entryFee}</span>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-[10px] text-zinc-500 text-center mb-4 uppercase tracking-widest leading-relaxed">By clicking confirm, you agree to our tournament rules and fair play guidelines.</p>
          <button 
            onClick={handleConfirm} disabled={isSubmitting}
            className="w-full bg-gaming-orange text-white font-bold py-5 rounded-2xl hover:bg-orange-600 transition flex items-center justify-center glow-orange disabled:opacity-50 uppercase tracking-widest"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Confirm Entry'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
