
import React from 'react';
import { AppState, User } from '../types';

interface HeaderProps {
  currentView: AppState['view'];
  user: User | null;
  isAdmin: boolean;
  onNavigate: (view: AppState['view']) => void;
  // Added onLogout prop which was being passed in App.tsx
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, user, isAdmin, onNavigate, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 py-4 shadow-xl">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-gaming-orange rounded flex items-center justify-center transform group-hover:rotate-12 transition shadow-[0_0_15px_rgba(255,76,0,0.4)]">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 4.17L18.83 19H5.17L12 6.17zM11 14h2v2h-2v-2zm0-5h2v4h-2V9z" />
            </svg>
          </div>
          <span className="font-oswald text-2xl font-bold tracking-tighter">FF TOURNEY <span className="text-gaming-orange">ELITE</span></span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <button onClick={() => onNavigate('home')} className={`font-semibold transition ${currentView === 'home' ? 'text-gaming-orange' : 'text-zinc-400 hover:text-white'}`}>Home</button>
          <button onClick={() => onNavigate('rules')} className={`font-semibold transition ${currentView === 'rules' ? 'text-gaming-orange' : 'text-zinc-400 hover:text-white'}`}>Rules</button>
          <button onClick={() => onNavigate('results')} className={`font-semibold transition ${currentView === 'results' ? 'text-gaming-orange' : 'text-zinc-400 hover:text-white'}`}>Winners</button>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div 
              // Changed 'profile' to 'profile' (which is now in the view union)
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-3 cursor-pointer bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-gaming-orange transition"
            >
              <div className="w-8 h-8 rounded-full bg-gaming-orange flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-bold text-sm text-zinc-300">{user.name.split(' ')[0]}</span>
            </div>
          ) : isAdmin ? (
            // Changed 'admin-dashboard' to 'admin-panel' to match union
            <button onClick={() => onNavigate('admin-panel')} className="bg-zinc-800 text-white px-4 py-2 rounded font-bold hover:bg-zinc-700 transition text-sm">Admin Panel</button>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="bg-gaming-orange text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition text-sm shadow-lg glow-orange"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
