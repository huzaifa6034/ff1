
import React, { useState, useEffect } from 'react';
import { Tournament, User, Admin, AppState } from './types';
import Header from './components/Header';
import Home from './components/Home';
import TournamentDetails from './components/TournamentDetails';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import Rules from './components/Rules';
import Results from './components/Results';
import RegistrationForm from './components/RegistrationForm';
import Profile from './components/Profile';

// IMPORTANT: Replace this with your actual Cloudflare Worker URL
// If running locally or as a demo, the app will fallback to localStorage/mock data.
const API_URL = "https://ff1-bsq.pages.dev";

const INITIAL_MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'mock-1',
    title: 'ELITE SURVIVAL CUP',
    mode: 'Solo',
    entryFee: '₹50',
    prizePool: '₹5000',
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    slots: 48,
    registeredCount: 12,
    status: 'open',
    rules: 'Standard Survival Rules. No emulators. Minimum Level 40.'
  },
  {
    id: 'mock-2',
    title: 'SQUAD SHOWDOWN S2',
    mode: 'Squad',
    entryFee: 'Free',
    prizePool: '₹2000',
    dateTime: new Date(Date.now() + 172800000).toISOString(),
    slots: 12,
    registeredCount: 12,
    status: 'closed',
    rules: 'Full map. Standard settings.'
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    authMode: 'login',
    user: null,
    admin: null
  });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
    // Persistent session
    const savedUser = localStorage.getItem('ff_user');
    const savedAdmin = localStorage.getItem('ff_admin');
    if (savedUser) setState(s => ({ ...s, user: JSON.parse(savedUser) }));
    if (savedAdmin) setState(s => ({ ...s, admin: JSON.parse(savedAdmin) }));
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      // Attempt to fetch from real API
      const res = await fetch(`${API_URL}/api/tournaments`);
      if (!res.ok) throw new Error("API response not OK");
      
      const data = await res.json();
      setTournaments(data);
      console.log("Tournaments loaded from API.");
    } catch (e) {
      console.warn("API unavailable, falling back to local storage/mock data.");
      
      // Fallback logic for testing/demo purposes
      const localTourneys = localStorage.getItem('ff_tournaments');
      if (localTourneys) {
        setTournaments(JSON.parse(localTourneys));
      } else {
        setTournaments(INITIAL_MOCK_TOURNAMENTS);
        localStorage.setItem('ff_tournaments', JSON.stringify(INITIAL_MOCK_TOURNAMENTS));
      }
    } finally {
      setLoading(false);
    }
  };

  const navigate = (view: AppState['view'], id?: string) => {
    setState(s => ({ ...s, view, selectedTournamentId: id || s.selectedTournamentId }));
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (user: User | Admin, type: 'user' | 'admin') => {
    if (type === 'user') {
      setState(s => ({ ...s, user: user as User, view: 'dashboard' }));
      localStorage.setItem('ff_user', JSON.stringify(user));
    } else {
      setState(s => ({ ...s, admin: user as Admin, view: 'admin-panel' }));
      localStorage.setItem('ff_admin', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setState(s => ({ ...s, user: null, admin: null, view: 'home' }));
  };

  // Callback for Admin Panel to refresh UI after changes
  const handleRefresh = async () => {
    await fetchTournaments();
  };

  const handleUpdateTournaments = (updated: Tournament[]) => {
    setTournaments(updated);
    localStorage.setItem('ff_tournaments', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-300">
      <Header 
        currentView={state.view} 
        user={state.user} 
        isAdmin={!!state.admin} 
        onNavigate={navigate} 
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {loading && state.view === 'home' ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gaming-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {state.view === 'home' && <Home tournaments={tournaments} onNavigate={navigate} />}
            {state.view === 'details' && (
              <TournamentDetails 
                tournament={tournaments.find(t => t.id === state.selectedTournamentId) || INITIAL_MOCK_TOURNAMENTS[0]} 
                user={state.user}
                onNavigate={navigate}
                apiUrl={API_URL}
                onRefresh={handleRefresh}
              />
            )}
            {state.view === 'auth' && (
              <Auth 
                mode={state.authMode} 
                onSuccess={(u) => handleAuthSuccess(u, 'user')} 
                onToggleMode={() => setState(s => ({ ...s, authMode: s.authMode === 'login' ? 'signup' : 'login' }))}
                apiUrl={API_URL}
              />
            )}
            {state.view === 'dashboard' && state.user && (
              <UserDashboard user={state.user} apiUrl={API_URL} onNavigate={navigate} />
            )}
            {state.view === 'admin-login' && (
              <Auth 
                mode="login" 
                isAdmin 
                onSuccess={(u) => handleAuthSuccess(u, 'admin')} 
                apiUrl={API_URL}
              />
            )}
            {state.view === 'admin-panel' && state.admin && (
              <AdminPanel admin={state.admin} tournaments={tournaments} apiUrl={API_URL} onRefresh={handleRefresh} />
            )}
            {state.view === 'rules' && <Rules />}
            {state.view === 'results' && <Results />}
            {state.view === 'register' && state.user && state.selectedTournamentId && (
              <RegistrationForm 
                user={state.user} 
                tournament={tournaments.find(t => t.id === state.selectedTournamentId) || INITIAL_MOCK_TOURNAMENTS[0]} 
                onNavigate={navigate} 
              />
            )}
            {state.view === 'profile' && state.user && (
              <Profile user={state.user} onLogout={handleLogout} onNavigate={navigate} />
            )}
          </>
        )}
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-oswald text-xl font-bold mb-4 text-white uppercase tracking-tighter">FF TOURNEY <span className="text-gaming-orange">ELITE</span></p>
          <div className="flex justify-center space-x-6 mb-6">
            <button onClick={() => navigate('rules')} className="text-sm font-bold text-zinc-500 hover:text-white transition uppercase tracking-widest">Rules</button>
            <button onClick={() => navigate('results')} className="text-sm font-bold text-zinc-500 hover:text-white transition uppercase tracking-widest">Winners</button>
            <button onClick={() => navigate('admin-login')} className="text-sm font-bold text-zinc-500 hover:text-white transition uppercase tracking-widest">Admin</button>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">© 2024 FF Tourney Elite. Not affiliated with Garena.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
