
import React, { useState, useEffect } from 'react';
import { Tournament, Player, AppState } from './types';
import Header from './components/Header';
import Home from './components/Home';
import TournamentDetails from './components/TournamentDetails';
import Rules from './components/Rules';
import Results from './components/Results';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import RegistrationForm from './components/RegistrationForm';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    isAdmin: false
  });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock initial data load - in production this would fetch from the Cloudflare Worker API
  useEffect(() => {
    const savedTournaments = localStorage.getItem('ff_tournaments');
    if (savedTournaments) {
      setTournaments(JSON.parse(savedTournaments));
    } else {
      const initialTourneys: Tournament[] = [
        {
          id: '1',
          title: 'ELITE PRO LEAGUE S1',
          dateTime: '2023-12-25T18:00',
          entryFee: '₹50',
          prizePool: '₹5000',
          slots: 48,
          registeredCount: 12,
          status: 'open',
          rules: '1. No hacks. 2. Mobile only. 3. Join room on time.',
          whatsappLink: 'https://chat.whatsapp.com/demo1'
        },
        {
          id: '2',
          title: 'WEEKLY SURVIVAL CUP',
          dateTime: '2023-12-30T20:00',
          entryFee: 'FREE',
          prizePool: '₹1000',
          slots: 48,
          registeredCount: 48,
          status: 'closed',
          rules: 'Standard survival rules apply.',
          whatsappLink: 'https://chat.whatsapp.com/demo2'
        }
      ];
      setTournaments(initialTourneys);
      localStorage.setItem('ff_tournaments', JSON.stringify(initialTourneys));
    }
    setIsLoading(false);
  }, []);

  const navigate = (view: AppState['view'], tournamentId?: string) => {
    setState(prev => ({ ...prev, view, selectedTournamentId: tournamentId }));
    window.scrollTo(0, 0);
  };

  const currentTournament = tournaments.find(t => t.id === state.selectedTournamentId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentView={state.view} 
        isAdmin={state.isAdmin} 
        onNavigate={navigate} 
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-orange"></div>
          </div>
        ) : (
          <>
            {state.view === 'home' && (
              <Home tournaments={tournaments} onNavigate={navigate} />
            )}
            {state.view === 'details' && currentTournament && (
              <TournamentDetails tournament={currentTournament} onNavigate={navigate} />
            )}
            {state.view === 'register' && currentTournament && (
              <RegistrationForm tournament={currentTournament} onNavigate={navigate} />
            )}
            {state.view === 'rules' && (
              <Rules />
            )}
            {state.view === 'results' && (
              <Results />
            )}
            {state.view === 'admin-login' && (
              <AdminLogin onLoginSuccess={() => {
                setState(prev => ({ ...prev, isAdmin: true, view: 'admin-dashboard' }));
              }} />
            )}
            {state.view === 'admin-dashboard' && state.isAdmin && (
              <AdminDashboard 
                tournaments={tournaments} 
                onUpdateTournaments={(newTourneys) => {
                  setTournaments(newTourneys);
                  localStorage.setItem('ff_tournaments', JSON.stringify(newTourneys));
                }}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-zinc-900 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-500 text-sm">© 2023 FF Tourney Elite. Not affiliated with Garena.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-zinc-400 hover:text-gaming-orange transition">Instagram</a>
            <a href="#" className="text-zinc-400 hover:text-gaming-orange transition">Discord</a>
            <a href="#" className="text-zinc-400 hover:text-gaming-orange transition">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
