'use client';

import React, { useState } from 'react';
import { QuestMapNode, MapNodeData } from './QuestMapNode';
import { sound } from '@/lib/sound';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, BookOpen, Dumbbell, Heart, Trophy, Check, ArrowRight, X } from 'lucide-react';
import { IconCheck, IconXp, IconGold } from './icons/LumiIcons';

interface QuestMapProps {
  onCompleteQuestModal: (node: MapNodeData) => void;
}

export const QuestMap: React.FC<QuestMapProps> = ({ onCompleteQuestModal }) => {
  const { user, refreshUser, updateUserOptimistic, triggerLumiReaction } = useAuth();
  const [selectedNode, setSelectedNode] = useState<MapNodeData | null>(null);

  // Dynamic nodes derived from user level and activity
  const userLevel = user?.level || 1;

  const units = [
    {
      id: 'unit-1',
      number: 1,
      title: "The Scholar's Awakening",
      description: "Build deep mental clarity, study habits, and morning focus.",
      themeColor: 'from-primary to-[#7A4BC2]',
      nodes: [
        {
          id: 'u1-1',
          title: 'Morning Glass of Water',
          category: 'VITALITY',
          xpReward: 15,
          goldReward: 5,
          status: 'completed' as const,
        },
        {
          id: 'u1-2',
          title: '25-Min Deep Focus Sprint',
          category: 'INTELLECT',
          xpReward: 50,
          goldReward: 25,
          status: 'active' as const,
        },
        {
          id: 'u1-3',
          title: 'Read 15 Pages of Book',
          category: 'INTELLECT',
          xpReward: 35,
          goldReward: 15,
          status: userLevel >= 2 ? ('active' as const) : ('locked' as const),
        },
        {
          id: 'u1-4',
          title: 'Scholar’s Guild Chest',
          category: 'MILESTONE',
          xpReward: 100,
          goldReward: 50,
          status: userLevel >= 2 ? ('completed' as const) : ('locked' as const),
          isBoss: false,
        },
      ],
    },
    {
      id: 'unit-2',
      number: 2,
      title: 'The Temple of Vigor',
      description: 'Strengthen physical endurance, posture, and core stamina.',
      themeColor: 'from-emerald-600 to-teal-700',
      nodes: [
        {
          id: 'u2-1',
          title: '15-Min Limbering Stretch',
          category: 'STRENGTH',
          xpReward: 25,
          goldReward: 10,
          status: userLevel >= 2 ? ('active' as const) : ('locked' as const),
        },
        {
          id: 'u2-2',
          title: '30-Min Cardio or Gym Workout',
          category: 'STRENGTH',
          xpReward: 75,
          goldReward: 35,
          status: 'locked' as const,
        },
        {
          id: 'u2-3',
          title: 'Nutritious High-Protein Meal',
          category: 'VITALITY',
          xpReward: 30,
          goldReward: 15,
          status: 'locked' as const,
        },
        {
          id: 'u2-4',
          title: 'Vigor Milestone Treasure',
          category: 'MILESTONE',
          xpReward: 150,
          goldReward: 75,
          status: 'locked' as const,
        },
      ],
    },
  ];

  const handleNodeClick = (node: MapNodeData) => {
    setSelectedNode(node);
  };

  const handleCompleteActiveNode = async () => {
    if (!selectedNode || selectedNode.status === 'locked') return;

    sound.playQuestComplete();
    sound.playCoin();

    // Optimistic user update
    updateUserOptimistic((prev) => ({
      ...prev,
      xp: prev.xp + selectedNode.xpReward,
      gold: prev.gold + selectedNode.goldReward,
    }));

    triggerLumiReaction('achievement', `Node completed! +${selectedNode.xpReward} XP gained!`);

    try {
      // Create and complete quest server-side
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedNode.title,
          category: selectedNode.category === 'MILESTONE' ? 'SPIRIT' : selectedNode.category,
          difficulty: selectedNode.xpReward >= 75 ? 'HARD' : selectedNode.xpReward >= 50 ? 'MEDIUM' : 'EASY',
          type: 'TODO',
        }),
      });
      const data = await res.json();
      if (data.quest) {
        await fetch(`/api/quests/${data.quest.id}/complete`, { method: 'POST' });
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSelectedNode(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto pb-16">
      {units.map((unit) => (
        <section key={unit.id} className="w-full flex flex-col items-center mb-12">
          {/* Unit Banner (Duolingo-inspired high-contrast banner) */}
          <div
            className={`w-full rounded-2xl bg-gradient-to-r ${unit.themeColor} text-white p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4 mb-6`}
          >
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Unit {unit.number}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {unit.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-sm">
                {unit.description}
              </p>
            </div>
          </div>

          {/* Stepping Stone Nodes on Sinusoidal Trail */}
          <div className="relative w-full flex flex-col items-center">
            {unit.nodes.map((node, idx) => (
              <QuestMapNode
                key={node.id}
                node={node}
                index={idx}
                onClick={handleNodeClick}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Node Detail / Challenge Modal */}
      {selectedNode && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-copy/50 backdrop-blur-xs animate-in fade-in duration-200"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedNode(null);
          }}
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 sm:p-7 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-lavender-soft border-2 border-primary/30 flex items-center justify-center text-primary mb-3">
              {selectedNode.status === 'completed' ? (
                <IconCheck size={32} filled className="text-success" />
              ) : (
                <IconXp size={32} filled className="text-primary" />
              )}
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-primary">
              {selectedNode.status === 'completed' ? 'QUEST COMPLETED' : 'ACTIVE QUEST CHALLENGE'}
            </span>
            <h3 className="text-xl font-black text-copy mt-1">{selectedNode.title}</h3>
            <p className="text-xs text-copy-muted max-w-xs mt-1.5">
              Complete this milestone in the real world to earn XP and Gold on your path to mastery!
            </p>

            <div className="flex items-center gap-4 my-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 w-full justify-center">
              <div className="flex items-center gap-1.5 font-black text-sm text-primary">
                <IconXp size={20} filled />
                <span>+{selectedNode.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-sm text-accent">
                <IconGold size={20} filled />
                <span>+{selectedNode.goldReward} GP</span>
              </div>
            </div>

            {selectedNode.status === 'completed' ? (
              <div className="w-full py-3 rounded-2xl bg-success-soft border border-success/30 text-success font-black text-sm flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Already Claimed!</span>
              </div>
            ) : (
              <button
                onClick={handleCompleteActiveNode}
                className="w-full py-3.5 px-6 rounded-2xl btn-3d-primary font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Complete Quest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
