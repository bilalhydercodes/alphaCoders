'use client';

import React from 'react';
import { sound } from '@/lib/sound';
import { IconCheck, IconLock, IconChest, IconXp } from './icons/LumiIcons';

export interface MapNodeData {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  goldReward: number;
  status: 'completed' | 'active' | 'locked' | 'milestone';
  isBoss?: boolean;
}

interface QuestMapNodeProps {
  node: MapNodeData;
  index: number;
  onClick: (node: MapNodeData) => void;
}

export const QuestMapNode: React.FC<QuestMapNodeProps> = ({ node, index, onClick }) => {
  // Custom sinusoidal S-curve displacement: natural winding mountain path
  const horizontalOffset = Math.round(Math.sin(index * 0.75) * 52);

  const handleClick = () => {
    if (node.status === 'locked') return;
    sound.playClick();
    onClick(node);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center my-6"
      style={{ transform: `translateX(${horizontalOffset}px)` }}
    >
      {/* Active Node: Bouncing "START" Pointer Speech Bubble */}
      {node.status === 'active' && (
        <div className="absolute -top-10 px-3 py-1 bg-white border-2 border-primary rounded-xl text-primary font-black text-xs uppercase tracking-wider animate-bounce shadow-md z-20 flex items-center gap-1">
          <span>START</span>
          {/* Speech bubble pointer arrow */}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-primary rotate-45" />
        </div>
      )}

      {/* Stepping Stone 3D Circular Button */}
      <button
        onClick={handleClick}
        disabled={node.status === 'locked'}
        aria-label={`${node.title} - ${node.status}`}
        className={`relative w-[68px] h-[68px] rounded-full flex items-center justify-center font-black text-lg transition-all cursor-pointer ${
          node.status === 'completed'
            ? 'btn-3d-node-completed text-white'
            : node.status === 'active'
            ? 'btn-3d-node-active text-white ring-4 ring-primary/20 animate-pop-in'
            : node.status === 'milestone'
            ? 'bg-accent text-primary-on border-b-6 border-[#D49E00] shadow-gold-glow'
            : 'btn-3d-node-locked'
        }`}
      >
        {node.status === 'completed' ? (
          <IconCheck size={32} filled className="text-white" />
        ) : node.status === 'milestone' ? (
          <IconChest size={32} filled className="text-primary-on" />
        ) : node.status === 'locked' ? (
          <IconLock size={26} className="text-slate-400" />
        ) : (
          <IconXp size={32} filled className="text-white" />
        )}
      </button>

      {/* Subtext: Node title */}
      <div className="mt-2 text-center max-w-[120px]">
        <p className={`text-xs font-bold truncate ${node.status === 'locked' ? 'text-slate-400' : 'text-copy'}`}>
          {node.title}
        </p>
        <span className="text-[10px] font-extrabold text-primary">
          +{node.xpReward} XP
        </span>
      </div>
    </div>
  );
};
