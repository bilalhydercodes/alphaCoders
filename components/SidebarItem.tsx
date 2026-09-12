'use client';

import React from 'react';
import { sound } from '@/lib/sound';

interface SidebarItemProps {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; filled?: boolean }>;
  isActive: boolean;
  onClick: () => void;
  badge?: string | number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  badge,
}) => {
  const handleClick = () => {
    sound.playClick();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={`w-full flex items-center justify-between px-4 lg:px-4 md:px-0 md:justify-center lg:justify-between h-12 rounded-2xl text-sm font-extrabold uppercase tracking-wider transition-all duration-75 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
        isActive
          ? 'bg-lavender-soft text-primary border-2 border-primary/30 shadow-xs'
          : 'bg-transparent text-copy-muted hover:bg-slate-100 hover:text-copy border-2 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <Icon
          size={24}
          filled={isActive}
          className={isActive ? 'text-primary' : 'text-copy-muted'}
        />
        <span className="hidden lg:inline">{label}</span>
      </div>

      {badge !== undefined && (
        <span className="hidden lg:inline px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
          {badge}
        </span>
      )}
    </button>
  );
};
