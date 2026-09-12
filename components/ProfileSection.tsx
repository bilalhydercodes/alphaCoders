'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLumi } from './lumi';
import { LumiPresenter } from './lumi/LumiPresenter';
import { sound } from '@/lib/sound';
import { Button } from './ui/Button';
import {
  IconTrophy,
  IconXpGem,
  IconGoldCoin,
  IconStreakFlame,
  IconSwords,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconLock,
  IconShield,
  IconSparkles,
  IconAttributeIntellect,
  IconAttributeStrength,
  IconAttributeAgility,
  IconAttributeVitality,
  IconAttributeSpirit,
} from './icons/LumiIcons';

interface ProfileStats {
  totalQuestsCompleted: number;
  totalXpEarned: number;
  totalGoldEarned: number;
  bestStreak: number;
  daysActive: number;
  totalBossDamage: number;
  categoryBreakdown: Record<string, number>;
}

interface ActivityLog {
  id: string;
  questTitle: string;
  category: string;
  difficulty: string;
  xpGained: number;
  goldGained: number;
  completedAt: string;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.FC<any>; color: string; bg: string }
> = {
  INTELLECT: { label: 'Intellect', icon: IconAttributeIntellect, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  STRENGTH: { label: 'Strength', icon: IconAttributeStrength, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  AGILITY: { label: 'Agility', icon: IconAttributeAgility, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  VITALITY: { label: 'Vitality', icon: IconAttributeVitality, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  SPIRIT: { label: 'Spirit', icon: IconAttributeSpirit, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
};

export const ProfileSection: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const lumi = useLumi();

  // Profile data from API
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Security (Password change) state
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);

      if (data.profile) {
        setEditUsername(data.profile.username || '');
        setEditBio(data.profile.bio || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleStartEdit = () => {
    if (user) {
      setEditUsername(user.username);
      setEditBio(user.bio || '');
    }
    setProfileMsg(null);
    setIsEditing(true);
    sound.playClick();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileMsg(null);
    sound.playClick();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsSaving(true);
    sound.playClick();

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editUsername,
          bio: editBio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile' });
        return;
      }

      sound.playQuestComplete();
      lumi.react('SELF_CARE', 'Your legend grows! Magnificent profile update ✨');
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      await refreshUser();
      await fetchProfile();
    } catch {
      setProfileMsg({ type: 'error', text: 'Network connection error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsChangingPass(true);
    sound.playClick();

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPassMsg({ type: 'error', text: data.error || 'Failed to change password' });
        return;
      }

      sound.playQuestComplete();
      setPassMsg({ type: 'success', text: 'Password changed successfully! Keep it secure.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      lumi.react('SELF_CARE', 'A fortress well-guarded! Security credentials updated.');
    } catch {
      setPassMsg({ type: 'error', text: 'Network connection error' });
    } finally {
      setIsChangingPass(false);
    }
  };

  if (!user) return null;

  const memberSinceDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* 1. Hero Identity Banner */}
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-6 shadow-xs relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-lavender-soft/40 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
            {/* 3D Character Avatar Display */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lavender-soft via-white to-lavender-soft border-2 border-primary/40 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
              <LumiPresenter variant="mini" height={80} showSpeech={false} interactive={false} className="w-full h-full" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-copy tracking-tight">{user.username}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-[#1F1730] text-xs font-black tracking-wide">
                  Lv. {user.level} · {user.title}
                </span>
              </div>

              {/* Bio Tagline */}
              <p className="text-sm font-medium text-copy-muted max-w-xl italic">
                {user.bio ? `"${user.bio}"` : 'No traveler tagline set yet. Click edit to etch your legend.'}
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-copy-muted mt-1">
                <span className="flex items-center gap-1">
                  <IconCalendar size={14} className="text-primary" />
                  Member since {memberSinceDate}
                </span>
                <span className="flex items-center gap-1">
                  <IconStreakFlame size={14} className="text-amber-500" />
                  Current streak: {user.streak} days
                </span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleStartEdit}
              className="gap-1.5 shrink-0 self-start md:self-center"
            >
              <IconEdit size={16} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t-2 border-slate-100 flex flex-col gap-5">
            <h3 className="text-sm font-black text-copy uppercase tracking-wider flex items-center gap-2">
              <IconSparkles size={16} className="text-primary" />
              Customize Adventurer Persona
            </h3>

            {/* Username & Bio Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-copy mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  maxLength={24}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-copy focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  required
                />
                <p className="text-[10px] text-copy-muted mt-1 font-semibold">3–24 characters</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-copy mb-1">
                  Traveler Tagline (Bio)
                </label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={160}
                  placeholder="A quiet philosopher pursuing mastery..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-copy focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
                <p className="text-[10px] text-copy-muted mt-1 font-semibold">{editBio.length}/160 characters</p>
              </div>
            </div>

            {profileMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  profileMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            <div className="flex items-center gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSaving}
                className="gap-1.5"
              >
                <IconCheck size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Persona'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Lifetime Achievement Stats Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-copy flex items-center gap-2">
            <IconTrophy size={20} className="text-amber-500" />
            Lifetime Chronicles
          </h2>
          <span className="text-xs font-bold text-copy-muted">All-Time Statistics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Total Quests */}
          <div className="bg-surface rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-copy-muted">Completed Quests</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <IconTrophy size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-copy">
              {stats?.totalQuestsCompleted ?? 0}
            </div>
            <span className="text-[11px] font-semibold text-copy-muted mt-1">bounties & habits conquered</span>
          </div>

          {/* Total XP Earned */}
          <div className="bg-surface rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-copy-muted">Total XP Earned</span>
              <div className="w-8 h-8 rounded-xl bg-lavender-soft text-primary flex items-center justify-center">
                <IconXpGem size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-primary">
              {(stats?.totalXpEarned ?? 0).toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-copy-muted mt-1">mastery energy acquired</span>
          </div>

          {/* Total Gold Earned */}
          <div className="bg-surface rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-copy-muted">Total Gold Earned</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <IconGoldCoin size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-500">
              {(stats?.totalGoldEarned ?? 0).toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-copy-muted mt-1">coins gathered across realms</span>
          </div>

          {/* Best Streak */}
          <div className="bg-surface rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-copy-muted">Best Streak</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <IconStreakFlame size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-500">
              {Math.max(stats?.bestStreak ?? 0, user.streak)} <span className="text-sm font-bold">days</span>
            </div>
            <span className="text-[11px] font-semibold text-copy-muted mt-1">highest momentum achieved</span>
          </div>

          {/* Days Active */}
          <div className="bg-surface rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-copy-muted">Days Active</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IconCalendar size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-copy">
              {Math.max(stats?.daysActive ?? 0, 1)} <span className="text-sm font-bold">days</span>
            </div>
            <span className="text-[11px] font-semibold text-copy-muted mt-1">logged quest completions</span>
          </div>

          {/* Boss Damage */}
          <div className="bg-surface rounded-2xl border-2 border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-copy-muted">Boss Damage</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <IconSwords size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-600">
              {(stats?.totalBossDamage ?? 0).toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-copy-muted mt-1">damage dealt to dungeon bosses</span>
          </div>
        </div>
      </div>

      {/* 3. Category Quest Distribution */}
      {stats && stats.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && !user.privacyMode && (
        <div className="bg-surface rounded-2xl border-2 border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-black text-copy uppercase tracking-wider mb-4 flex items-center gap-2">
            <IconShield size={16} className="text-primary" />
            Specialization Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(CATEGORY_CONFIG).map(([catKey, cfg]) => {
              const count = stats.categoryBreakdown[catKey] || 0;
              const pct = stats.totalQuestsCompleted > 0
                ? Math.round((count / stats.totalQuestsCompleted) * 100)
                : 0;
              const IconComp = cfg.icon;

              return (
                <div
                  key={catKey}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center justify-between gap-1 ${cfg.bg}`}
                >
                  <IconComp size={22} className={cfg.color} />
                  <span className="text-xs font-extrabold text-copy">{cfg.label}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black text-copy">{count}</span>
                    <span className="text-[10px] font-bold text-copy-muted">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy mode message */}
      {user.privacyMode && (
        <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <IconShield size={20} className="text-slate-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-700">Privacy Mode Active</h3>
              <p className="text-xs text-slate-500">Your detailed stats are hidden for privacy</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Recent Activity Log Timeline */}
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-copy uppercase tracking-wider flex items-center gap-2">
            <IconCalendar size={16} className="text-primary" />
            Recent Activity Log
          </h3>
          <span className="text-xs font-semibold text-copy-muted">
            {recentActivity.length} recent completion{recentActivity.length === 1 ? '' : 's'}
          </span>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-copy-muted">
            <p className="text-sm font-bold">No quests logged yet.</p>
            <p className="text-xs mt-1">Complete bounties on the quest board to build your adventure journal!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map((log) => {
              const catCfg = CATEGORY_CONFIG[log.category] || CATEGORY_CONFIG.INTELLECT;
              const IconComp = catCfg.icon;
              const dateStr = new Date(log.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${catCfg.bg}`}
                    >
                      <IconComp size={18} className={catCfg.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-copy truncate">{log.questTitle}</p>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-copy-muted">
                        <span>{catCfg.label}</span>
                        <span>•</span>
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg bg-lavender-soft text-primary text-xs font-black flex items-center gap-1">
                      <IconXpGem size={12} />
                      +{log.xpGained} XP
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-black flex items-center gap-1">
                      <IconGoldCoin size={12} />
                      +{log.goldGained} G
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Account Security Panel (Collapsible) */}
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-5 shadow-xs">
        <button
          type="button"
          onClick={() => {
            setIsSecurityOpen(!isSecurityOpen);
            setPassMsg(null);
            sound.playClick();
          }}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-copy flex items-center justify-center">
              <IconLock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-copy">Account Security</h3>
              <p className="text-xs font-semibold text-copy-muted">
                Manage your credentials and password protection
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary hover:underline">
            {isSecurityOpen ? 'Hide' : 'Change Password'}
          </span>
        </button>

        {isSecurityOpen && (
          <form onSubmit={handleChangePassword} className="mt-5 pt-5 border-t-2 border-slate-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-copy mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-copy focus:outline-none focus:border-primary focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-copy mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-copy focus:outline-none focus:border-primary focus:bg-white"
                  placeholder="Min 6 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-copy mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-copy focus:outline-none focus:border-primary focus:bg-white"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>

            {passMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  passMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {passMsg.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isChangingPass}
                className="gap-1.5"
              >
                <IconLock size={16} />
                <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
