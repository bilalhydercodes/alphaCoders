'use client';

import React from 'react';
import { sound } from '@/lib/sound';
import {
  IconCheck,
  IconLock,
  IconChest,
  IconXpGem,
} from './icons/LumiIcons';

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
  onClick: (node: MapNodeData, element: HTMLElement) => void;
}

export const QuestMapNode: React.FC<QuestMapNodeProps> = ({ node, index, onClick }) => {
  // Sinusoidal S-curve displacement for organic path layout
  const horizontalOffset = Math.round(Math.sin(index * 0.75) * 54);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (node.status === 'locked') return;
    sound.playClick();
    onClick(node, e.currentTarget);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center my-6"
      style={{ transform: `translateX(${horizontalOffset}px)` }}
    >
      {/* Active Node: Bouncing "START" Pointer Speech Bubble */}
      {node.status === 'active' && (
        <div className="absolute -top-10 px-3 py-1 bg-surface border-2 border-primary rounded-xl text-primary font-black text-xs uppercase tracking-wider animate-bounce shadow-md z-20 flex items-center gap-1">
          <span>START</span>
          {/* Speech bubble pointer arrow */}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-surface border-r-2 border-b-2 border-primary rotate-45" />
        </div>
      )}

      {/* Stepping Stone 3D Circular Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={node.status === 'locked'}
        aria-label={`${node.title} - status: ${node.status}`}
        className={`relative w-[68px] h-[68px] rounded-full flex items-center justify-center font-black text-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 ${
          node.status === 'completed'
            ? 'btn-3d-node-completed text-white'
            : node.status === 'active'
            ? 'btn-3d-node-active text-white ring-4 ring-primary/20 animate-pop-in'
            : node.status === 'milestone'
            ? 'bg-accent text-[#1F1730] border-b-6 border-[#D49E00] shadow-md'
            : 'btn-3d-node-locked'
        }`}
      >
        {node.status === 'completed' ? (
          <span className="animate-spring-check">
            <IconCheck size={32} filled className="text-white" />
          </span>
        ) : node.status === 'milestone' ? (
          <IconChest size={32} filled className="text-[#1F1730]" />
        ) : node.status === 'locked' ? (
          <IconLock size={26} className="text-slate-400" />
        ) : (
          <IconXpGem size={32} filled className="text-white" />
        )}
      </button>

      {/* Subtext: Node title (widen container to 160px for clean 2-line wraps without ellipsis) */}
      <div className="mt-2 text-center max-w-[160px] px-1">
        <p
          className={`text-xs font-bold leading-tight line-clamp-2 ${
            node.status === 'locked' ? 'text-copy-muted/60' : 'text-copy'
          }`}
        >
          {node.title}
        </p>
        <span className="text-[11px] font-extrabold text-primary block mt-0.5">
          +{node.xpReward} XP
        </span>
      </div>
    </div>
  );
};
