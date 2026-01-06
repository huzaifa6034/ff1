
import React, { useState } from 'react';
import { Admin, Tournament } from '../types';

interface AdminPanelProps {
  admin: Admin;
  tournaments: Tournament[];
  apiUrl: string;
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ admin, tournaments, apiUrl, onRefresh }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', mode: 'Solo', entryFee: 'Free', prizePool: '', startTime: '', maxSlots: 48, rules: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/tournament/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowCreate(false);
        onRefresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 p-6 rounded-2xl border border-zinc-800 gap-4">
        <div>
          <h1 className="text-2xl font-oswald font-bold text-white uppercase">Admin: {admin.username}</h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Operations Control</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-gaming-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg glow-orange uppercase text-xs tracking-widest"
        >
          {showCreate ? 'Close Form' : 'New Tournament'}
        </button>
      </div>

      {showCreate && (
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl animate-in fade-in zoom-in duration-300">
          <h2 className="text-xl font-bold mb-6 text-white uppercase font-oswald">Setup New Arena</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Match Title</label>
                <input required className="w-full bg-black border border-zinc-800 rounded-xl p-3 focus:border-gaming-orange" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Mode</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl p-3" value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}>
                    <option>Solo</option><option>Duo</option><option>Squad</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Max Slots</label>
                  <input type="number" className="w-full bg-black border border-zinc-800 rounded-xl p-3" value={form.maxSlots} onChange={e => setForm({...form, maxSlots: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Entry Fee</label>
                  <input className="w-full bg-black border border-zinc-800 rounded-xl p-3" value={form.entryFee} onChange={e => setForm({...form, entryFee: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Prize Pool</label>
                  <input className="w-full bg-black border border-zinc-800 rounded-xl p-3" value={form.prizePool} onChange={e => setForm({...form, prizePool: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Start Date & Time</label>
                <input type="datetime-local" className="w-full bg-black border border-zinc-800 rounded-xl p-3" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Rules / Special Instructions</label>
                <textarea rows={4} className="w-full bg-black border border-zinc-800 rounded-xl p-3" value={form.rules} onChange={e => setForm({...form, rules: e.target.value})} />
              </div>
              <button disabled={loading} className="w-full bg-gaming-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition shadow-lg glow-orange uppercase tracking-widest mt-4">
                {loading ? 'Processing...' : 'Deploy Tournament'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-black/40 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white uppercase font-oswald tracking-tight">Active Deployments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Tournament</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Participation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {tournaments.map(t => (
                <tr key={t.id} className="hover:bg-zinc-800/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white uppercase text-sm">{t.title}</p>
                    {/* Fixed start_time to dateTime */}
                    <p className="text-[10px] text-zinc-500">{new Date(t.dateTime).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gaming-orange">{t.mode}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      {/* Fixed registered_count to registeredCount and max_slots to slots */}
                      <div className="bg-green-500 h-full" style={{ width: `${(t.registeredCount / t.slots) * 100}%` }}></div>
                    </div>
                    {/* Fixed registered_count to registeredCount and max_slots to slots */}
                    <p className="text-[10px] text-zinc-500 mt-1">{t.registeredCount} / {t.slots}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${t.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest bg-zinc-800 px-3 py-1 rounded">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
