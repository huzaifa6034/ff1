
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
// Import missing RegistrationForm and Profile components
import RegistrationForm from './components/RegistrationForm';
import Profile from './components/Profile';

// Replace with your actual Worker URL after deployment
const API_URL = "https://your-worker.your-subdomain.workers.dev";

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
      const res = await fetch(`${API_URL}/api/tournaments`);
      const data = await res.json();
      setTournaments(data);
    } catch (e) {
      console.error("Failed to fetch tournaments");
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-300">
      {/* Fixed Header props passing */}
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
                tournament={tournaments.find(t => t.id === state.selectedTournamentId)!} 
                user={state.user}
                onNavigate={navigate}
                apiUrl={API_URL}
                onRefresh={fetchTournaments}
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
              <AdminPanel admin={state.admin} tournaments={tournaments} apiUrl={API_URL} onRefresh={fetchTournaments} />
            )}
            {state.view === 'rules' && <Rules />}
            {state.view === 'results' && <Results />}
            {/* Added missing views */}
            {state.view === 'register' && state.user && state.selectedTournamentId && (
              <RegistrationForm 
                user={state.user} 
                tournament={tournaments.find(t => t.id === state.selectedTournamentId)!} 
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
          <p className="font-oswald text-xl font-bold mb-4">FF TOURNEY <span className="text-gaming-orange">ELITE</span></p>
          <div className="flex justify-center space-x-6 mb-6">
            <button onClick={() => navigate('rules')} className="text-sm hover:text-white">Rules</button>
            <button onClick={() => navigate('results')} className="text-sm hover:text-white">Results</button>
            <button onClick={() => navigate('admin-login')} className="text-sm hover:text-white">Admin</button>
          </div>
          <p className="text-xs text-zinc-600">© 2024 FF Tourney Elite. Not affiliated with Garena.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
