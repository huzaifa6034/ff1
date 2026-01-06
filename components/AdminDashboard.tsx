
import React, { useState, useEffect } from 'react';
import { Tournament, Player } from '../types';

interface AdminDashboardProps {
  tournaments: Tournament[];
  onUpdateTournaments: (tournaments: Tournament[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ tournaments, onUpdateTournaments }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'tournaments' | 'players'>('tournaments');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Partial<Tournament> | null>(null);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('ff_players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  const handleDeleteTournament = (id: string) => {
    if (window.confirm('Delete this tournament?')) {
      onUpdateTournaments(tournaments.filter(t => t.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    onUpdateTournaments(tournaments.map(t => 
      t.id === id ? { ...t, status: t.status === 'open' ? 'closed' : 'open' } : t
    ));
  };

  const handleSaveTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const tourney = editingTournament as Tournament;
    if (tourney.id) {
      onUpdateTournaments(tournaments.map(t => t.id === tourney.id ? tourney : t));
    } else {
      const newTourney = {
        ...tourney,
        id: Math.random().toString(36).substr(2, 9),
        registeredCount: 0,
        status: 'open'
      } as Tournament;
      onUpdateTournaments([...tournaments, newTourney]);
    }
    setShowModal(false);
    setEditingTournament(null);
  };

  const exportToCSV = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    const tournamentPlayers = players.filter(p => p.tournamentId === tournamentId);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "IGN,UID,WhatsApp,Date\n";
    
    tournamentPlayers.forEach(p => {
      csvContent += `${p.ign},${p.uid},${p.whatsapp},${p.registrationDate}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tournament?.title.replace(/\s+/g, '_')}_players.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPlayers = selectedTournamentId 
    ? players.filter(p => p.tournamentId === selectedTournamentId)
    : players;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 gap-4">
        <div className="flex p-1 bg-black rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('tournaments')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold text-sm transition ${activeTab === 'tournaments' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Manage Tournaments
          </button>
          <button 
            onClick={() => setActiveTab('players')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold text-sm transition ${activeTab === 'players' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Registered Players
          </button>
        </div>

        {activeTab === 'tournaments' && (
          <button 
            onClick={() => {
              // Fixed property names to match updated types.ts
              setEditingTournament({ title: '', dateTime: '', entryFee: '', prizePool: '', slots: 48, rules: '', whatsappLink: '' });
              setShowModal(true);
            }}
            className="w-full md:w-auto bg-gaming-orange text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            Create Tournament
          </button>
        )}
      </div>

      {activeTab === 'tournaments' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black text-zinc-500 text-xs uppercase font-bold border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Tournament</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Players</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {tournaments.map(t => (
                <tr key={t.id} className="hover:bg-black/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{t.title}</p>
                    {/* Fixed dateTime */}
                    <p className="text-xs text-zinc-500">{new Date(t.dateTime).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'open' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {/* Fixed registeredCount and slots */}
                    {t.registeredCount} / {t.slots}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(t.id)}
                        className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
                        title="Toggle Status"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => { setEditingTournament(t); setShowModal(true); }}
                        className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteTournament(t.id)}
                        className="p-2 hover:bg-zinc-800 rounded text-red-500 hover:text-red-400 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="w-full max-w-xs">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Filter by Tournament</label>
              <select 
                value={selectedTournamentId}
                onChange={e => setSelectedTournamentId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-gaming-orange"
              >
                <option value="">All Tournaments</option>
                {tournaments.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            {selectedTournamentId && (
              <button 
                onClick={() => exportToCSV(selectedTournamentId)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-black text-zinc-500 text-xs uppercase font-bold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">IGN</th>
                  <th className="px-6 py-4">UID</th>
                  <th className="px-6 py-4">WhatsApp</th>
                  <th className="px-6 py-4">Tournament</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredPlayers.length > 0 ? filteredPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-black/50 transition">
                    <td className="px-6 py-4 font-bold text-white">{p.ign}</td>
                    <td className="px-6 py-4 text-zinc-400">{p.uid}</td>
                    <td className="px-6 py-4 text-zinc-400">{p.whatsapp}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {tournaments.find(t => t.id === p.tournamentId)?.title || 'Deleted'}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(p.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No players found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating/Editing */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-xl rounded-2xl border border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-oswald font-bold uppercase">{editingTournament?.id ? 'Edit' : 'Create'} Tournament</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveTournament} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Title</label>
                  <input 
                    type="text" required
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange"
                    value={editingTournament?.title || ''}
                    onChange={e => setEditingTournament(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Date & Time</label>
                  <input 
                    type="datetime-local" required
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange"
                    value={editingTournament?.dateTime || ''}
                    onChange={e => setEditingTournament(prev => ({ ...prev, dateTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Entry Fee</label>
                  <input 
                    type="text" required placeholder="e.g. ₹50 or FREE"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange"
                    value={editingTournament?.entryFee || ''}
                    onChange={e => setEditingTournament(prev => ({ ...prev, entryFee: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Prize Pool</label>
                  <input 
                    type="text" required placeholder="e.g. ₹5000"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange"
                    value={editingTournament?.prizePool || ''}
                    onChange={e => setEditingTournament(prev => ({ ...prev, prizePool: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Slots</label>
                  <input 
                    type="number" required
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange"
                    value={editingTournament?.slots || 48}
                    onChange={e => setEditingTournament(prev => ({ ...prev, slots: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">WA Link</label>
                  <input 
                    type="url" required placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange"
                    value={editingTournament?.whatsappLink || ''}
                    onChange={e => setEditingTournament(prev => ({ ...prev, whatsappLink: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Rules (Markdown)</label>
                <textarea 
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gaming-orange resize-none"
                  value={editingTournament?.rules || ''}
                  onChange={e => setEditingTournament(prev => ({ ...prev, rules: e.target.value }))}
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-gaming-orange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">
                  Save Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
