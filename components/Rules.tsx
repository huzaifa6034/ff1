
import React from 'react';

const Rules: React.FC = () => {
  const commonRules = [
    { title: "No Hacks / Cheats", desc: "Use of any third-party tools, scripts, or modified versions of the game will result in an immediate ban and disqualification without refund." },
    { title: "Emulators Forbidden", desc: "This is a mobile-only tournament. Use of PCs, Macbooks, or emulators like BlueStacks is strictly prohibited." },
    { title: "Room Timing", desc: "Room ID and Password will be shared 15 minutes before the match starts on the WhatsApp group. Matches will start sharp on time." },
    { title: "Team Coordination", desc: "All team members must have the same tag if playing as a squad. Players must join the correct slot as assigned." },
    { title: "Fair Play", desc: "Teaming up with enemy squads, stream sniping, or toxic behavior in lobby will lead to point deduction." }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-oswald font-bold mb-4 uppercase">Rules & <span className="text-gaming-orange">Regulations</span></h1>
        <p className="text-zinc-500 max-w-2xl mx-auto">Please read the following guidelines carefully before registering. Ignorance of rules is not an excuse for disqualification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commonRules.map((rule, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-gaming-orange transition group">
            <div className="w-10 h-10 bg-zinc-800 text-gaming-orange rounded-lg flex items-center justify-center font-bold mb-4 group-hover:bg-gaming-orange group-hover:text-white transition">
              {i + 1}
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{rule.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{rule.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gaming-orange/10 border border-gaming-orange/30 p-8 rounded-2xl mt-12">
        <h3 className="text-2xl font-oswald font-bold mb-4 text-gaming-orange uppercase">Dispute Resolution</h3>
        <p className="text-zinc-300 mb-4">In case of any dispute, the admin's decision will be final. Players must record their gameplay or take screenshots of kills and final standings for verification.</p>
        <button className="bg-gaming-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Rules;
