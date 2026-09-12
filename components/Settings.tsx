'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLumi } from './lumi';
import { sound } from '@/lib/sound';
import {
  IconVolumeOn,
  IconSparkles,
  IconCalendar,
  IconEnergy,
  IconLock,
  IconShield,
} from './icons/LumiIcons';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  disabled?: boolean;
}

/**
 * Exact toggle switch matching the reference screenshot:
 * Smooth solid purple pill (#7042C1) when active, slate when inactive, with solid white circular thumb.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        sound.playClick();
        onChange(!checked);
      }}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#7042C1]' : 'bg-slate-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-sm transform transition duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export const Settings: React.FC = () => {
  const { user, isMuted, toggleSound, refreshUser } = useAuth();
  const lumi = useLumi();

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [dailyReminders, setDailyReminders] = useState(user?.dailyReminders ?? true);
  const [focusModeAuto, setFocusModeAuto] = useState(user?.focusModeAuto ?? false);
  const [soundEffects, setSoundEffects] = useState(!isMuted);
  const [privacyMode, setPrivacyMode] = useState(user?.privacyMode ?? false);

  // Segmented resonance style
  const [chimeTheme, setChimeTheme] = useState<'harmonic' | 'crystal' | 'fanfare'>('fanfare');
  const [focusDuration, setFocusDuration] = useState<'15' | '25' | '45' | '60'>('25');

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [saveMsg, setSaveMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Sync state with user
  useEffect(() => {
    if (user) {
      setNotificationsEnabled(user.notificationsEnabled ?? true);
      setDailyReminders(user.dailyReminders ?? true);
      setFocusModeAuto(user.focusModeAuto ?? false);
      setPrivacyMode(user.privacyMode ?? false);
      setSoundEffects(!isMuted);
    }
  }, [user, isMuted]);

  // Load chime tone preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('liferpg_chime_theme') as any;
      if (savedTheme) setChimeTheme(savedTheme);
      const savedFocus = localStorage.getItem('liferpg_focus_duration') as any;
      if (savedFocus) setFocusDuration(savedFocus);
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEffects(enabled);
    if (enabled === isMuted) {
      toggleSound();
    }
    setHasUnsavedChanges(true);
    localStorage.setItem('liferpg_sound_enabled', enabled.toString());
  };

  const handleTestChime = () => {
    sound.playQuestComplete();
    lumi.react('SELF_CARE', 'A resonant note from the guild chimes! 🎵');
  };

  const handleSaveSettings = async () => {
    setSaveMsg(null);
    setIsSaving(true);
    sound.playClick();

    try {
      localStorage.setItem('liferpg_chime_theme', chimeTheme);
      localStorage.setItem('liferpg_focus_duration', focusDuration);

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          settings: {
            notificationsEnabled,
            dailyReminders,
            focusModeAuto,
            privacyMode,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveMsg({ type: 'error', text: data.error || 'Failed to update settings' });
        return;
      }

      sound.playQuestComplete();
      lumi.react('SELF_CARE', 'Codex settings successfully preserved! ✨');
      setSaveMsg({ type: 'success', text: 'All modifications preserved!' });
      setHasUnsavedChanges(false);
      await refreshUser();
    } catch {
      setSaveMsg({ type: 'error', text: 'Network communication interrupted' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-16">
      {/* 1. BARD'S ACOUSTICS Card */}
      <section className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFFC] text-[#7042C1] flex items-center justify-center shrink-0">
              <IconVolumeOn size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase">BARD'S ACOUSTICS</h2>
              <p className="text-xs text-slate-500 font-medium">Harmonic chimes & auditory feedback</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestChime}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4EFFC] hover:bg-[#ECE3FA] text-[#7042C1] text-xs font-bold transition-colors cursor-pointer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#7042C1]"
            >
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            <span>Sample Chime</span>
          </button>
        </div>

        {/* Harmonic Audio Chimes Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFFC] text-[#7042C1] flex items-center justify-center shrink-0">
              <IconVolumeOn size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Harmonic Audio Chimes</p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Procedural harp ascending chords for quest completion, streak surges, and level promotions
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={soundEffects}
            onChange={(val) => handleToggleSound(val)}
            label="Harmonic Audio Chimes"
          />
        </div>

        {/* Chime Resonance Style Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">Chime Resonance Style</p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Select the timbre for victory flourishes</p>
          </div>
          <div className="inline-flex items-center bg-white p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => {
                setChimeTheme('harmonic');
                sound.playClick();
                setHasUnsavedChanges(true);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                chimeTheme === 'harmonic'
                  ? 'bg-[#7042C1] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Harmonic Harp
            </button>
            <div className="w-px h-4 bg-slate-200 shrink-0" />
            <button
              type="button"
              onClick={() => {
                setChimeTheme('crystal');
                sound.playClick();
                setHasUnsavedChanges(true);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                chimeTheme === 'crystal'
                  ? 'bg-[#7042C1] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crystal Bells
            </button>
            <div className="w-px h-4 bg-slate-200 shrink-0" />
            <button
              type="button"
              onClick={() => {
                setChimeTheme('fanfare');
                sound.playClick();
                setHasUnsavedChanges(true);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                chimeTheme === 'fanfare'
                  ? 'bg-[#7042C1] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fanfare
            </button>
          </div>
        </div>
      </section>

      {/* 2. GUILD COURIER DISPATCHES Card */}
      <section className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF8EC] text-[#F59E0B] flex items-center justify-center shrink-0">
            <IconSparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase">GUILD COURIER DISPATCHES</h2>
            <p className="text-xs text-slate-500 font-medium">Bounty updates & momentum protection</p>
          </div>
        </div>

        {/* Herald Dispatches Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#FEF8EC] text-[#F59E0B] flex items-center justify-center shrink-0">
              <IconSparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Herald Dispatches</p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Receive browser alerts when urgent bounties approach dusk or deadlines loom
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={notificationsEnabled}
            onChange={(val) => {
              setNotificationsEnabled(val);
              setHasUnsavedChanges(true);
            }}
            label="Herald Dispatches"
          />
        </div>

        {/* Dawn Bounty Notice Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#FEF8EC] text-[#F59E0B] flex items-center justify-center shrink-0">
              <IconCalendar size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dawn Bounty Notice</p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Daily briefing when your habit checklist and daily bounty boards replenish
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={dailyReminders}
            onChange={(val) => {
              setDailyReminders(val);
              setHasUnsavedChanges(true);
            }}
            label="Dawn Bounty Notice"
          />
        </div>
      </section>

      {/* 3. CHRONO-SANCTUARY Card */}
      <section className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
            <IconEnergy size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase">CHRONO-SANCTUARY</h2>
            <p className="text-xs text-slate-500 font-medium">Focus mode & deep work sprints</p>
          </div>
        </div>

        {/* Auto-Engage Focus Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <IconEnergy size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Auto-Engage Chrono Trance</p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Automatically start focus sessions when opening active bounties
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={focusModeAuto}
            onChange={(val) => {
              setFocusModeAuto(val);
              setHasUnsavedChanges(true);
            }}
            label="Auto-Engage Chrono Trance"
          />
        </div>

        {/* Focus Duration Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">Default Focus Duration</p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Standard interval for your deep work sessions</p>
          </div>
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
            {[
              { val: '15', label: '15m' },
              { val: '25', label: '25m' },
              { val: '45', label: '45m' },
              { val: '60', label: '60m' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => {
                  setFocusDuration(preset.val as any);
                  sound.playClick();
                  setHasUnsavedChanges(true);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  focusDuration === preset.val
                    ? 'bg-[#7042C1] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLOAK OF SHADOWS Card */}
      <section className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFFC] text-[#7042C1] flex items-center justify-center shrink-0">
            <IconLock size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase">CLOAK OF SHADOWS</h2>
            <p className="text-xs text-slate-500 font-medium">Leaderboard presence & stealth visibility</p>
          </div>
        </div>

        {/* Privacy Mode Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FD] border border-slate-100">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFFC] text-[#7042C1] flex items-center justify-center shrink-0">
              <IconShield size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Incognito Wanderer Mode</p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Hide personal stats and achievements from public view
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={privacyMode}
            onChange={(val) => {
              setPrivacyMode(val);
              setHasUnsavedChanges(true);
            }}
            label="Incognito Wanderer Mode"
          />
        </div>
      </section>

      {/* 5. Exact Bottom Floating Action Bar matching reference photo */}
      <div className="sticky bottom-4 z-30 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-center justify-between gap-4">
        <div className="min-w-0">
          {saveMsg ? (
            <div
              className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                saveMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {saveMsg.type === 'success' && <span>✨</span>}
              {saveMsg.text}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
              {hasUnsavedChanges
                ? 'You have uncommitted modifications in this realm'
                : 'Codex preferences are synchronized'}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2.5 h-11 sm:h-12 px-6 rounded-xl bg-[#7042C1] hover:bg-[#6236AB] active:bg-[#542B95] text-white font-bold text-sm transition-all duration-150 cursor-pointer shadow-md shadow-purple-950/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
        >
          {/* Circular Check Icon (Exact Circle outline with check inside) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>{isSaving ? 'Preserving...' : 'Preserve Codex Settings'}</span>
        </button>
      </div>
    </div>
  );
};