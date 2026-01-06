
import React, { useState, useEffect } from 'react';
import { Tournament, AppState, User } from './types';
import Header from './components/Header';
import Home from './components/Home';
import TournamentDetails from './components/TournamentDetails';
import Rules from './components/Rules';
import Results from './components/Results';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import RegistrationForm from './components/RegistrationForm';
import Auth from './components/Auth';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    user: null,
    isAdmin: false
  });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('ff_logged_user');
    if (savedUser) {
      setState(prev => ({ ...prev, user: JSON.parse(savedUser) }));
    }

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

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, user, view: 'home' }));
    localStorage.setItem('ff_logged_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null, view: 'home', isAdmin: false }));
    localStorage.removeItem('ff_logged_user');
  };

  const currentTournament = tournaments.find(t => t.id === state.selectedTournamentId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentView={state.view} 
        user={state.user}
        isAdmin={state.isAdmin} 
        onNavigate={navigate} 
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-gaming-orange rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 bg-zinc-900 rounded-full"></div>
              </div>
            </div>
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
              state.user ? (
                <RegistrationForm user={state.user} tournament={currentTournament} onNavigate={navigate} />
              ) : (
                <Auth onAuthSuccess={handleLogin} />
              )
            )}
            {state.view === 'rules' && <Rules />}
            {state.view === 'results' && <Results />}
            {state.view === 'auth' && <Auth onAuthSuccess={handleLogin} />}
            {state.view === 'profile' && state.user && (
              <Profile user={state.user} onLogout={handleLogout} onNavigate={navigate} />
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

      <footer className="bg-zinc-900/50 py-12 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="text-center md:text-left">
               <span className="font-oswald text-2xl font-bold tracking-tighter uppercase">FF TOURNEY <span className="text-gaming-orange">ELITE</span></span>
               <p className="text-zinc-500 text-sm mt-2 max-w-xs">Competitive gaming platform for Free Fire enthusiasts.</p>
            </div>
            <div className="flex space-x-8">
               <a href="#" className="text-zinc-400 hover:text-gaming-orange transition uppercase text-xs font-bold tracking-widest">Support</a>
               <a href="#" className="text-zinc-400 hover:text-gaming-orange transition uppercase text-xs font-bold tracking-widest">Terms</a>
               <a href="#" className="text-zinc-400 hover:text-gaming-orange transition uppercase text-xs font-bold tracking-widest">Privacy</a>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800/50 text-center">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-4">Not affiliated with Garena or Free Fire Official</p>
            <p className="text-zinc-500 text-sm">© 2024 FF Tourney Elite. Built for the community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
