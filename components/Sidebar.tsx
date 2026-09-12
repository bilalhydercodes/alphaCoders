'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SidebarItem } from './SidebarItem';
import {
  IconMap,
  IconBounties,
  IconLeague,
  IconShop,
  IconCodex,
} from './icons/LumiIcons';
import { Volume2, VolumeX, HelpCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenShortcuts: () => void;
  bountyCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenShortcuts,
  bountyCount,
}) => {
  const { user, logout, isMuted, toggleSound } = useAuth();

  if (!user) return null;

  return (
    <aside
      className="hidden lg:flex flex-col justify-between w-[256px] h-screen fixed left-0 top-0 border-r-2 border-slate-200 bg-white px-4 py-6 z-40 select-none"
      aria-label="Sidebar Navigation"
    >
      {/* Top: Brand Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-3">
          <div className="w-11 h-11 rounded-2xl bg-lavender-soft border-2 border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="/lumi/extracted/lumi-avatar.png"
              alt="Lumi companion"
              className="w-9 h-9 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-copy tracking-tight">Life RPG</h1>
            <p className="text-xs font-bold text-primary">with Lumi</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          <SidebarItem
            label="Quest Map"
            icon={IconMap}
            isActive={activeTab === 'map'}
            onClick={() => setActiveTab('map')}
          />
          <SidebarItem
            label="Bounties"
            icon={IconBounties}
            isActive={activeTab === 'bounties'}
            onClick={() => setActiveTab('bounties')}
            badge={bountyCount}
          />
          <SidebarItem
            label="Guild League"
            icon={IconLeague}
            isActive={activeTab === 'league'}
            onClick={() => setActiveTab('league')}
          />
          <SidebarItem
            label="Emporium"
            icon={IconShop}
            isActive={activeTab === 'shop'}
            onClick={() => setActiveTab('shop')}
          />
          <SidebarItem
            label="Codex"
            icon={IconCodex}
            isActive={activeTab === 'codex'}
            onClick={() => setActiveTab('codex')}
          />
        </nav>
      </div>

      {/* Bottom: Utility Controls & User Profile */}
      <div className="flex flex-col gap-3 pt-4 border-t-2 border-slate-100">
        {/* Audio Toggle & Shortcuts Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isMuted
                ? 'bg-slate-50 text-copy-muted border-slate-200 hover:bg-slate-100'
                : 'bg-lavender-soft text-primary border-primary/30'
            }`}
            title={isMuted ? 'Unmute procedural sound (M)' : 'Mute procedural sound (M)'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          <button
            onClick={onOpenShortcuts}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-copy-muted hover:text-copy hover:bg-slate-100 transition-all cursor-pointer"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-on flex items-center justify-center font-extrabold text-xs flex-shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-copy truncate">{user.username}</p>
              <p className="text-[10px] font-semibold text-primary truncate">Lv. {user.level} · {user.title}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-copy-muted hover:text-danger hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
