'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { IconLeague, IconXpGem, IconCheck } from './icons/LumiIcons';

export const GuildLeague: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Real cohort ranking dynamically calculated from user's actual XP
  const userXp = user.xp || 0;
  const rawCohort = [
    { name: 'Aurelia the Dawnblade', title: 'Grand Guildmaster', xp: 480, streak: 14, isUser: false },
    { name: 'Kaelen the Silent', title: 'Shadow Stalker', xp: 395, streak: 9, isUser: false },
    { name: user.username, title: user.title, xp: userXp, streak: user.streak, isUser: true },
    { name: 'Lyra Mindwhisper', title: 'Spell Weaver', xp: 280, streak: 5, isUser: false },
    { name: 'Boran Ironhide', title: 'Shield Bearer', xp: 210, streak: 3, isUser: false },
    { name: 'Elysia the Keen', title: 'Novice Adventurer', xp: 140, streak: 2, isUser: false },
    { name: 'Rowan Stonecarver', title: 'Novice Adventurer', xp: 95, streak: 1, isUser: false },
  ];

  // Dynamically sort cohort by XP descending
  const cohort = [...rawCohort]
    .sort((a, b) => b.xp - a.xp)
    .map((p, idx) => ({ ...p, rank: idx + 1 }));

  const userEntry = cohort.find((p) => p.isUser);
  const userRank = userEntry ? userEntry.rank : cohort.length;
  const inPromotionZone = userRank <= 3;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto pb-12">
      {/* League Banner */}
      <div className="bg-gradient-to-r from-primary to-[#7A4BC2] text-white p-6 sm:p-7 rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
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

        <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0">
          <span className="text-[10px] font-bold text-white/80 block uppercase">YOUR RANK</span>
          <span className="text-xl font-black text-white">#{userRank}</span>
        </div>
      </div>

      {/* Promotion Zone Notice */}
      {inPromotionZone ? (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-success-soft border border-success/30 text-[#1B6E32] text-xs font-bold">
          <IconCheck size={16} filled className="shrink-0 text-success-dark" />
          <span>You are currently in the Promotion Zone (#{userRank})! Keep logging bounties to stay ahead.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
          <span>Earn {cohort[2]?.xp ? Math.max(1, cohort[2].xp - userXp + 1) : 10} more XP to reach the Top 3 Promotion Zone! Currently #{userRank}.</span>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-surface rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs w-full">
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
                  ? 'bg-lavender-soft/40 font-black'
                  : 'hover:bg-slate-50 font-bold'
              }`}
            >
              {/* Rank & User Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`w-7 text-center font-black text-sm ${
                    player.rank === 1
                      ? 'text-[#875800] text-base'
                      : player.rank === 2
                      ? 'text-slate-500 text-base'
                      : player.rank === 3
                      ? 'text-[#875800] text-base'
                      : 'text-slate-400'
                  }`}
                >
                  {player.rank}
                </span>

                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-copy shrink-0">
                  {player.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm text-copy truncate">{player.name}</p>
                    {player.isUser && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-primary text-[#1F1730]">
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
              <div className="flex items-center gap-1.5 text-xs font-black text-primary shrink-0">
                <IconXpGem size={16} filled />
                <span>{player.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
