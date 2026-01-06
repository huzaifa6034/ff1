
import React, { useState } from 'react';
import { Tournament, AppState, Player } from '../types';

interface RegistrationFormProps {
  tournament: Tournament;
  onNavigate: (view: AppState['view']) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ tournament, onNavigate }) => {
  const [formData, setFormData] = useState({
    ign: '',
    uid: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation
    if (!formData.ign || !formData.uid || !formData.whatsapp) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (formData.uid.length < 8) {
      setError('Invalid Free Fire UID.');
      setIsSubmitting(false);
      return;
    }

    // Simulate API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save locally for demo
      const players = JSON.parse(localStorage.getItem('ff_players') || '[]');
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        tournamentId: tournament.id,
        ign: formData.ign,
        uid: formData.uid,
        whatsapp: formData.whatsapp,
        registrationDate: new Date().toISOString()
      };
      players.push(newPlayer);
      localStorage.setItem('ff_players', JSON.stringify(players));

      // Update tournament count locally
      const tournaments = JSON.parse(localStorage.getItem('ff_tournaments') || '[]');
      const updatedTourneys = tournaments.map((t: Tournament) => 
        t.id === tournament.id ? { ...t, registeredCount: t.registeredCount + 1 } : t
      );
      localStorage.setItem('ff_tournaments', JSON.stringify(updatedTourneys));

      setSuccess(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-oswald font-bold mb-2 uppercase">Registration Successful!</h2>
        <p className="text-zinc-400 mb-8">You are successfully registered for {tournament.title}. Please join the official WhatsApp group for room ID and password.</p>
        
        <a 
          href={tournament.whatsappLink || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:opacity-90 transition mb-4 text-center"
        >
          Join WhatsApp Group
        </a>
        
        <button 
          onClick={() => onNavigate('home')}
          className="text-zinc-500 hover:text-white transition font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <button onClick={() => onNavigate('home')} className="text-zinc-500 hover:text-white flex items-center mb-4 transition">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-3xl font-oswald font-bold uppercase">Join Tournament</h2>
        <p className="text-zinc-500">{tournament.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">In-Game Name (IGN)</label>
          <input 
            type="text" 
            placeholder="e.g. SKYLER_GAMER"
            className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 focus:outline-none focus:border-gaming-orange transition text-white"
            value={formData.ign}
            onChange={e => setFormData({ ...formData, ign: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Free Fire UID</label>
          <input 
            type="text" 
            placeholder="1234567890"
            className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 focus:outline-none focus:border-gaming-orange transition text-white"
            value={formData.uid}
            onChange={e => setFormData({ ...formData, uid: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">WhatsApp Number</label>
          <div className="flex">
             <span className="inline-flex items-center px-4 bg-zinc-800 border border-zinc-800 rounded-l-lg text-zinc-400 text-sm">
              +91
            </span>
            <input 
              type="tel" 
              placeholder="9876543210"
              className="w-full bg-black border border-zinc-800 rounded-r-lg py-3 px-4 focus:outline-none focus:border-gaming-orange transition text-white"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gaming-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition flex items-center justify-center glow-orange disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Confirm Registration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
