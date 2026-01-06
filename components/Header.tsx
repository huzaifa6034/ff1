
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  currentView: AppState['view'];
  isAdmin: boolean;
  onNavigate: (view: AppState['view']) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, isAdmin, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-gaming-orange rounded flex items-center justify-center transform group-hover:rotate-12 transition">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 4.17L18.83 19H5.17L12 6.17zM11 14h2v2h-2v-2zm0-5h2v4h-2V9z" />
            </svg>
          </div>
          <span className="font-oswald text-2xl font-bold tracking-tighter">FF TOURNEY <span className="text-gaming-orange">ELITE</span></span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <button 
            onClick={() => onNavigate('home')}
            className={`font-semibold transition ${currentView === 'home' ? 'text-gaming-orange' : 'text-zinc-400 hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('rules')}
            className={`font-semibold transition ${currentView === 'rules' ? 'text-gaming-orange' : 'text-zinc-400 hover:text-white'}`}
          >
            Rules
          </button>
          <button 
            onClick={() => onNavigate('results')}
            className={`font-semibold transition ${currentView === 'results' ? 'text-gaming-orange' : 'text-zinc-400 hover:text-white'}`}
          >
            Results
          </button>
        </nav>

        <div className="flex space-x-4">
          {isAdmin ? (
            <button 
              onClick={() => onNavigate('admin-dashboard')}
              className="bg-zinc-800 text-white px-4 py-2 rounded font-bold hover:bg-zinc-700 transition text-sm"
            >
              Dashboard
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('admin-login')}
              className="text-zinc-500 hover:text-white transition text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20.411m12.135-1.58q.33-.456.62-.933a10.005 10.005 0 00-11.854-13.253M12 11V7m0 8h.01M12 12V3" />
              </svg>
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
