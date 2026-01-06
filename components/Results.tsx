
import React from 'react';

const Results: React.FC = () => {
  const previousWinners = [
    { name: "Team Hydra", tournament: "Survival Cup #42", prize: "₹2000", date: "Dec 15, 2023" },
    { name: "Killer777", tournament: "Solo Duel S12", prize: "₹500", date: "Dec 12, 2023" },
    { name: "Global Elites", tournament: "Weekly Clash", prize: "₹1500", date: "Dec 08, 2023" }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-oswald font-bold mb-4 uppercase">Hall of <span className="text-gaming-orange">Fame</span></h1>
        <p className="text-zinc-500">The champions who dominated the battlefield.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {previousWinners.map((winner, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center transform hover:scale-105 transition duration-300">
            <div className="w-16 h-16 bg-zinc-800 text-gaming-orange rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gaming-orange shadow-[0_0_15px_rgba(255,76,0,0.2)]">
              {i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}
            </div>
            <h3 className="text-xl font-bold mb-1 text-white uppercase">{winner.name}</h3>
            <p className="text-gaming-orange font-bold text-sm mb-4">{winner.prize}</p>
            <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
              <p>{winner.tournament}</p>
              <p>{winner.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h2 className="text-2xl font-oswald font-bold mb-6 flex items-center uppercase">
          <div className="w-2 h-8 bg-gaming-orange mr-3"></div>
          Recent Match Standings
        </h2>
        
        <div className="space-y-4">
          {[1, 2, 3].map(m => (
            <div key={m} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mr-4">
                  <span className="text-zinc-500 font-bold">#{m}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Match #{1040 + m} - Bermuda Remastered</h4>
                  <p className="text-xs text-zinc-500">Dec 18, 2023 • Classic Squad</p>
                </div>
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition">
                View Scoreboard
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fixed export name to match component declaration
export default Results;
