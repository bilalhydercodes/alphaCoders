'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { IconLeague, IconXp } from './icons/LumiIcons';
import { Trophy, TrendingUp, Shield } from 'lucide-react';

export const GuildLeague: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Mock guild cohort ranking including the user
  const cohort = [
    { rank: 1, name: 'Aurelia the Dawnblade', title: 'Grand Guildmaster', xp: 480, streak: 14, isUser: false },
    { rank: 2, name: 'Kaelen the Silent', title: 'Shadow Stalker', xp: 395, streak: 9, isUser: false },
    { rank: 3, name: user.username, title: user.title, xp: Math.max(user.xp, 320), streak: user.streak, isUser: true },
    { rank: 4, name: 'Lyra Mindwhisper', title: 'Spell Weaver', xp: 280, streak: 5, isUser: false },
    { rank: 5, name: 'Boran Ironhide', title: 'Shield Bearer', xp: 210, streak: 3, isUser: false },
    { rank: 6, name: 'Elysia the Keen', title: 'Novice Adventurer', xp: 140, streak: 2, isUser: false },
    { rank: 7, name: 'Rowan Stonecarver', title: 'Novice Adventurer', xp: 95, streak: 1, isUser: false },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto pb-12">
      {/* League Banner */}
      <div className="bg-gradient-to-r from-primary to-[#7A4BC2] text-white p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
            <IconLeague size={36} filled className="text-accent" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-white/80">
              WEEKLY GUILD TOURNAMENT
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-0.5">Amethyst League</h2>
            <p className="text-xs text-white/90 mt-1">
              Top 3 adventurers advance to the legendary Diamond League in 2 days!
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white/80 block uppercase">YOUR RANK</span>
          <span className="text-xl font-black text-white">#3</span>
        </div>
      </div>

      {/* Promotion Zone Notice */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold">
        <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>You are currently in the Promotion Zone! Keep logging bounties to stay ahead.</span>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b-2 border-slate-100 flex items-center justify-between text-xs font-black text-copy-muted uppercase tracking-wider">
          <span>Adventurer</span>
          <span>Weekly XP</span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {cohort.map((player) => (
            <div
              key={player.name}
              className={`flex items-center justify-between p-4 transition-colors ${
                player.isUser
                  ? 'bg-lavender-soft/60 font-black'
                  : 'hover:bg-slate-50 font-bold'
              }`}
            >
              {/* Rank & User Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-7 text-center font-black text-sm ${
                    player.rank === 1
                      ? 'text-accent text-base'
                      : player.rank === 2
                      ? 'text-slate-400 text-base'
                      : player.rank === 3
                      ? 'text-amber-700 text-base'
                      : 'text-slate-400'
                  }`}
                >
                  {player.rank}
                </span>

                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-copy flex-shrink-0">
                  {player.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm text-copy truncate">{player.name}</p>
                    {player.isUser && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-primary text-primary-on">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-copy-muted font-medium truncate">
                    {player.title} · {player.streak}d streak
                  </p>
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1.5 text-xs font-black text-primary flex-shrink-0">
                <IconXp size={16} filled />
                <span>{player.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
